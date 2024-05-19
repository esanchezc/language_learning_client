import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import LearnWords from './LearnWords';

describe('LearnWords component', () => {
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
                    json: () => Promise.resolve([{ id: 1, word: 'hello' }]),
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
        render(<LearnWords />);
        await waitFor(() => screen.getByText('Spanish'));
        expect(screen.getByRole('option', { name: 'Spanish' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'French' })).toBeInTheDocument();
    });

    it('renders the word image and translation', async () => {
        render(<LearnWords />);
        await waitFor(() => screen.getByAltText('Word'));
        expect(screen.getByText('hello')).toBeInTheDocument();
        await waitFor(() => screen.getByText('Translation for word 1 in es'));
    });

    it('calls the handleNextClick function when the next button is clicked', async () => {
        render(<LearnWords />);
        await waitFor(() => screen.getByText('Next'));
        fireEvent.click(screen.getByText('Next'));
        expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('calls the handlePrevClick function when the prev button is clicked', async () => {
        render(<LearnWords />);
        await waitFor(() => screen.getByText('Prev'));
        fireEvent.click(screen.getByText('Prev'));
        expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('calls the handleLanguageChange function when the language select is changed', async () => {
        render(<LearnWords />);
        await waitFor(() => screen.getByText('Spanish'));
        fireEvent.change(screen.getByTestId('language-select'), { target: { value: 'es' } });
        expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    it('renders an error message when the translation is not found', async () => {
        global.fetch.mockImplementation((url) => {
            if (url.startsWith('/words/')) {
                return Promise.resolve({
                    text: () => Promise.resolve(''),
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
        render(<LearnWords />);
        await waitFor(() => screen.getByText('Error parsing JSON response.'));
        expect(screen.getByText('Add the missing translation')).toBeInTheDocument();
    });

    it('renders an error message when there is an error parsing the JSON response', async () => {
        global.fetch.mockImplementation((url) => {
            if (url === '/words') {
                return Promise.resolve({
                    json: () => Promise.reject(new Error('Error parsing JSON response.')),
                });
            } else if (url === '/languages') {
                return Promise.resolve({
                    json: () => Promise.resolve([{ code: 'es', name: 'Spanish' }, { code: 'fr', name: 'French' }]),
                });
            }
        });
        render(<LearnWords />);
        await waitFor(() => screen.getByText('Error parsing JSON response.'));
        expect(screen.getByText('Add the missing translation')).toBeInTheDocument();
    });
});