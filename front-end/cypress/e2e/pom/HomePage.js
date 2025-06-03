class HomePage {
  visit() {
    cy.visit('/');
  }

  getSearchInput() {
    return cy.get('input[type="search"]');
  }

  getSearchButton() {
    return cy.get('button[type="submit"]');
  }

  getProductByName(productName) {
    return cy.contains('.product-name', productName);
  }

  navigateToCategory(categoryName) {
    return cy.contains('a', categoryName).click();
  }
}

export default new HomePage();
