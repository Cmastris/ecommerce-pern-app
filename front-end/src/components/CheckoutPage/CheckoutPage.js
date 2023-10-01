import { Form, useLoaderData, useRouteLoaderData } from "react-router-dom";

import { renderCartItems } from "../../features/orders/Cart";
import InlineErrorPage from "../InlineErrorPage/InlineErrorPage";


export default function CheckoutPage() {
  // https://reactrouter.com/en/main/hooks/use-route-loader-data
  const authData = useRouteLoaderData("app");
  const { cartData, cartLoaderError } = useLoaderData();

  if (!authData.logged_in) {
    return <InlineErrorPage pageName="Checkout" type="login_required" loginRedirect="/cart" />;
  } else if (cartLoaderError) {
    return <InlineErrorPage pageName="Checkout" message="Sorry, your cart could not be loaded. Please try again later." />;
  } else if (cartData.length === 0) {
    return <InlineErrorPage pageName="Checkout" message="Your cart is empty so it is not possible to checkout." />;
  }

  function renderTotalCost() {
    let totalCost = 0;
    cartData.forEach(item => {
      totalCost += Number(item.product_price.substring(1)) * item.product_quantity;
    });
    return <p>Total cost: ${totalCost}</p>;
  }

  return (
    <div>
      <h1>Checkout</h1>
      <p>You are logged in as {authData.email_address}. Complete your order below.</p>
      <h2>Cart items</h2>
      {renderCartItems(cartData, false)}
      <hr />
      {renderTotalCost()}
      <h2>Payment</h2>
      <p>This isn't a real ecommerce website!</p>
      <h2>Delivery address</h2>
      <Form method="post">
        <label htmlFor="address">Delivery name and address</label>
        <textarea id="address" name="address" rows="5" minLength={15} required />
        <label htmlFor="postcode">Postcode</label>
        <input id="postcode" type="text" name="postcode" minLength={5} maxLength={10} required />
        <button type="submit">Submit order</button>
      </Form>
      {/* TODO: create checkout action; render errors */}
    </div>
  );
}
