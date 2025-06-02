import LoginPage from './pom/LoginPage';

describe('Login Page Tests', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    // Visit the login page before each test
    // Assuming the login page is at '/login'
    // Update this if the path is different
    cy.visit('/login'); 
  });

  it('should display an error message with invalid credentials', () => {
    loginPage.typeEmail('invalid@example.com');
    loginPage.typePassword('wrongpassword');
    loginPage.clickLogin();
    
    // Check for an error message
    // This selector might need adjustment based on how errors are displayed
    cy.contains('Login failed. The username or password is incorrect.').should('be.visible');
  });

  it('should allow a user to attempt to log in with valid credentials format', () => {
    // This test assumes that a user 'test@example.com' with password 'password123'
    // could be a valid format.
    // It checks for form submission and navigation, actual login success depends on backend.
    loginPage.typeEmail('test@example.com');
    loginPage.typePassword('password123');
    loginPage.clickLogin();

    // After a successful login attempt, the user might be redirected.
    // Check if the URL changes or if a specific element on the next page is visible.
    // For example, if redirected to '/account':
    cy.url().should('include', '/account'); 
    // Or check for an element on the account page:
    // cy.get('h1').contains('Account').should('be.visible');
  });

  it('should show an error if email is not provided', () => {
    loginPage.typePassword('password123');
    loginPage.clickLogin();
    // HTML5 validation should prevent submission, or a specific error message might appear.
    // Checking if the email input is invalid (HTML5 validation)
    loginPage.elements.emailInput().should('be.invalid');
  });

  it('should show an error if password is not provided', () => {
    loginPage.typeEmail('test@example.com');
    loginPage.clickLogin();
    // HTML5 validation should prevent submission, or a specific error message might appear.
    // Checking if the password input is invalid (HTML5 validation)
    loginPage.elements.passwordInput().should('be.invalid');
  });

});
