import React from 'react';
import { render, fireEvent, waitFor, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axiosMock from 'axios';
import AddNewWords from './AddNewWords';

jest.mock('axios');

describe('AddNewWords component', () => {
    const setup = async () => {
        const utils = render(<AddNewWords />);
        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
        return utils;
    };

    beforeEach(() => {
        global.fetch = jest.fn();
        global.fetch.mockImplementationOnce(() => Promise.resolve({
            json: () => Promise.resolve([
                { id: 1, code: 'en', name: 'English' },
                { id: 2, code: 'fr', name: 'French' },
            ]),
        }));
    });

    afterEach(() => {
        axiosMock.post.mockReset();
        cleanup();
    });

    it('renders the component', async () => {
        const { container } = await setup();
        expect(container.querySelector('h1')).toHaveTextContent('Add New Word');
    });

    it('fetches languages on mount', async () => {
        await setup();
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('adds a new translation', async () => {
        const { getByText } = await setup();
        const addTranslationButton = getByText('Add Translation');
        fireEvent.click(addTranslationButton);
        await waitFor(() => expect(screen.getAllByText('Language Code:')).toHaveLength(2));
    });

    it('removes a translation', async () => {
        const { getAllByText, getByText } = await setup();
        const removeTranslationButton = getAllByText('Remove Translation')[0];
        fireEvent.click(removeTranslationButton);
        await waitFor(() => expect(screen.queryByText('Language Code:')).not.toBeInTheDocument());
    });

    it('submits the form with valid data', async () => {
        const { getByText, getByLabelText } = await setup();
        const wordInput = getByLabelText('Word:');
        const languageSelect = screen.getByTestId('language-select');
        const translationInput = getByLabelText('Translation:');

        // Wait for the options to be available
        await waitFor(() => expect(screen.getByText('English')).toBeInTheDocument());

        fireEvent.change(wordInput, { target: { value: 'test' } });
        userEvent.selectOptions(languageSelect, 'en'); // Select the 'en' language code
        fireEvent.change(translationInput, { target: { value: 'test translation' } });

        axiosMock.post.mockImplementationOnce(() => Promise.resolve({
            data: {
                message: 'Word added successfully',
            },
        }));

        const submitButton = getByText('Create Word');
        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.post).toHaveBeenCalledTimes(1));
        expect(axiosMock.post).toHaveBeenCalledWith('/words', {
            word: 'test',
            translations: [{ languageCode: 'en', translation: 'test translation' }],
        });
    });

    it('displays error message on failed form submission', async () => {
        const { getByText, getByLabelText } = await setup();
        const wordInput = getByLabelText('Word:');
        const languageSelect = screen.getByTestId('language-select');
        const translationInput = getByLabelText('Translation:');

        fireEvent.change(wordInput, { target: { value: 'test' } });
        fireEvent.change(languageSelect, { target: { value: 'en' } });
        fireEvent.change(translationInput, { target: { value: 'test translation' } });

        axiosMock.post.mockImplementationOnce(() => Promise.reject({
            response: {
                data: {
                    message: 'Error adding word',
                },
            },
        }));

        const submitButton = getByText('Create Word');
        fireEvent.click(submitButton);

        await waitFor(() => expect(screen.getByText('Error adding word')).toBeInTheDocument());
    });
});