import { Link, useLoaderData, useRouteLoaderData } from "react-router-dom";
import CartItem from "./CartItem";


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

  if (!authData.logged_in) {
    return (
      <div>
        <h1>Cart</h1>
        <p>Please <Link to="/login?redirect=/cart">log in</Link> to view your cart.</p>
      </div>
    );
  }

  function renderCartItems() {
    if (error) {
      return <p>{error}</p>;
    }
    const cartItems = cartData.map(item => <CartItem key={item.product_id} productData={item} />);
    return <div>{cartItems}</div>;
  }

  return (
    <div>
      <h1>Cart</h1>
      <p>You are logged in as {authData.email_address}. Your cart items are listed below.</p>
      {renderCartItems()}
    </div>
  );
}
