import { createBrowserRouter } from "react-router-dom";

import AccountPage from "./components/AccountPage/AccountPage";
import { App, authLoader } from "./App/App";
import { Cart, cartLoader } from "./features/orders/Cart";
import { CheckoutPage, checkoutAction } from "./features/orders/CheckoutPage";
import { removeCartItemAction } from "./features/orders/OrderItem";
import FallbackErrorPage from "./components/FallbackErrorPage/FallbackErrorPage";
import { LoginPage, loginAction } from "./features/auth/LoginPage";
import { OrderDetailsPage, orderDetailsLoader } from "./features/orders/OrderDetailsPage";
import { ordersLoader } from "./features/orders/OrdersHistory";
import PaymentPage from "./features/orders/PaymentPage";
import PaymentReturn from "./features/orders/PaymentReturn";
import { ProductDetail, productDetailLoader, addToCartAction } from "./features/products/ProductDetail";
import { ProductFeed, productFeedLoader } from "./features/products/ProductFeed";
import { RegistrationPage, registerAction } from "./features/auth/RegistrationPage";


// https://reactrouter.com/en/main/routers/create-browser-router
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <FallbackErrorPage />,
    loader: authLoader,
    id: "app",
    children: [
      {
        path: "",
        element: <ProductFeed />,
        loader: productFeedLoader,
      },
      {
        path: "account",
        element: <AccountPage />,
        loader: ordersLoader
      },
      {
        path: "cart",
        element: <Cart />,
        loader: cartLoader,
        action: removeCartItemAction,
      },
      {
        path: "category/:categorySlug",
        element: <ProductFeed />,
        loader: productFeedLoader,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
        loader: cartLoader,
        action: checkoutAction,
      },
      {
        path: "checkout/:orderId/payment",
        element: <PaymentPage />,
      },
      {
        path: "checkout/:orderId/payment-return",
        element: <PaymentReturn />,
      },
      {
        path: "checkout/:id/success",
        element: <OrderDetailsPage checkoutSuccess={true} />,
        loader: orderDetailsLoader,
      },
      {
        path: "login",
        element: <LoginPage />,
        action: loginAction,
      },
      {
        path: "orders/:id",
        element: <OrderDetailsPage />,
        loader: orderDetailsLoader,
      },
      {
        path: "products/:id/:productNameSlug",
        element: <ProductDetail />,
        loader: productDetailLoader,
        action: addToCartAction,
      },
      {
        path: "register",
        element: <RegistrationPage />,
        action: registerAction,
      },
      {
        path: "search",
        element: <ProductFeed isSearchResults={true} />,
        loader: productFeedLoader,
      },
    ],
  },
]);
