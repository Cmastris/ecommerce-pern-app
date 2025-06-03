import RegisterPage from './pom/RegisterPage';

describe('Register Page Tests', () => {
  const registerPage = new RegisterPage();
  const apiBaseUrl = Cypress.env('REACT_APP_API_BASE_URL') || 'http://localhost:5000/api';

  beforeEach(() => {
    cy.visit('http://localhost:3000/register');
  });

  it('should allow a user to attempt registration with valid details', () => {
    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    registerPage.typeEmail(uniqueEmail);
    registerPage.typePassword('password123');
    registerPage.clickRegister();

    cy.url().should('include', '/account');
  });

  it('should display an error message if email already exists', () => {
    registerPage.typeEmail('existinguser@example.com');
    registerPage.typePassword('password123');
    registerPage.clickRegister();

    registerPage.getDuplicateEmailErrorMessage().should('be.visible');
  });

});
