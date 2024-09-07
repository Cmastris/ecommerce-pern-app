import { redirect, useLoaderData } from "react-router-dom";

import { ProductData } from "./productData";
import InlineErrorPage from "../../components/InlineErrorPage/InlineErrorPage";
import ProductFeedItem from "./ProductFeedItem";

import utilStyles from "../../App/utilStyles.module.css";
import styles from "./ProductFeed.module.css";


type ProductFeedProps = {
  /** Whether the feed is generated using a search term in the URL path */
  isSearchResults?: boolean
}

type CategoryData = {
  id: number,
  name: string,
  description: string,
  url_slug: string
}

type LoaderData = {
  categoryData: CategoryData | null,
  productsData: ProductData[],
  searchTerm: string | null,
  errMsg: string | null
}


async function fetchCategoryData(categorySlug: string) {
  // Fetch all categories data
  const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/categories`);
  if (!res.ok) {
    throw new Error("Unsuccessful categories fetch.");
  }
  const categories: CategoryData[] = await res.json();

  // Find matching category, otherwise return a 404
  const filteredCategories = categories.filter(c => c.url_slug === categorySlug);
  if (filteredCategories.length === 0) {
    // https://reactrouter.com/en/main/route/error-element#throwing-manually
    throw new Response("Not Found", { status: 404 });
  }
  return filteredCategories[0];
}


export async function productFeedLoader({ params, request }) {
  // https://reactrouter.com/en/main/start/tutorial#loading-data
  // https://reactrouter.com/en/main/route/loader

  let { categoryData, productsData, searchTerm, errMsg } = {
    categoryData: null,
    productsData: [],
    searchTerm: null,
    errMsg: null
  } as LoaderData;
  
  try {
    let productsFetchURL = `${process.env.REACT_APP_API_BASE_URL}/products`;
    const url = new URL(request.url);

    if (params.categorySlug) {
      // Fetch category data
      categoryData = await fetchCategoryData(params.categorySlug);

      // Add category filter query string to product data request
      productsFetchURL += `?category_id=${categoryData.id}`;

    } else if (url.pathname.includes("search")) {
      searchTerm = url.searchParams.get("q");
      if (!searchTerm) {
        return redirect("/");
      }
      // Add search term filter query string to product data request
      productsFetchURL += `?search_term=${searchTerm}`;
    }

    // Fetch product listings data
    const res = await fetch(productsFetchURL);
    if (!res.ok) {
      throw new Error("Unsuccessful products fetch.");
    }
    productsData = await res.json();

  } catch (error) {
    if (error.status === 404) {
      throw error;  // Serve 404 error page
    }
    errMsg = "Sorry, products could not be loaded.";
  }

  return { productsData, categoryData, searchTerm, errMsg };
}


export function ProductFeed({ isSearchResults }: ProductFeedProps) {
  // https://reactrouter.com/en/main/hooks/use-route-loader-data
  const { categoryData, productsData, searchTerm, errMsg } = useLoaderData() as LoaderData;

  if (errMsg) {
    return <InlineErrorPage pageName="Error" message={errMsg} />;
  }

  function getHeadingText() {
    if (isSearchResults) {
      return "Search Results";
    } else if (categoryData) {
      return categoryData.name;
    } else {
      return "All Products";
    }
  }

  function getDescriptionText() {
    if (isSearchResults) {
      const productCount = productsData.length;
      const resultText = productCount !== 1 ? "results" : "result";
      return `${productCount} ${resultText} for "${searchTerm}".`;

    } else if (categoryData) {
      return categoryData.description;

    } else {
      return "Browse our full range of products.";
    }
  }

  function renderFeedItems() {
    if (productsData.length === 0) {
      return <p className={utilStyles.emptyFeedMessage}>Sorry, no products were found.</p>;
    }
    const feedItems = productsData.map(p => <ProductFeedItem key={p.id} productData={p} />);
    return <div className={styles.productGrid}>{feedItems}</div>;
  }

  return (
    <div className={utilStyles.pagePadding}>
      <div className={utilStyles.mb4rem}>
        <h1 className={utilStyles.h1}>{getHeadingText()}</h1>
        <p>{getDescriptionText()}</p>
      </div>
      {renderFeedItems()}
    </div>
  );
}
