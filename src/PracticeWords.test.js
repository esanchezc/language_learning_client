import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import PracticeWords from './PracticeWords';

beforeEach(() => {
    jest.resetModules();
    global.fetch = jest.fn((url) => {
        if (url.includes('/translations/')) {
            return Promise.resolve({
                json: () =>
                    Promise.resolve({ translation: 'Manzana' }),
            });
        } else if (url.startsWith('/words/')) {
            const language = url.split('/').pop();
            return Promise.resolve({
                json: () =>
                    Promise.resolve([
                        { word: 'Apple', id: 1, translation: 'Manzana' },
                        { word: 'Banana', id: 2, translation: 'Plátano' },
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

const setup = async () => {
    const utils = render(<PracticeWords />);
    await waitFor(() => screen.getByRole('option', { name: 'Spanish' }));
    const select = utils.getByTestId('select-language');
    const option = utils.getByText('Spanish');
    fireEvent.change(select, { target: { value: 'es' } });
    await waitFor(() => utils.getByTestId('answer-input'));
    const wordElement = utils.getByTestId('word-label');
    const wordText = wordElement.textContent;
    return { ...utils, word: wordText };
};

describe('PracticeWords', () => {
    it('renders correctly', () => {
        const { getByText } = render(<PracticeWords />);
        expect(getByText('Practice Words')).toBeInTheDocument();
    });

    it('fetches languages on mount', async () => {
        await setup();
        expect(fetch).toHaveBeenCalledTimes(2);
        expect(fetch).toHaveBeenNthCalledWith(1, '/languages');
    });

    it('handles language change', async () => {
        const { getByTestId } = await setup();
        const wordElement = getByTestId('word-label');
        const wordText = wordElement.textContent;
        expect(fetch).toHaveBeenCalledTimes(2);
        expect(fetch).toHaveBeenNthCalledWith(2, '/words/es');
    });

    it('renders celebration message when all words have been answered', async () => {
        const { getByText } = render(<PracticeWords />);
        await waitFor(() => getByText('Congratulations! You have correctly answered all words.'));
    });

    it('calls checkUserAnswer when Check button is clicked', async () => {
        const { getByText } = await setup();
        const checkButton = getByText('Check');
        fireEvent.click(checkButton);
        expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('renders correct translation when answer is incorrect', async () => {
        const { getByText, getByTestId, word } = await setup();
        const words = [
            { word: 'Apple', id: 1, translation: 'Manzana' },
            { word: 'Banana', id: 2, translation: 'Plátano' },
        ];
        const correctTranslation = words.find(w => w.word === word).translation;

        const wordElement = getByTestId('word-label');
        const wordText = wordElement.textContent;

        const checkButton = getByText('Check');

        // Simulate answering the word incorrectly 3 times
        for (let i = 0; i < 3; i++) {
            const input = getByTestId('answer-input');
            fireEvent.change(input, { target: { value: 'wrong answer' } });
            fireEvent.click(checkButton);
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Wait for the correct translation to be rendered
        await waitFor(() => getByText(`Correct translation: ${correctTranslation}`));
    });

    it('renders Next button when answer is correct', async () => {
        const { getByText, getByTestId } = await setup();

        const input = getByTestId('answer-input');
        fireEvent.change(input, { target: { value: 'Manzana' } });

        const checkButton = getByText('Check');
        fireEvent.click(checkButton);

        await waitFor(() => getByText('Next'));
    });

    it('renders Skip button when answer is incorrect', async () => {
        const { getByText, getByTestId } = await setup();

        const answerInput = getByTestId('answer-input');
        fireEvent.change(answerInput, { target: { value: 'some answer' } });

        const checkButton = getByText('Check');
        fireEvent.click(checkButton);

        await waitFor(() => getByText('Skip'));
    });

    it('renders practice again button and displays celebration message when all words have been answered', async () => {
        const { getByText, getByTestId } = await setup();
        for (let i = 0; i < 2; i++) {
            const wordLabel = getByTestId('word-label');
            const word = wordLabel.textContent;
            const response = await fetch(`/words/${word}/translations/es`);
            const data = await response.json();
            const translation = data.translation;
            const input = getByTestId('answer-input');
            fireEvent.change(input, { target: { value: translation } });
            const checkButton = getByText('Check');
            fireEvent.click(checkButton);

            // Only wait for the 'Next' button if it's not the last word
            if (i < 1) {
                await waitFor(() => getByText('Next'));
                const nextButton = getByText('Next');
                fireEvent.click(nextButton);
            }
        }
        await waitFor(() => getByText('Practice again'));
        await waitFor(() => getByText('Congratulations! You have correctly answered all words.'));
    });

    it('handles image loading errors', async () => {
        const words = [{ word: 'Fruit', id: 1, translation: 'Fruta' }];
        jest.spyOn(global, 'fetch').mockImplementation((url) => {
            if (url.includes('/translations/')) {
                return Promise.resolve({
                    json: () => Promise.resolve({ translation: 'Manzana' }),
                });
            } else if (url.startsWith('/words/')) {
                return Promise.resolve({
                    json: () => Promise.resolve(words),
                });
            } else if (url === '/languages') {
                return Promise.resolve({
                    json: () => Promise.resolve([
                        { name: 'Spanish', code: 'es' },
                        { name: 'English', code: 'en' },
                    ]),
                });
            } else {
                throw new Error(`Unknown URL: ${url}`);
            }
        });

        const utils = render(<PracticeWords />);
        await waitFor(() => utils.getByAltText('Fruit'));
        const image = utils.getByAltText('Fruit');
        expect(image.src).toBe('http://localhost/icons/fruit.png');
        // Simulate an image loading error
        fireEvent.error(image);
        // Wait for the onError event handler to be called
        await waitFor(() => expect(image.src).toBe('http://localhost/icons/empty-basket.png'));
    });
});