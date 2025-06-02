class CartPage {
  elements = {
    cartItems: () => cy.get('div[class*="OrderItem_orderItem__"]'), // Matches OrderItem_orderItem__<hash>
    checkoutButton: () => cy.get('a[href="/checkout"][class*="utilStyles_button__"]'), // Matches utilStyles_button__<hash>
    // Selector for the "Remove" button within a cart item.
    // Use like: cartItem.find(this.elements.removeItemButton())
    removeItemButton: () => 'button[class*="OrderItem_button__"]',
    emptyCartMessage: () => cy.contains('p[class*="utilStyles_emptyFeedMessage__"]', 'Your cart is empty.'),
    removedItemMessage: () => cy.get('p > strong'), // This might need to be more specific
  };

  getCartItems() {
    return this.elements.cartItems();
  }

  clickCheckout() {
    this.elements.checkoutButton().click();
  }

  // Example of a method to remove a specific item by its name
  // This assumes product names are unique in the cart
  removeItemByName(productName) {
    this.elements.cartItems().each(($item) => {
      const itemName = $item.find('a[class*="utilStyles_link__"]').text();
      if (itemName.includes(productName)) {
        cy.wrap($item).find(this.elements.removeItemButton()).click();
        return false; // Exit .each loop
      }
    });
  }

  getEmptyCartMessage() {
    return this.elements.emptyCartMessage();
  }

  getRemovedItemMessage() {
    return this.elements.removedItemMessage();
  }
}

export default CartPage;
