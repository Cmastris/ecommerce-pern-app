class CartPage {
  elements = {
    cartItems: () => cy.get('div[class*="OrderItem_orderItem__"]'),
    checkoutButton: () => cy.get('a[href="/checkout"][class*="utilStyles_button__"]'), 

    removeItemButton: () => 'button[class*="OrderItem_button__"]',
    emptyCartMessage: () => cy.contains('p[class*="utilStyles_emptyFeedMessage__"]', 'Your cart is empty.'),
    removedItemMessage: () => cy.get('p > strong'), 
  };

  getCartItems() {
    return this.elements.cartItems();
  }

  clickCheckout() {
    this.elements.checkoutButton().click();
  }


  removeItemByName(productName) {
    this.elements.cartItems().each(($item) => {
      const itemName = $item.find('a[class*="utilStyles_link__"]').text();
      if (itemName.includes(productName)) {
        cy.wrap($item).find(this.elements.removeItemButton()).click();
        return false; 
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
