import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom'; // Import MemoryRouter
import App from './App';
import PracticeWords from './PracticeWords';
import LearnWords from './LearnWords';
import AddNewWords from './AddNewWords';

describe('App component', () => {
    it('renders correctly', () => {
        const { getByText } = render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );

        expect(getByText('Word Learner')).toBeInTheDocument();
    });

    it('renders learn words link', () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );

        expect(screen.getByText('Learn words')).toBeInTheDocument();
    });

    it('renders add new words link', () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );

        expect(screen.getByText('Add new words')).toBeInTheDocument();
    });

    it('renders practice words link', () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );

        expect(screen.getByText('Practice words')).toBeInTheDocument();
    });

    it('renders learn words route', () => {
        render(
            <MemoryRouter initialEntries={['/learn-words']}>
                <Routes>
                    <Route path="/learn-words" element={<LearnWords />} />
                </Routes>
            </MemoryRouter>
        );

        // Assert something about the LearnWords component
        expect(screen.getByText('Learn Words')).toBeInTheDocument();
    });

    it('renders add new words route', () => {
        render(
            <MemoryRouter initialEntries={['/add-new-words']}>
                <Routes>
                    <Route path="/add-new-words" element={<AddNewWords />} />
                </Routes>
            </MemoryRouter>
        );

        // Assert something about the AddNewWords component
        expect(screen.getByText('Add New Word')).toBeInTheDocument();
    });

    it('renders practice words route', () => {
        render(
            <MemoryRouter initialEntries={['/practice-words']}>
                <Routes>
                    <Route path="/practice-words" element={<PracticeWords />} />
                </Routes>
            </MemoryRouter>
        );

        // Assert something about the PracticeWords component
        expect(screen.getByText('Practice Words')).toBeInTheDocument();
    });
});