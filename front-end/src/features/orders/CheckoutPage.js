import { Form, Link, redirect, useActionData, useLoaderData, useRouteLoaderData } from "react-router-dom";

import { renderOrderItems } from "./utils";
import InlineErrorPage from "../../components/InlineErrorPage/InlineErrorPage";


export async function checkoutAction({ request }) {
  // https://reactrouter.com/en/main/start/tutorial#data-writes--html-forms
  // https://reactrouter.com/en/main/route/action
  let formData = await request.formData();
  try {
    const address = formData.get("address");
    const postcode = formData.get("postcode");
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/cart/checkout`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ address, postcode })
      }
    );

    if (res.ok) {
      const { order_id } = await res.json();
      return redirect(`/checkout/${order_id}/success`);
    }
    throw new Error("Unexpected status code.");
  } catch (error) {
    return { checkoutError: "Sorry, your order could not be placed. Please try again later." };
  }
}


export function CheckoutPage() {
  // https://reactrouter.com/en/main/hooks/use-route-loader-data
  const authData = useRouteLoaderData("app");
  const { cartData, cartLoaderError } = useLoaderData();
  const checkoutError = useActionData()?.checkoutError;

  if (!authData.logged_in) {
    return <InlineErrorPage pageName="Checkout" type="login_required" loginRedirect="/cart" />;
  } else if (cartLoaderError) {
    return <InlineErrorPage pageName="Checkout" message={cartLoaderError} />;
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
      {renderOrderItems(cartData, false)}
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
      {checkoutError ? (
        <div>
          <p>{checkoutError}</p>
          <Link to="/">Continue shopping</Link>
        </div>
      ) : null}
    </div>
  );
}
