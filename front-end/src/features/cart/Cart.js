import { Link, useRouteLoaderData } from "react-router-dom";

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
