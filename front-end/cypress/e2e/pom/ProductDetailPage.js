class ProductDetailPage {
  getProductTitle() {
    return cy.get('.product-title'); // Assuming '.product-title' is the selector for the product name
  }

  getProductImage() {
    return cy.get('.product-image'); // Assuming '.product-image' is the selector for the product image
  }

  getProductDescription() {
    return cy.get('.product-description'); // Assuming '.product-description' is the selector for the product description
  }

  getProductPrice() {
    return cy.get('.product-price'); // Assuming '.product-price' is the selector for the product price
  }

  getAddToCartButton() {
    return cy.get('button.add-to-cart'); // Assuming 'button.add-to-cart' is the selector for the add to cart button
  }

  getQuantityInput() {
    return cy.get('input[name="quantity"]'); // Assuming 'input[name="quantity"]' is the selector for the quantity input
  }

  // Example: A method to add the product to the cart
  addToCart(quantity = 1) {
    if (quantity > 1) {
      this.getQuantityInput().clear().type(quantity);
    }
    this.getAddToCartButton().click();
  }
}

export default new ProductDetailPage();
