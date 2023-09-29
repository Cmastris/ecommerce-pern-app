import { redirect, useLoaderData, useNavigate, useRouteLoaderData } from "react-router-dom";

import { getProductDetailPath, getProductImagePath } from "./utils";
import StarRating from "../../components/StarRating/StarRating";


export async function productDetailLoader({ params }) {
  // https://reactrouter.com/en/main/start/tutorial#loading-data
  // https://reactrouter.com/en/main/route/loader
  try {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${params.id}`);

    if (res.status === 404) {
      // https://reactrouter.com/en/main/route/error-element#throwing-manually
      throw new Response('Not Found', { status: 404 });
    } else if (!res.ok) {
      throw new Error('Unsuccessful product fetch.');
    }

    const productData = await res.json();

    // Redirect non-canonical matched paths to the canonical path
    const currentPath = `/products/${params.id}/${params.productNameSlug}`;
    const canonicalPath = getProductDetailPath(productData.id, productData.name);
    if (currentPath !== canonicalPath) {
      return redirect(canonicalPath);
    }

    return { productData };

  } catch (error) {
    if (error.status === 404) {
      throw error;  // Serve 404 error page
    }
    return { error: 'Sorry, product data could not be loaded.' };
  }
}


export function ProductDetail() {
  const { productData, error } = useLoaderData();
  const authData = useRouteLoaderData("app");
  const navigate = useNavigate();

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  const { short_description, long_description, avg_rating, rating_count, price } = productData;
  const stock_count = productData.available_stock_count;
  const imagePath = getProductImagePath(productData.id, productData.name);

  function renderButton() {
    // TODO: add onclick functionality
    if (stock_count < 1) {
      return <button disabled>Out of stock</button>;
    } else if (authData.logged_in) {
      return <button>Add to cart</button>;
    } else {
      return <button onClick={() => navigate('/login')}>Log in</button>;
    }
  }

  return (
    <div>
      <section>
        <div>
          <img src={imagePath} alt={productData.name}></img>
        </div>
        <div>
          <h1>{productData.name}</h1>
          <p>{price}</p>
          <hr />
          <p>{short_description}</p>
          <hr />
          {(stock_count >= 1 && stock_count <= 5) ? <p>Only {stock_count} left in stock!</p> : null }
          {renderButton()}
          <StarRating rating={avg_rating} />
          <p>Rated {avg_rating}/5.00 based on {rating_count} ratings</p>
        </div>
      </section>
      <section>
        <h2>Description</h2>
        <p>{short_description}</p>
        <p>{long_description}</p>
      </section>
    </div>
  );
}
