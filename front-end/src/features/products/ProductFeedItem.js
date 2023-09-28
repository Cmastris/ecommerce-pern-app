import { getProductDetailPath, getProductImagePath } from "./utils";
import StarRating from "../../components/StarRating/StarRating";

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
        <StarRating rating={productData.avg_rating} />
      </div> 
    </article>
  );
}
