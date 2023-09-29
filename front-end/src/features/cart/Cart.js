import { Link, useRouteLoaderData } from "react-router-dom";


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

  return (
    <div>
      <h1>Cart</h1>
      {!authData.logged_in ?
      <p>Please <Link to="/login?redirect=/cart">log in</Link> to view your cart.</p>
      :
      <p>You are logged in as {authData.email_address}. Your cart items are listed below.</p>
      }
    </div>
  );
}
