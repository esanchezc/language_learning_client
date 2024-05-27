import App from '../../src/App';

describe('App', () => {
  it('displays the correct title', () => {
    cy.mount(<App />);
    cy.get('h1').should('contain', 'Word Learner');
  });

  it('renders the 3 buttons correctly', () => {
    cy.mount(<App />);
    cy.get('.next-button').should('have.length', 3);
    cy.get('.next-button').eq(0).should('contain', 'Learn words');
    cy.get('.next-button').eq(1).should('contain', 'Add new words');
    cy.get('.next-button').eq(2).should('contain', 'Practice words');
  });

  it('navigates to the LearnWords page when the "Learn words" button is clicked', () => {
    cy.mount(<App />);
    cy.get('.next-button').eq(0).click();
    cy.get('h1').should('contain', 'Learn Words'); // Assuming this is the title of the LearnWords page
  });

  it('navigates to the AddNewWords page when the "Add new words" button is clicked', () => {
    cy.mount(<App />);
    cy.get('.next-button').eq(1).click();
    cy.get('h1').should('contain', 'Add New Word'); // Assuming this is the title of the AddNewWords page
  });

  it('navigates to the PracticeWords page when the "Practice words" button is clicked', () => {
    cy.mount(<App />);
    cy.get('.next-button').eq(2).click();
    cy.get('h1').should('contain', 'Practice Words'); // Assuming this is the title of the PracticeWords page
  });
});