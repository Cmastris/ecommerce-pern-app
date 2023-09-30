import { Link, useActionData, useLoaderData, useRouteLoaderData } from "react-router-dom";

import CartItem from "./CartItem";
import { getProductDetailPath } from "../products/utils";


export async function cartLoader() {
  // https://reactrouter.com/en/main/start/tutorial#loading-data
  // https://reactrouter.com/en/main/route/loader
  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/cart`,
      { credentials: "include" }
    );
    if (res.ok) {
      const cartData = await res.json();
      if (cartData.length === 0) {
        return { error: "Your cart is empty." };
      }
      return { cartData };
    }
    throw new Error('Unexpected status code.');
  } catch (error) {
    return { error: "Sorry, your cart items could not be retrieved." };
  }
}


export function Cart() {
  // https://reactrouter.com/en/main/hooks/use-route-loader-data
  const authData = useRouteLoaderData("app");
  const { cartData, error } = useLoaderData();
  const removalResult = useActionData();

  if (!authData.logged_in) {
    return (
      <div>
        <h1>Cart</h1>
        <p>Please <Link to="/login?redirect=/cart">log in</Link> to view your cart.</p>
      </div>
    );
  }

  function renderRemovalMessage() {
    const { error, productId, productName } = removalResult;
    if (error) {
      return <p>Sorry, '{productName}' couldn't be removed from your cart.</p>;
    }
    const productPath = getProductDetailPath(productId, productName);
    return <p>'<Link to={productPath}>{productName}</Link>' was removed from your cart.</p>;
  }

  function renderCheckoutButton() {
    if (!error) {
      return <Link to="/checkout">Go to checkout</Link>;
    }
  }

  function renderCartItems() {
    if (error) {
      return <p>{error}</p>;
    }
    const cartItems = cartData.map(
      item => <CartItem key={item.product_id} productData={item} editable={true} />
    );
    return <div>{cartItems}</div>;
  }

  return (
    <div>
      <h1>Cart</h1>
      <p>You are logged in as {authData.email_address}.</p>
      {cartData?.length > 2 ? renderCheckoutButton() : null}
      {removalResult ? renderRemovalMessage() : null}
      {renderCartItems()}
      <hr />
      {renderCheckoutButton()}
    </div>
  );
}
