import LoginPage from './pom/LoginPage';

describe('Login Page Tests', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    cy.visit('http://localhost:3000/login'); 
  });

  it('should display an error message with invalid credentials', () => {
    loginPage.typeEmail('invalid@example.com');
    loginPage.typePassword('wrongpassword');
    loginPage.clickLogin();
    
    cy.contains('Login failed. The username or password is incorrect.').should('be.visible');
  });

  it('should allow a user to attempt to log in with valid credentials format', () => {
    loginPage.typeEmail('test@example.com');
    loginPage.typePassword('password123'); 
    loginPage.clickLogin();
    cy.url().should('include', '/account'); 
  });


});
