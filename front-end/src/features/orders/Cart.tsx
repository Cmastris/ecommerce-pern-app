import { Link, useActionData, useLoaderData, useRouteLoaderData } from "react-router-dom";

import { AuthData } from "../auth/authData";
import { OrderItemData } from "./orderItemData";
import { RemoveCartItemActionData } from "./OrderItem";
import InlineErrorPage from "../../components/InlineErrorPage/InlineErrorPage";
import InlineLink from "../../components/InlineLink/InlineLink";
import { getProductDetailPath } from "../products/utils";
import { renderOrderItems } from "./utils";

import utilStyles from "../../App/utilStyles.module.css";


export type CartLoaderData = {
  cartData: OrderItemData[],
  cartLoaderErrMsg?: string
}


export async function cartLoader() {
  // https://reactrouter.com/en/main/start/tutorial#loading-data
  // https://reactrouter.com/en/main/route/loader
  let cartData: OrderItemData[] = [];
  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/cart`,
      { credentials: "include" }
    );
    if (res.ok) {
      cartData = await res.json();
      return { cartData };
    }
    throw new Error("Unexpected status code.");
  } catch (error) {
    return { cartData, cartLoaderErrMsg: "Sorry, your cart could not be loaded. Please try again later." };
  }
}


export function Cart() {
  // https://reactrouter.com/en/main/hooks/use-route-loader-data
  const authData = useRouteLoaderData("app") as AuthData;
  const { cartData, cartLoaderErrMsg } = useLoaderData() as CartLoaderData;
  const removalResult = useActionData() as RemoveCartItemActionData | undefined;

  if (!authData.logged_in) {
    return <InlineErrorPage pageName="Cart" type="login_required" loginRedirect="/cart" />;
  } else if (cartLoaderErrMsg) {
    return <InlineErrorPage pageName="Cart" message={cartLoaderErrMsg} />;
  }

  function renderRemovalMessage() {
    if (!removalResult) {
      return null;
    }
    const { error, productId, productName } = removalResult;

    let message: string | React.JSX.Element;
    if (error) {
      message = `Sorry, '${productName}' couldn't be removed from your cart.`;
    } else {
      const productPath = getProductDetailPath(productId, productName);
      message = <>'<InlineLink path={productPath} anchor={productName} />' was removed from your cart.</>;
    }
    return <p><strong>{message}</strong></p>;
  }

  return (
    <div className={utilStyles.pagePadding}>
      <h1 className={utilStyles.h1}>Cart</h1>
      <p>
        You are logged in as {authData.email_address}.
        {cartData?.length > 0 ?
        <> View your cart below or <InlineLink path="/checkout" anchor="check out" />.</>
        : null }
      </p>
      {removalResult ? renderRemovalMessage() : null}
      {renderOrderItems(cartData, true)}
      {cartData?.length > 0 ?
      <Link to="/checkout" className={utilStyles.button}>Go to checkout</Link>
      : null}
    </div>
  );
}
