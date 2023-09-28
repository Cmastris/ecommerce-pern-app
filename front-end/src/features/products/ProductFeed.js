import { useLoaderData } from "react-router-dom";
import ProductFeedItem from "./ProductFeedItem";


async function fetchCategoryData(categorySlug) {
  // Fetch all categories data
  const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/categories`);
  if (!res.ok) {
    throw new Error('Unsuccessful categories fetch.');
  }
  const categories = await res.json();

  // Find matching category, otherwise return a 404
  const filteredCategories = categories.filter(c => c.url_slug === categorySlug);
  if (filteredCategories.length === 0) {
    // https://reactrouter.com/en/main/route/error-element#throwing-manually
    throw new Response('Not Found', { status: 404 });
  }
  return filteredCategories[0];
}


export async function productFeedLoader({ params }) {
  // https://reactrouter.com/en/main/start/tutorial#loading-data
  // https://reactrouter.com/en/main/route/loader
  try {
    let productsFetchURL = `${process.env.REACT_APP_API_BASE_URL}/products`;
    let categoryData = null;

    if (params.categorySlug) {
      // Fetch category data and add filter query string
      categoryData = await fetchCategoryData(params.categorySlug);
      productsFetchURL += `?category_id=${categoryData.id}`;
    }

    // Retrieve products
    const res = await fetch(productsFetchURL);
    if (!res.ok) {
      throw new Error('Unsuccessful products fetch.');
    }
    const productsData = await res.json();

    // Return category and products data
    return { productsData, categoryData };

  } catch (error) {
    if (error.status === 404) {
      throw error;  // Serve 404 error page
    }
    return { error: 'Sorry, products could not be loaded.' };
  }
}


export function ProductFeed() {
  // https://reactrouter.com/en/main/hooks/use-route-loader-data
  const { categoryData, productsData, error } = useLoaderData();

  function renderFeedItems() {
    if (error) {
      return <p>{error}</p>
    }
    const feedItems = productsData.map(p => <ProductFeedItem key={p.id} productData={p} />);
    return <div>{feedItems}</div>;
  }

  return (
    <div>
      <h1>{categoryData ? categoryData.name : 'All Products'}</h1>
      <p>{categoryData ? categoryData.description : 'Browse our full range of products.'}</p>
      {renderFeedItems()}
    </div>
  );
}
