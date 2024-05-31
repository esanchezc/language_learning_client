describe('Add New Words component', () => {
    beforeEach(() => {
      cy.intercept('GET', '/languages', {
        body: [
          { id: 1, name: 'English', code: 'en' },
          { id: 2, name: 'Spanish', code: 'es' },
        ],
      });
    });
  
    it('should display an error message if the request fails', () => {
      cy.intercept('POST', '/words', {
        body: { message: 'An error occurred while adding the word' },
        statusCode: 500,
      });
  
      cy.visit('/add-new-words');
  
      cy.get('input[id="word"]').type('new word');
      cy.get('select[id="languageCode"]').select('en');
      cy.get('input[id="translation"]').type('new translation');
      cy.get('button[type="submit"]').click();
  
      cy.get('.error-message').should('contain', 'An error occurred while adding the word');
    });
  
    it('should send a POST request with the correct data', () => {
      cy.intercept('POST', '/words', {
        body: { message: 'Word added successfully' },
      }).as('addWordRequest');
  
      cy.visit('/add-new-words');
  
      cy.get('input[id="word"]').type('new word');
      cy.get('select[id="languageCode"]').select('en');
      cy.get('input[id="translation"]').type('new translation');
      cy.get('button[type="submit"]').click();
  
      cy.wait('@addWordRequest').then((interception) => {
        expect(interception.request.body.word).to.eq('new word');
        expect(interception.request.body.translations).to.deep.eq([
          { languageCode: 'en', translation: 'new translation' },
        ]);
      });
    });
  
    it('should display a success message if the word is added successfully', () => {
      cy.intercept('POST', '/words', {
        body: { message: 'Word added successfully' },
      });
  
      cy.visit('/add-new-words');
  
      cy.get('input[id="word"]').type('new word');
      cy.get('select[id="languageCode"]').select('en');
      cy.get('input[id="translation"]').type('new translation');
      cy.get('button[type="submit"]').click();
  
      cy.get('.success-message').should('contain', 'Word added successfully');
    });
  
    it('should be able to add a new translation', () => {
      cy.visit('/add-new-words');
  
      cy.get('button').contains('Add Translation').click();
  
      cy.get('.translation-section').should('have.length', 2);
    });
  
    it('should be able to remove a translation', () => {
      cy.visit('/add-new-words');
  
      cy.get('button').contains('Remove Translation').click();
  
      cy.get('.translation-section').should('have.length', 0);
    });
  });