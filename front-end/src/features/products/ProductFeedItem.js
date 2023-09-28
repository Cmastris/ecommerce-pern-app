import { getProductDetailPath, getProductImagePath } from "./utils";

export default function ProductFeedItem({ productData }) {
  const detailPath = getProductDetailPath(productData.id, productData.name);
  const imagePath = getProductImagePath(productData.id, productData.name);

  return (
    <article>
      <a href={detailPath}>
        <img src={imagePath} alt={productData.name}></img>
        <h3>{productData.name}</h3>
      </a>
      <div>
        <p>{productData.price}</p>
        <p>{productData.avg_rating}/5.00</p>
      </div> 
    </article>
  );
}
