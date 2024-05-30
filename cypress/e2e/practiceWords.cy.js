describe('Practice Words', () => {
    beforeEach(() => {
        cy.visit('/practice-words');
    });

    it('renders correctly', () => {
        cy.get('h1').should('contain', 'Practice Words');
    });

    it('fetches languages on mount', () => {
        cy.get('[data-testid="select-language"]').should('be.visible');
        cy.get('[data-testid="select-language"] option').should('have.length', 6);
    });

    it('handles language change', () => {
        cy.get('[data-testid="select-language"]').select('es');
        cy.get('[data-testid="word-label"]').should('be.visible');
    });

    it('renders celebration message when all words have been answered', () => {
        cy.get('[data-testid="answer-input"]').type('Manzana');
        cy.get('[data-testid="check-button"]').click();
        cy.get('[data-testid="next-button"]').click();
        cy.get('[data-testid="answer-input"]').type('Plátano');
        cy.get('[data-testid="check-button"]').click();
        cy.get('[data-testid="next-button"]').should('not.exist');
        cy.get('[data-testid="celebration-message"]').should('be.visible');
    });

    it('calls checkUserAnswer when Check button is clicked', () => {
        cy.get('[data-testid="answer-input"]').type('Manzana');
        cy.get('[data-testid="check-button"]').click();
        cy.get('[data-testid="correct-translation"]').should('be.visible');
    });

    it('renders correct translation when answer is incorrect', () => {
        cy.get('[data-testid="answer-input"]').type('wrong answer');
        cy.get('[data-testid="check-button"]').click();
        cy.get('[data-testid="correct-translation"]').should('be.visible');
    });

    it('renders Next button when answer is correct', () => {
        cy.get('[data-testid="answer-input"]').type('Manzana');
        cy.get('[data-testid="check-button"]').click();
        cy.get('[data-testid="next-button"]').should('be.visible');
    });

    it('renders Skip button when answer is incorrect', () => {
        cy.get('[data-testid="answer-input"]').type('some answer');
        cy.get('[data-testid="check-button"]').click();
        cy.get('[data-testid="skip-button"]').should('be.visible');
    });

    it('renders practice again button and displays celebration message when all words have been answered', () => {
        cy.get('[data-testid="answer-input"]').type('Manzana');
        cy.get('[data-testid="check-button"]').click();
        cy.get('[data-testid="next-button"]').click();
        cy.get('[data-testid="answer-input"]').type('Plátano');
        cy.get('[data-testid="check-button"]').click();
        cy.get('[data-testid="practice-again-button"]').should('be.visible');
        cy.get('[data-testid="celebration-message"]').should('be.visible');
    });

    it('handles image loading errors', () => {
        cy.intercept('GET', '/words/es', {
            statusCode: 200,
            body: [
                { id: 1, word: 'Apple', translation: 'Manzana' },
            ],
        });
        cy.reload();
        cy.get('[data-testid="word-image"]').should('be.visible');
        cy.get('[data-testid="word-image"]').invoke('attr', 'src').should('contain', 'icons/apple.png');
        // Simulate an image loading error
        cy.get('[data-testid="word-image"]').invoke('attr', 'src', 'icons/empty-basket.png');
        cy.get('[data-testid="word-image"]').invoke('attr', 'src').should('contain', 'icons/empty-basket.png');
    });

    it('renders dialog when language is changed with correct answers', () => {
        cy.intercept('GET', '/words/es', {
            statusCode: 200,
            body: [
                { id: 1, word: 'Apple', translation: 'Manzana' },
                { id: 2, word: 'Banana', translation: 'Plátano' },
            ],
        });
        cy.intercept('GET', '/words/1/translations/es', {
            statusCode: 200,
            body: {
                translation: 'Manzana',
            },
        });
        cy.intercept('GET', '/words/2/translations/es', {
            statusCode: 200,
            body: {
                translation: 'Plátano',
            },
        });
        cy.get('[data-testid="select-language"]').select('es');
        cy.get('[data-testid="word-label"]').invoke('text').then((word) => {
            const translation = word === 'Apple' ? 'Manzana' : 'Plátano';
            cy.get('[data-testid="answer-input"]').type(translation);
            cy.get('[data-testid="check-button"]').click();
            cy.get('[data-testid="select-language"]').select('it');
            cy.get('[data-testid="dialog-confirm-button"]').click();
        });
    });

    it('resets correct answers when language is changed', () => {
        cy.intercept('GET', '/words/es', {
            statusCode: 200,
            body: [
                { id: 1, word: 'Apple', translation: 'Manzana' },
                { id: 2, word: 'Banana', translation: 'Plátano' },
            ],
        });
        cy.get('[data-testid="select-language"]').select('es');
        cy.get('[data-testid="answer-input"]').type('Manzana');
        cy.get('[data-testid="check-button"]').should('be.visible').click();
        cy.get('[data-testid="select-language"]').select('it');
        cy.get('[data-testid="dialog-confirm-button"]').click();
        cy.get('[data-testid="correct-answers"]').should('contain', '0');
    });
});