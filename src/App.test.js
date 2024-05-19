import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom'; 
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

    it('renders all links', () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );

        expect(screen.getByText('Learn words')).toBeInTheDocument();
        expect(screen.getByText('Add new words')).toBeInTheDocument();
        expect(screen.getByText('Practice words')).toBeInTheDocument();
    });

    describe('routes', () => {
        const routes = [
            { path: '/learn-words', element: <LearnWords />, expectedText: 'Learn Words' },
            { path: '/add-new-words', element: <AddNewWords />, expectedText: 'Add New Word' },
            { path: '/practice-words', element: <PracticeWords />, expectedText: 'Practice Words' },
        ];

        routes.forEach((route) => {
            it(`renders ${route.path} route`, () => {
                render(
                    <MemoryRouter initialEntries={[route.path]}>
                        <Routes>
                            <Route path={route.path} element={route.element} />
                        </Routes>
                    </MemoryRouter>
                );

                expect(screen.getByText(route.expectedText)).toBeInTheDocument();
            });
        });
    });
});