class LoginPage {
  elements = {
    emailInput: () => cy.get('input#email_address'),
    passwordInput: () => cy.get('input#password'),
    loginButton: () => cy.get('button[type="submit"]'),
  };

  typeEmail(email) {
    this.elements.emailInput().type(email);
  }

  typePassword(password) {
    this.elements.passwordInput().type(password);
  }

  clickLogin() {
    this.elements.loginButton().click();
  }
}

export default LoginPage;
