import { createBrowserRouter } from "react-router-dom";

import AccountPage from "./components/AccountPage/AccountPage";
import { App, authLoader } from "./App/App";
import { Cart, cartLoader } from "./features/cart/Cart";
import CheckoutPage from "./components/CheckoutPage/CheckoutPage";
import { removeCartItemAction } from "./features/cart/CartItem";
import FallbackErrorPage from "./components/FallbackErrorPage/FallbackErrorPage";
import { LoginPage, loginAction } from "./features/auth/LoginPage";
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
      },
      {
        path: "cart",
        element: <Cart />,
        loader: cartLoader,
        action: removeCartItemAction,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
        action: loginAction,
      },
      {
        path: "register",
        element: <RegistrationPage />,
        action: registerAction,
      },
      {
        path: "category/:categorySlug",
        element: <ProductFeed />,
        loader: productFeedLoader,
      },
      {
        path: "products/:id/:productNameSlug",
        element: <ProductDetail />,
        loader: productDetailLoader,
        action: addToCartAction,
      },
    ],
  },
]);
