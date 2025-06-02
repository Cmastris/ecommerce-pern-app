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

    // TS_21_Scenario1: Covers removing an item when multiple items are in the cart
    it('TS_21_Scenario1: should update cart correctly when removing an item from multiple items', () => {
      // This test uses mockCartData (2 items) defined in the context's beforeEach
      const productToRemove = mockCartData[0];
      const remainingProduct = mockCartData[1];
      const cartDataAfterRemoval = [remainingProduct];

      // Mock the DELETE request for removing an item
      cy.intercept('DELETE', `${apiBaseUrl}/cart/items/${productToRemove.product_id}`, {
        statusCode: 200,
        body: { success: true, productId: productToRemove.product_id, productName: productToRemove.product_name },
      }).as('removeItemRequest');

      // Mock the cart state after removal for the next GET /cart
      // This specific intercept needs to be before the general one in beforeEach if paths are identical
      // or ensure the general one in beforeEach doesn't interfere.
      // The current dynamic interceptor ('getCartDynamic') handles this well.
      let removeCallCount = 0;
      cy.intercept('GET', `${apiBaseUrl}/cart`, (req) => {
        // The initial load comes from beforeEach's 'getCartWithItems'
        // This interceptor ('getCartDynamic') takes over after the first 'removeItemRequest'
        if (removeCallCount > 0) {
          req.reply({ statusCode: 200, body: cartDataAfterRemoval });
        } else {
          // Let the beforeEach interceptor handle the initial load
          // Or, if this is the only GET /cart interceptor for this test:
          req.reply({ statusCode: 200, body: mockCartData });
        }
      }).as('getCartDynamic');
      
      cy.wait('@getCartWithItems'); // Initial load from beforeEach

      cartPage.getCartItems().should('have.length', mockCartData.length);
      
      cartPage.getCartItems().contains(productToRemove.product_name)
        .parents('div[class*="OrderItem_orderItem__"]') // Find the parent cart item container
        .find(cartPage.elements.removeItemButton())
        .click();
      
      removeCallCount++; // Increment to signal the next GET /cart should use updated data
      cy.wait('@removeItemRequest');
      cy.wait('@getCartDynamic'); 

      // Assert that the specific item is no longer visible
      cy.contains(productToRemove.product_name).should('not.exist');
      
      // Assert that the number of cart items displayed has decreased
      cartPage.getCartItems().should('have.length', cartDataAfterRemoval.length);
      
      // Assert that the remaining item is still visible
      cy.contains(remainingProduct.product_name).should('be.visible');

      // Verify the "item removed" confirmation message
      cartPage.getRemovedItemMessage()
        .should('be.visible')
        .and('contain.text', productToRemove.product_name)
        .and('contain.text', 'was removed from your cart.');
    });

    // TS_21_Scenario2: Covers removing the last item from the cart
    it('TS_21_Scenario2: should display empty cart message when last item is removed', () => {
      const singleItemCart = [
        { product_id: '3', product_name: 'Last Product', product_price: '$30.00', quantity: 1, image_url: 'last.jpg' },
      ];

      // Override the beforeEach intercept for this specific test
      cy.intercept('GET', `${apiBaseUrl}/cart`, (req) => {
        // On first load, serve singleItemCart. After removal, serve empty cart.
        if (cy.state('aliases') && cy.state('aliases').removeItemRequest && cy.state('aliases').removeItemRequest.callCount > 0) {
          req.reply({ statusCode: 200, body: [] }); // Empty cart after removal
        } else {
          req.reply({ statusCode: 200, body: singleItemCart }); // Initial single item
        }
      }).as('getCartForLastItemRemoval');
      
      cy.visit('/cart'); // Re-visit or ensure the intercept is in place before page interaction
      cy.wait('@getCartForLastItemRemoval');

      cartPage.getCartItems().should('have.length', 1);
      cy.contains(singleItemCart[0].product_name).should('be.visible');
      cartPage.elements.checkoutButton().should('be.visible'); // Checkout button visible with one item

      // Mock the DELETE request
      cy.intercept('DELETE', `${apiBaseUrl}/cart/items/${singleItemCart[0].product_id}`, {
        statusCode: 200,
        body: { success: true, productId: singleItemCart[0].product_id, productName: singleItemCart[0].product_name },
      }).as('removeItemRequest');

      // Click remove button for the only item
      cartPage.getCartItems().first().find(cartPage.elements.removeItemButton()).click();

      cy.wait('@removeItemRequest');
      cy.wait('@getCartForLastItemRemoval'); // Reloads to get empty cart

      // Assert that the item is no longer visible
      cy.contains(singleItemCart[0].product_name).should('not.exist');
      
      // Assert that the "Your cart is empty." message is displayed
      cartPage.getEmptyCartMessage().should('be.visible');
      
      // Assert that the checkout button is no longer visible
      cartPage.elements.checkoutButton().should('not.exist');

      // Verify the "item removed" confirmation message is still shown
      cartPage.getRemovedItemMessage()
        .should('be.visible')
        .and('contain.text', singleItemCart[0].product_name)
        .and('contain.text', 'was removed from your cart.');
    });

    // TS_22: Covers removing all items iteratively
    it('TS_22: should allow removing all items iteratively, resulting in an empty cart', () => {
      const iterativeMockCartData = [
        { product_id: 'prod_A', product_name: 'Product Alpha', product_price: '$10.00', quantity: 1 },
        { product_id: 'prod_B', product_name: 'Product Beta', product_price: '$20.00', quantity: 1 },
      ];

      let currentCartState = [...iterativeMockCartData];
      let removalCount = 0;

      // Setup initial GET /cart intercept and subsequent dynamic ones
      cy.intercept('GET', `${apiBaseUrl}/cart`, (req) => {
        req.reply({ statusCode: 200, body: [...currentCartState] });
      }).as('getCartIterative');

      cy.visit('/cart'); // Visit after login (handled by context's beforeEach)
      cy.wait('@getCartIterative');

      // Assert initial items are visible
      cartPage.getCartItems().should('have.length', iterativeMockCartData.length);
      iterativeMockCartData.forEach(item => {
        cy.contains(item.product_name).should('be.visible');
      });
      cartPage.elements.checkoutButton().should('be.visible');

      // Iterate and remove items
      iterativeMockCartData.forEach((itemToRemove) => {
        // Mock DELETE for the current item
        cy.intercept('DELETE', `${apiBaseUrl}/cart/items/${itemToRemove.product_id}`, {
          statusCode: 200,
          body: { success: true, productId: itemToRemove.product_id, productName: itemToRemove.product_name },
        }).as(`removeItem_${itemToRemove.product_id}`);

        // Update currentCartState for the *next* GET /cart call
        // The intercept for GET /cart is already set up to use the current value of currentCartState
        
        cy.log(`Attempting to remove: ${itemToRemove.product_name}`);
        cartPage.getCartItems().contains(itemToRemove.product_name)
          .parents('div[class*="OrderItem_orderItem__"]')
          .find(cartPage.elements.removeItemButton())
          .click();
        
        // Update cart state *after* click and *before* waiting for requests
        currentCartState = currentCartState.filter(item => item.product_id !== itemToRemove.product_id);
        removalCount++;

        cy.wait(`@removeItem_${itemToRemove.product_id}`);
        cy.wait('@getCartIterative'); // Triggered by the removal action's effect (e.g., loader, navigation)

        // Assert "item removed" message
        cartPage.getRemovedItemMessage()
          .should('be.visible')
          .and('contain.text', itemToRemove.product_name)
          .and('contain.text', 'was removed from your cart.');

        // Assert item is no longer visible
        cy.contains(itemToRemove.product_name).should('not.exist');
        cartPage.getCartItems().should('have.length', currentCartState.length);
      });

      // Final State Verification
      cartPage.getCartItems().should('have.length', 0);
      cartPage.getEmptyCartMessage().should('be.visible');
      cartPage.elements.checkoutButton().should('not.exist');
    });
  });
});
