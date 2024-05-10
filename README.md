# Ecommerce PERN App <!-- omit in toc -->
Pernecom is a simplified ecommerce website built with the PERN (PostgreSQL, Express, React, Node) stack. It includes front-end routing (React Router), authentication (Passport.js), and checkout/payment integration (Stripe Checkout).

Take a look: https://ecommerce-pern-app-z9pn.onrender.com/.


## Contents <!-- omit in toc -->
- [Key features](#key-features)
  - [Product listing pages](#product-listing-pages)
  - [Product detail pages](#product-detail-pages)
  - [Authentication and authorisation](#authentication-and-authorisation)
  - [Cart and checkout](#cart-and-checkout)
  - [Previous orders](#previous-orders)
  - [Dynamic routing](#dynamic-routing)
  - [Error handling](#error-handling)
  - [Database and API documentation](#database-and-api-documentation)
- [Technologies](#technologies)
  - [Back end](#back-end)
  - [Front end](#front-end)
- [Setup](#setup)
- [FAQs](#faqs)
  - [Can I see an example?](#can-i-see-an-example)
  - [Why did you build this?](#why-did-you-build-this)


## Key features

### Product listing pages
Product listing pages are dynamically rendered based on the URL path (homepage, category, or search results), using JSON data fetched from back-end API endpoints.

![Product listing page example](/readme-images/product-listing-page.png)

*Relevant code: [front-end products components](front-end/src/features/products); [products API endpoints](back-end/routes/products.js); [categories API endpoints](back-end/routes/categories.js); [database query functions](back-end/db/index.js).*


### Product detail pages
Product detail pages are dynamically rendered based on the product ID in the URL path, using JSON data fetched from a back-end API endpoint.

Content is dynamically rendered depending on authentication status (log in or add to cart button) and available stock count (no stock message, low stock message, or out of stock message).

![Product detail page example](/readme-images/product-detail-page.png)

*Relevant code: [front-end products components](front-end/src/features/products); [products API endpoints](back-end/routes/products.js); [database query functions](back-end/db/index.js).*


### Authentication and authorisation
Authentication is implemented using Passport.js and Express session middleware, including both local login and *Sign In With Google*. In the case of local login, passwords are hashed and verified using node.bcrypt.js.

A visitor's authentication status is used to dynamically render and/or restrict access to content and functionality across both the back end and front end:

* Relevant API endpoints return a 401 status code if the user is not authenticated (logged out) or not authorised (trying to access another user's data), resulting in a user-friendly [error message](#error-handling) on the front end
* Primary navigation links change if the user is authenticated (account; cart; log out) or not (register; log in)
* The product detail page button changes if the user is authenticated (add to cart) or not (log in)

![Login page when logged out](/readme-images/login-page.png)

*Relevant code: [front-end authentication components](front-end/src/features/auth); [back-end authentication logic](back-end/auth.js); [authentication API endpoints](back-end/routes/auth.js); [Passport.js and sessions configurations](back-end/index.js); [database query functions](back-end/db/index.js).*


### Cart and checkout
Authenticated visitors can add items to their cart, remove items from in their cart, and check out. These actions modify database stock counts (actual and available) to prevent orders exceeding stock.

The checkout journey includes Stripe Checkout payment integration (in test mode). Several API calls are used to create a pending order, establish a payment session, and ultimately confirm the order. Database transactions are used where appropriate to ensure that changes (e.g. stock counts) are made only if all related queries are successful.

![Stripe Checkout integration](/readme-images/checkout.png)

*Relevant code: [front-end cart & checkout components](front-end/src/features/orders); [cart API endpoints](back-end/routes/cart.js); [checkout API endpoints](back-end/routes/checkout.js); [database query functions](back-end/db/index.js).*


### Previous orders
Authenticated visitors can view a summary of their previous orders (status; date; total cost) on the main account page, with extra details (order item summaries and delivery address) available via order detail pages.

![Previous order details](/readme-images/order-details.png)

*Relevant code: [front-end orders components](front-end/src/features/orders); [orders API endpoints](back-end/routes/orders.js); [database query functions](back-end/db/index.js).*


### Dynamic routing
Front-end URL routing is implemented using React Router v6, utilising dynamic paths (*params*, e.g. category URL slugs and order IDs) and data retrieval functions (*loaders*) to fetch relevant JSON data from back-end API endpoints.

*Relevant code: [routing configuration](front-end/src/routing.js); various React components (e.g. [ProductFeed](front-end/src/features/products/ProductFeed.js)).*


### Error handling
Comprehensive error handling is used throughout the back end and front end. Non-success API endpoint status codes are typically used to render a user-friendly message on the front end.

![Login required error message](/readme-images/account-logged-out-error.png)

![Checkout empty cart error message](/readme-images/checkout-empty-cart-error.png)

*Relevant code: [inline error page component](front-end/src/components/InlineErrorPage/InlineErrorPage.js); [fallback error page component](front-end/src/components/FallbackErrorPage/FallbackErrorPage.js); virtually every other file!*


### Database and API documentation
The database structure is documented in a [Database Markup Language file](/back-end/documentation/db-structure.dbml) and visualised in a [diagram](/back-end/documentation/db-structure-diagram-v4.png).

![Database diagram](/back-end/documentation/db-structure-diagram-v4.png)

The back-end API is documented using [Swagger UI](https://swagger.io/tools/swagger-ui/), available at http://localhost:8000/docs/ (refer to [setup](#setup)) or in [JSON](/back-end/documentation/api-spec.json) & [YAML](/back-end/documentation/api-spec.yaml) source files.

![Back-end endpoints Swagger UI documentation](/readme-images/back-end-endpoints-swaggger-ui-documentation.png)

## Technologies

### Back end
* [PostgreSQL](https://www.postgresql.org/)
* [Node.js](https://nodejs.org/en/about)
* [Express v4](https://expressjs.com/) (including several [middleware modules](https://expressjs.com/en/resources/middleware.html))
* [node-postgres](https://node-postgres.com/)
* [Passport.js](https://www.passportjs.org/)
* [node.bcrypt.js](https://www.npmjs.com/package/bcrypt)
* [Stripe Checkout](https://stripe.com/gb/payments/checkout)
* [dotenv](https://www.npmjs.com/package/dotenv)
* [Jest](https://jestjs.io/)
* [SuperTest](https://www.npmjs.com/package/supertest)

### Front end
* [React v18](https://react.dev/)
* [React Router v6](https://reactrouter.com/en/main)
* [Stripe Checkout](https://stripe.com/gb/payments/checkout)
* [React Stripe.js](https://www.npmjs.com/package/@stripe/react-stripe-js)
* [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
* [React Icons](https://www.npmjs.com/package/react-icons)


## Setup
1. Clone/download a local copy of this repository. 
2. Using the command line, navigate to the `/back-end` subdirectory and run `npm install` to install package dependencies (using the `package-lock.json` file).
3. Create a PostgreSQL database, optionally using the SQL provided in `/back-end/db/db-creation.sql`, using a PostgreSQL client application (e.g. pgAdmin) or the command line (psql).
4. Create and populate the database tables using the SQL provided in `/back-end/db/table-creation.sql` and `/back-end/db/table-population.sql` respectively.
5. In the `/back-end` subdirectory, rename the `example.env` file to `.env`.
6. In the `.env` file, update the values corresponding to secrets, IDs, and the PostgreSQL database configuration as required. Refer to the following documentation for more details:
   - https://expressjs.com/en/resources/middleware/session.html#secret
   - https://node-postgres.com/features/connecting#environment-variables
   - https://www.postgresql.org/docs/current/libpq-envars.html
   - https://www.passportjs.org/concepts/authentication/google/
   - https://www.passportjs.org/tutorials/google/register/
   - https://docs.stripe.com/keys
7. Optional: using the command line, run `npm test` in the `/back-end` subdirectory to run the test suite (all tests should pass if the steps above were successful).
8. Using the command line, run `node index.js` in the `/back-end` subdirectory to start the API server.
9. Optional: navigate to http://localhost:8000/docs/ to view the back-end API [Swagger UI](https://swagger.io/tools/swagger-ui/) documentation.
10. Using a new command line window, navigate to the `/front-end` subdirectory and run `npm install` to install package dependencies (using the `package-lock.json` file).
11. In the `/front-end` subdirectory, rename the `example.env` file to `.env`.
12. In the `.env` file, update the Stripe public key value (https://docs.stripe.com/keys).
13.  Using the command line, run `npm start` in the `/front-end` subdirectory to start the React app (while the back-end API server is still running via a separate command line window).
14.  The application should launch in your browser, but otherwise can be accessed at http://localhost:3000/.


## FAQs

### Can I see an example?
Yes! A deployed version of the website can be found here: https://ecommerce-pern-app-z9pn.onrender.com/. (The checkout payment functionality is in test mode, so you won't be charged).


### Why did you build this?
This is one of the practice projects that I completed as part of the Codecademy Full-Stack Engineer career path.

I planned and built it almost entirely independently; only the key requirements (core functionality and technologies) and a few links to documentation were provided. Some aspects were definitely challenging, requiring a lot of reading through documentation and Stack Overflow!

In particular, I now have significantly more experience with:

* Database design and documentation
* API design and documentation
* Local and third-party authentication, using Passport.js and Express session configuration
* Checkout/payment functionality using Stripe and a lot of SQL
* Data loading using React Router v6
