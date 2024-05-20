import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import PracticeWords from './PracticeWords';

beforeEach(() => {
    jest.resetModules();
    global.fetch = jest.fn((url) => {
        if (url.includes('/translations/')) {
            return Promise.resolve({
                json: () =>
                    Promise.resolve({ translation: 'Manzana' }), // Return a single object with a translation property
            });
        } else if (url.startsWith('/words/')) {
            const language = url.split('/').pop();
            return Promise.resolve({
                json: () =>
                    Promise.resolve([
                        { word: 'Apple', id: 1, translation: 'Manzana' }, // Return the first word
                        { word: 'Banana', id: 2, translation: 'Plátano' }, // Return the second word
                    ]),
            });
        } else if (url === '/languages') {
            return Promise.resolve({
                json: () =>
                    Promise.resolve([
                        { name: 'Spanish', code: 'es' },
                        { name: 'English', code: 'en' },
                    ]),
            });
        } else {
            throw new Error(`Unknown URL: ${url}`);
        }
    });
});

describe('PracticeWords', () => {
    it('renders correctly', () => {
        const { getByText } = render(<PracticeWords />);
        expect(getByText('Practice Words')).toBeInTheDocument();
    });

    it('fetches languages on mount', async () => {
        const { getByText } = render(<PracticeWords />);
        await waitFor(() => getByText('Select a language'));

        expect(fetch).toHaveBeenCalledTimes(2);
        expect(fetch).toHaveBeenNthCalledWith(1, '/languages');
    });

    it('handles language change', async () => {
        const { getByText, getByTestId } = render(<PracticeWords />);

        // Wait for the languages to be fetched
        await waitFor(() => getByText('Select a language'));

        // Now the select element should be available
        const select = getByTestId('select-language');
        const option = getByText('Spanish');

        fireEvent.change(select, { target: { value: 'es' } });

        // Wait for the words to be fetched
        await waitFor(() => getByTestId('answer-input'));

        const wordElement = getByTestId('word-label'); // add a data-testid="word-label" to your label
        const wordText = wordElement.textContent;

        expect(fetch).toHaveBeenCalledTimes(2);
        expect(fetch).toHaveBeenNthCalledWith(2, '/words/es');
    });

    it('renders celebration message when all words have been answered', async () => {
        const { getByText } = render(<PracticeWords />);
        await waitFor(() => getByText('Congratulations! You have correctly answered all words.'));
    });

    it('calls checkUserAnswer when Check button is clicked', async () => {
        const { getByText, getByTestId } = render(<PracticeWords />);
        await waitFor(() => getByText('Select a language'));

        const select = getByTestId('select-language');
        const option = getByText('Spanish');

        fireEvent.change(select, { target: { value: 'es' } });
        await waitFor(() => getByTestId('answer-input'));

        const wordElement = getByTestId('word-label'); // add a data-testid="word-label" to your label
        const wordText = wordElement.textContent;

        const checkButton = getByText('Check');
        fireEvent.click(checkButton);

        expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('renders correct translation when answer is incorrect', async () => {
        const { getByText, getByTestId } = render(<PracticeWords />);

        // Wait for the languages to be fetched
        await waitFor(() => getByText('Select a language'));

        // Now the select element should be available
        const select = getByTestId('select-language');
        const option = getByText('Spanish');

        const correctTranslation = await global.fetch('/translations/')
            .then(response => response.json())
            .then(data => data.translation);

        fireEvent.change(select, { target: { value: 'es' } });

        // Wait for the words to be fetched
        await waitFor(() => getByTestId('answer-input'));

        const wordElement = getByTestId('word-label');
        const wordText = wordElement.textContent;

        const checkButton = getByText('Check');

        // Simulate answering the word incorrectly 3 times
        for (let i = 0; i < 3; i++) {
            const input = getByTestId('answer-input');
            fireEvent.change(input, { target: { value: 'wrong answer' } }); // Send an incorrect answer
            fireEvent.click(checkButton);
            await new Promise(resolve => setTimeout(resolve, 100)); // Add a 100ms delay
        }

        // Wait for the correct translation to be rendered
        await waitFor(() => getByText(`Correct translation: ${correctTranslation}`));
    });

    it('renders Next button when answer is correct', async () => {
        const { getByText, getByTestId } = render(<PracticeWords />);
        await waitFor(() => screen.getByRole('option', { name: 'Spanish' }));

        const select = getByTestId('select-language');
        const option = getByText('Spanish');

        fireEvent.change(select, { target: { value: 'es' } });
        await waitFor(() => getByTestId('answer-input'));

        const wordElement = getByTestId('word-label'); // add a data-testid="word-label" to your label
        const wordText = wordElement.textContent;

        const input = getByTestId('answer-input');
        fireEvent.change(input, { target: { value: 'Manzana' } });

        const checkButton = getByText('Check');
        fireEvent.click(checkButton);

        await waitFor(() => getByText('Next'));
    });

    it.only('renders Skip button when answer is incorrect', async () => {
        const { getByText, getByTestId } = render(<PracticeWords />);

        // Wait for the component to finish loading
        await waitFor(() => getByText('Check'));

        // Simulate a change event on the input field with a valid answer
        const answerInput = getByTestId('answer-input');
        fireEvent.change(answerInput, { target: { value: 'some answer' } });

        // Simulate a click on the Check button
        const checkButton = getByText('Check');
        fireEvent.click(checkButton);

        // Now the Skip button should be rendered
        await waitFor(() => getByText('Skip'));
    });
});