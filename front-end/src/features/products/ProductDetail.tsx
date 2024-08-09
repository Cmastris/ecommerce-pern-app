import { Form, Link, redirect, useActionData, useLoaderData, useRouteLoaderData } from "react-router-dom";

import { AuthData } from "../auth/authData";
import { ProductData } from "./productData";
import InlineErrorPage from "../../components/InlineErrorPage/InlineErrorPage";
import InlineLink from "../../components/InlineLink/InlineLink";
import StarRating from "../../components/StarRating/StarRating";
import { getProductDetailPath, getProductImagePath } from "./utils";

import utilStyles from "../../App/utilStyles.module.css";
import styles from "./ProductDetail.module.css";


type LoaderData = {
  productData: ProductData,
  errMsg: string | null
}


export async function addToCartAction({ params }) {
  // https://reactrouter.com/en/main/start/tutorial#data-writes--html-forms
  // https://reactrouter.com/en/main/route/action
  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/cart/items/${params.id}`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (res.ok) {
      const cartLink = <InlineLink path="/cart" anchor="cart" />
      return <>This item has been added to your {cartLink}.</>;
    } else if (res.status === 400) {
      const errorMessage = await res.text();
      return errorMessage;
    }
    throw new Error("Unexpected status code.");
  } catch (error) {
    return "Sorry, this item couldn't be added to your cart.";
  }
}


export async function productDetailLoader({ params }) {
  // https://reactrouter.com/en/main/start/tutorial#loading-data
  // https://reactrouter.com/en/main/route/loader

  let { productData, errMsg } = { productData: {}, errMsg: null } as LoaderData;

  try {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${params.id}`);

    if (res.status === 404) {
      // https://reactrouter.com/en/main/route/error-element#throwing-manually
      throw new Response("Not Found", { status: 404 });
    } else if (!res.ok) {
      throw new Error("Unsuccessful product fetch.");
    }

    productData = await res.json();

    // Redirect non-canonical matched paths to the canonical path
    const currentPath = `/products/${params.id}/${params.productNameSlug}`;
    const canonicalPath = getProductDetailPath(productData.id, productData.name);
    if (currentPath !== canonicalPath) {
      return redirect(canonicalPath);
    }

  } catch (error) {
    if (error.status === 404) {
      throw error;  // Serve 404 error page
    }
    errMsg = "Sorry, this product could not be loaded.";
  }

  return { productData, errMsg };
}


export function ProductDetail() {
  const { productData, errMsg } = useLoaderData() as LoaderData;
  const authData = useRouteLoaderData("app") as AuthData;
  const addToCartMessage = useActionData() as string | undefined;

  if (errMsg) {
    return <InlineErrorPage pageName="Error" message={errMsg} />;
  }

  const { short_description, long_description, avg_rating, rating_count, price } = productData;
  const stock_count = productData.available_stock_count;
  const imagePath = getProductImagePath(productData.id, productData.name);

  function renderButton() {
    const buttonStyles = `${utilStyles.button} ${styles.button}`;
    if (stock_count < 1) {
      return <p className={utilStyles.largeText}><em>Out of stock</em></p>;

    } else if (authData.logged_in) {
      return (
        <Form method="post">
          <button type="submit" className={buttonStyles}>Add to cart</button>
        </Form>
      );

    } else {
      const currentPath = getProductDetailPath(productData.id, productData.name);
      const linkPath = `/login?redirect=${currentPath}`;
      return <Link to={linkPath} className={buttonStyles}>Log in to buy</Link>;
    }
  }

  return (
    <div className={utilStyles.pagePadding}>
      <section className={styles.summarySection}>
        <div className={styles.imageContainer}>
          <img
            src={imagePath}
            alt={productData.name}
            height="500"
            width="500"
            className={styles.image}></img>
        </div>
        <div className={styles.summaryTextContent}>
          <h1 className={styles.productName}>{productData.name}</h1>
          <p className={styles.price}>{price}</p>
          <hr />
          <p>{short_description}</p>
          <hr />
          {(stock_count >= 1 && stock_count <= 5) ? <p><strong>Only {stock_count} left in stock!</strong></p> : null }
          {renderButton()}
          {addToCartMessage ? <p className={styles.buttonMessage}>{addToCartMessage}</p> : null}
          {avg_rating ?
          <div>
            <StarRating rating={avg_rating} />
            <div className={styles.ratingText}>Rated {avg_rating}/5.00 based on {rating_count} ratings</div>
          </div>
          : null}
        </div>
      </section>
      <section className={styles.descriptionSection}>
        <h2>Description</h2>
        <p className={utilStyles.XLText}>{short_description}</p>
        <p>{long_description}</p>
      </section>
    </div>
  );
}
