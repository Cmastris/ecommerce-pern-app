import CartPage from './pom/CartPage';
import LoginPage from './pom/LoginPage'; // To log in if needed

describe('Cart Page Tests', () => {
  const cartPage = new CartPage();
  const loginPage = new LoginPage();
  const apiBaseUrl = Cypress.env('REACT_APP_API_BASE_URL') || 'http://localhost:5000/api';

  // Helper function to log in a user via UI
  // This assumes a valid user exists. For robust tests, consider programmatic login or seeding users.
  const login = (email, password) => {
    cy.session([email, password], () => {
      cy.visit('/login');
      loginPage.typeEmail(email);
      loginPage.typePassword(password);
      loginPage.clickLogin();
      cy.url().should('not.include', '/login'); // Wait for login to complete
    });
    cy.visit('/cart'); // Navigate to cart after login
  };


  context('Empty Cart', () => {
    beforeEach(() => {
      // Mock the API response for an empty cart
      cy.intercept('GET', `${apiBaseUrl}/cart`, {
        statusCode: 200,
        body: [], // Empty cart
      }).as('getEmptyCart');

      // For these tests, we assume the user needs to be logged in to see the cart.
      // Replace with actual test user credentials if available.
      // If login is not strictly required to see an empty cart message, this can be adjusted.
      login('testuser@example.com', 'password123'); // Fictional user
      // visit /cart is now handled by login helper
    });

    it('should display an empty cart message when no items are in the cart', () => {
      cy.wait('@getEmptyCart');
      cartPage.getEmptyCartMessage().should('be.visible');
      cartPage.elements.checkoutButton().should('not.exist');
    });
  });

  context('Cart with Items', () => {
    const mockCartData = [
      { product_id: '1', product_name: 'Test Product 1', product_price: '$10.00', quantity: 1, image_url: 'test1.jpg' },
      { product_id: '2', product_name: 'Test Product 2', product_price: '$20.00', quantity: 2, image_url: 'test2.jpg' },
    ];

    beforeEach(() => {
      // Mock the API response for a cart with items
      cy.intercept('GET', `${apiBaseUrl}/cart`, {
        statusCode: 200,
        body: mockCartData,
      }).as('getCartWithItems');
      
      login('testuser@example.com', 'password123'); // Fictional user
    });

    it('should display cart items and the checkout button', () => {
      cy.wait('@getCartWithItems');
      cartPage.getCartItems().should('have.length', mockCartData.length);
      
      // Verify details of the first item (optional, but good for confidence)
      cartPage.getCartItems().first().within(() => {
        cy.contains(mockCartData[0].product_name).should('be.visible');
        cy.contains(mockCartData[0].product_price).should('be.visible');
      });

      cartPage.elements.checkoutButton().should('be.visible').and('have.attr', 'href', '/checkout');
    });

    it('should allow proceeding to checkout', () => {
      cy.wait('@getCartWithItems');
      cartPage.clickCheckout();
      cy.url().should('include', '/checkout');
    });

    it('should allow removing an item from the cart', () => {
      // Mock the DELETE request for removing an item
      cy.intercept('DELETE', `${apiBaseUrl}/cart/items/${mockCartData[0].product_id}`, {
        statusCode: 200,
        body: { success: true }, // Or whatever your API returns
      }).as('removeItem');

      // Mock the cart state after removal for the next GET /cart
      const cartDataAfterRemoval = mockCartData.slice(1);
      cy.intercept('GET', `${apiBaseUrl}/cart`, (req) => {
        // This interceptor will respond differently after an item is removed.
        // We need to ensure it only responds with updated data *after* the delete.
        // A simple way is to check if the alias for delete has been hit.
        if (cy.state('aliases') && cy.state('aliases').removeItem && cy.state('aliases').removeItem.callCount > 0) {
          req.reply({
            statusCode: 200,
            body: cartDataAfterRemoval,
          });
        } else {
          req.reply({
            statusCode: 200,
            body: mockCartData,
          });
        }
      }).as('getCartDynamic');
      
      cy.wait('@getCartDynamic'); // Initial load

      cartPage.getCartItems().should('have.length', mockCartData.length);
      
      // Remove the first item by its name (using the POM method)
      // Ensure the removeItemByName method correctly finds and clicks the remove button
      // For this to work, the POM's removeItemByName needs to be robust.
      // A simpler way for the test is to directly click the remove button of the first item.
      cartPage.getCartItems().first().find(cartPage.elements.removeItemButton()).click();
      
      cy.wait('@removeItem');
      cy.wait('@getCartDynamic'); // Wait for cart to reload

      // Verify the item is removed
      cartPage.getCartItems().should('have.length', cartDataAfterRemoval.length);
      cy.contains(mockCartData[0].product_name).should('not.exist');
      
      // Verify the removed item message (if your app shows one)
      // cartPage.getRemovedItemMessage().should('contain', mockCartData[0].product_name);
    });
  });
});
