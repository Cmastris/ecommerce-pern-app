class RegisterPage {
  elements = {
    emailInput: () => cy.get('input#email_address'),
    passwordInput: () => cy.get('input#password'),
    registerButton: () => cy.get('button[type="submit"]').contains('Register'),
    errorMessage: () => cy.contains('p', 'Sorry, registration failed.') // Generic error
    // More specific error message for existing email:
    // errorMessageDuplicateEmail: () => cy.contains('p', 'Sorry, someone is already registered with this email address.')
  };

  typeEmail(email) {
    this.elements.emailInput().type(email);
  }

  typePassword(password) {
    this.elements.passwordInput().type(password);
  }

  clickRegister() {
    this.elements.registerButton().click();
  }

  getErrorMessage() {
    // This will find any of the potential error messages.
    // For specific error checks, use more targeted selectors from elements.
    return cy.get('form').next('p'); // Assumes error <p> is immediately after <form>
  }

  getDuplicateEmailErrorMessage() {
    return cy.contains('p', 'Sorry, someone is already registered with this email address.');
  }
}

export default RegisterPage;
