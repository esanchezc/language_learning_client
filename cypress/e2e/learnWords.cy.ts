describe('LearnWords page', () => {
    beforeEach(() => {
        cy.visit('/learn-words');
        cy.get('h1', { timeout: 10000 }).should('be.visible');
    });

    it('calls the handleNextClick function when the next button is clicked', () => {
        cy.visit('/learn-words');
        cy.get('.original-word').invoke('text').then((initialWord: string) => {
            cy.get('.next-button').click();
            cy.get('.original-word').invoke('text').should((newWord: string) => {
                expect(newWord).not.to.equal(initialWord);
            });
        });
    });

    it('calls the handlePrevClick function when the prev button is clicked', () => {
        cy.visit('/learn-words');
        cy.get('.original-word').invoke('text').then((initialWord: string) => {
            cy.get('.next-button').click();
            cy.get('.prev-button').click();
            cy.get('.original-word').invoke('text').should((newWord: string) => {
                expect(newWord).to.equal(initialWord);
            });
        });
    });

    it('calls the handleLanguageChange function when the language select dropdown is changed', () => {
        cy.visit('/learn-words');
        cy.get('[data-testid="language-select"]').select('Spanish');
        cy.get('[data-testid="language-select"]').should('have.value', 'es');
    });

    it('displays the word and its translation', () => {
        cy.visit('/learn-words');
        cy.get('.original-word').should('be.visible');
        cy.get('.translated-word').should('be.visible');
    });

    it('displays an image for the word', () => {
        cy.visit('/learn-words');
        cy.get('img').should('be.visible');
    });

    it('displays an error message when translation is not found', () => {
        cy.intercept('GET', /\/words\/\d+\/translations\/es/, {
            statusCode: 404,
            body: {},
        });
        cy.visit('/learn-words');
        cy.get('[data-testid="language-select"]').select('Spanish');
        cy.get('p').contains('Translation not found.').should('be.visible');
    });

    it('displays an error message when there is an error parsing JSON response', () => {
        cy.intercept('GET', /\/words\/\d+\/translations\/es/, {
            statusCode: 200,
            body: 'Invalid JSON',
        });
        cy.visit('/learn-words');
        cy.get('[data-testid="language-select"]').select('Spanish');
        cy.get('p').contains('Error parsing JSON response.').should('be.visible');
    });

    it('displays a default image when the word image is not found', () => {
        cy.intercept('GET', /\/icons\/(?!empty-basket\.png).*\.png/, {
            statusCode: 404,
            body: {},
        });
        cy.visit('/learn-words');
        cy.get('img').invoke('attr', 'src').should('contain', '/icons/empty-basket.png');
    });
});