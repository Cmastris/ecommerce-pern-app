import { redirect, useLoaderData } from "react-router-dom";
import { getProductDetailPath } from "./utils";


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

  return (
    <div>
      <h1>{error ? error : productData.name }</h1>
    </div>
  );
}
