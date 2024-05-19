import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { act } from 'react';
import LearnWords from './LearnWords';

describe.skip('LearnWords component', () => {
    const originalFetch = global.fetch;

    beforeEach(() => {
        global.fetch = jest.fn().mockImplementation((url) => {
            if (url === '/languages') {
                return Promise.resolve({
                    json: () => Promise.resolve([
                        { code: 'es', name: 'Spanish' },
                        { code: 'fr', name: 'French' },
                    ]),
                });
            } else if (url === '/words') {
                return Promise.resolve({
                    json: () => Promise.resolve([{ id: 1, word: 'hello' }]), // Return a single word
                });
            } else if (url.startsWith('/words/')) {
                const wordId = url.split('/')[2];
                const languageCode = url.split('/')[4];
                return Promise.resolve({
                    json: () => Promise.resolve({ translation: `Translation for word ${wordId} in ${languageCode}` }),
                });
            }
        });
    });

    afterEach(() => {
        global.fetch = originalFetch;
    });

    it('renders the language select options', async () => {
        await act(async () => {
            render(<LearnWords />);
        });

        // Use a regex matcher or a custom function to match the text
        await waitFor(() => screen.getByText(/Select a language/));

        expect(screen.getByRole('option', { name: 'Spanish' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'French' })).toBeInTheDocument();
    });

    it('renders the word image and translation', async () => {
        const { getByAltText, getByText } = render(<LearnWords />);
        await waitFor(() => getByAltText('Word'));
        expect(getByText('hello')).toBeInTheDocument();
        await waitFor(() => {
            const translationElement = getByText('Translation for word 1 in es');
            return translationElement.textContent !== '';
        });
    });

    it('calls the handleNextClick function when the next button is clicked', async () => {
        const { getByText } = render(<LearnWords />);
        await waitFor(() => getByText('Next'));
        const nextButton = getByText('Next');
        fireEvent.click(nextButton);
        expect(fetch).toHaveBeenCalledTimes(2); // fetch words, languages and translation
    });

    it('calls the handlePrevClick function when the prev button is clicked', async () => {
        const { getByText } = render(<LearnWords />);
        await waitFor(() => getByText('Prev'));
        const prevButton = getByText('Prev');
        fireEvent.click(prevButton);
        expect(fetch).toHaveBeenCalledTimes(2); // fetch words, languages and translation
    });

    it('calls the handleLanguageChange function when the language select is changed', async () => {
        const { getByText, getByTestId } = render(<LearnWords />);
        await waitFor(() => getByText('Spanish')); // Wait for the options to be populated
        const languageSelect = getByTestId('language-select');
        await act(async () => {
            fireEvent.change(languageSelect, { target: { value: 'es' } });
        });
        expect(fetch).toHaveBeenCalledTimes(3); // fetch words and translation
    });

    it('renders an error message when the translation is not found', async () => {
        const originalFetch = global.fetch;
        global.fetch = jest.fn().mockImplementation((url) => {
            if (url.startsWith('/words/')) {
                return Promise.resolve({
                    text: () => Promise.resolve(''), // Return an empty string to simulate a missing translation
                });
            } else {
                return Promise.resolve({
                    json: () => Promise.resolve([
                        { code: 'es', name: 'Spanish' },
                        { code: 'fr', name: 'French' },
                    ]),
                });
            }
        });
        const { getByText } = render(<LearnWords />);
        const wordIndex = 0; // Set the wordId to a valid value
        await waitFor(() => getByText('Error parsing JSON response.')); // Wait for the error message
        expect(getByText('Add the missing translation')).toBeInTheDocument();
        global.fetch = originalFetch; // Restore the original fetch function
    });

    it('renders an error message when there is an error parsing the JSON response', async () => {
        fetch.mockImplementation((url) => {
            if (url === '/words') {
                return Promise.resolve({
                    json: () => Promise.reject(new Error('Error parsing JSON response.')), // Return a rejected promise with an error
                });
            } else if (url === '/languages') {
                return Promise.resolve({
                    json: () => Promise.resolve([{ code: 'es', name: 'Spanish' }, { code: 'fr', name: 'French' }]),
                });
            }
        });
        const { getByText } = render(<LearnWords />);
        await waitFor(() => getByText('Error parsing JSON response.'));
        expect(getByText('Add the missing translation')).toBeInTheDocument();
    });
});