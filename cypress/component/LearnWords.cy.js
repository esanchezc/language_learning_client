import LearnWords from '../../src/LearnWords';
import { mount } from 'cypress/react18';
import React from 'react';

describe('LearnWords', () => {
    beforeEach(() => {
        cy.intercept('/languages', {
            statusCode: 200,
            body: [
                { code: 'es', name: 'Spanish' },
                { code: 'fr', name: 'French' },
            ],
        });

        cy.intercept('/words', {
            statusCode: 200,
            body: [{ id: 1, word: 'hello' }],
        });

        cy.intercept('/words/*/translations/*', (req) => {
            const urlParts = req.url.split('/');
            const wordId = urlParts[2];
            const languageCode = urlParts[4];
            req.reply({
                statusCode: 200,
                body: { translation: `Translation for word ${wordId} in ${languageCode}` },
            });
        });
    });

    it('renders the correct title', () => {
        cy.mount(<LearnWords />);
        cy.get('h1').should('contain', 'Learn Words');
    });

    it('renders the language select dropdown', () => {
        cy.mount(<LearnWords />);
        cy.get('[data-testid="language-select"]').should('be.visible');
    });

    it('renders the image container when words are available', () => {
        cy.mount(<LearnWords />);
        cy.get('.image-container').should('be.visible');
    });

    it('renders the prev and next buttons', () => {
        cy.mount(<LearnWords />);
        cy.get('.prev-button').should('be.visible');
        cy.get('.next-button').should('be.visible');
    });

    it('renders an error message when an error occurs', () => {
        // Intercept the /words request and return an error response
        cy.intercept('/words', {
            statusCode: 500,
            body: 'Test error message',
        });

        // Mount the component
        mount(<LearnWords />);

        // Assert that the error message is visible
        cy.get('p').should('be.visible').and('contain', 'Test error message');
    });
});