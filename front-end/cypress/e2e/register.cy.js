import RegisterPage from './pom/RegisterPage';

describe('Register Page Tests', () => {
  const registerPage = new RegisterPage();
  const apiBaseUrl = Cypress.env('REACT_APP_API_BASE_URL') || 'http://localhost:5000/api';

  beforeEach(() => {
    cy.visit('/register');
  });

  it('should allow a user to attempt registration with valid details', () => {
    // Mock successful registration
    cy.intercept('POST', `${apiBaseUrl}/auth/register`, {
      statusCode: 200,
      body: { message: 'Registration successful' }, // Or whatever your API returns
    }).as('registerRequest');

    // Use a unique email for each test run to avoid conflicts if not mocking
    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    registerPage.typeEmail(uniqueEmail);
    registerPage.typePassword('password123');
    registerPage.clickRegister();

    cy.wait('@registerRequest');
    // Expect redirection to /account page after successful registration
    cy.url().should('include', '/account');
  });

  it('should display an error message if email already exists', () => {
    // Mock registration conflict
    cy.intercept('POST', `${apiBaseUrl}/auth/register`, {
      statusCode: 400, // Conflict or Bad Request
      body: { error: 'Sorry, someone is already registered with this email address.' },
    }).as('registerConflict');

    registerPage.typeEmail('existinguser@example.com');
    registerPage.typePassword('password123');
    registerPage.clickRegister();

    cy.wait('@registerConflict');
    registerPage.getDuplicateEmailErrorMessage().should('be.visible');
  });

  it('should show HTML5 validation error for invalid email format', () => {
    registerPage.typeEmail('invalidemail');
    registerPage.typePassword('password123');
    // The click might not be necessary if live validation is active,
    // but it ensures form submission is attempted for HTML5 validation.
    // We don't click register here, as the button might be disabled or
    // the browser might prevent submission due to input type="email" validation.
    // Instead, we check the validity of the input field itself.
    registerPage.elements.emailInput().should('be.invalid');
  });
  
  it('should show HTML5 validation error for short password (if minlength is set)', () => {
    // The LoginPage.tsx has minLength={8} for password
    registerPage.typeEmail('test@example.com');
    registerPage.typePassword('short'); // Less than 8 characters
    
    // Check the input's validity property
     registerPage.elements.passwordInput().should('be.invalid');
    // Attempting to click register would also show the browser's validation message
    // registerPage.clickRegister(); 
    // cy.get('input#password:invalid').should('exist'); // Another way to check
  });


  it('should show HTML5 validation error if email is not provided', () => {
    registerPage.typePassword('password123');
    // registerPage.clickRegister(); // This would trigger HTML5 validation message
    registerPage.elements.emailInput().should('be.invalid');
  });

  it('should show HTML5 validation error if password is not provided', () => {
    registerPage.typeEmail('test@example.com');
    // registerPage.clickRegister(); // This would trigger HTML5 validation message
    registerPage.elements.passwordInput().should('be.invalid');
  });

  it('should display a generic error message on server error', () => {
    cy.intercept('POST', `${apiBaseUrl}/auth/register`, {
      statusCode: 500,
      body: { error: 'Internal server error' }
    }).as('registerError');

    registerPage.typeEmail('test@example.com');
    registerPage.typePassword('password123');
    registerPage.clickRegister();

    cy.wait('@registerError');
    // The component shows "Sorry, registration failed. Please try again later."
    registerPage.getErrorMessage().contains('Sorry, registration failed. Please try again later.').should('be.visible');
  });

});
