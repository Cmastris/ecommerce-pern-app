import { Link } from "react-router-dom";

import { getProductDetailPath, getProductImagePath } from "./utils";
import StarRating from "../../components/StarRating/StarRating";

import utilStyles from "../../App/utilStyles.module.css";
import styles from "./ProductFeedItem.module.css";


export default function ProductFeedItem({ productData }) {

  const detailPath = getProductDetailPath(productData.id, productData.name);
  const imagePath = getProductImagePath(productData.id, productData.name);
  const { avg_rating, rating_count, price } = productData;

  return (
    <article className={styles.feedItem}>
      <Link to={detailPath}>
        <img src={imagePath} alt={productData.name} className={`${utilStyles.image} ${styles.image}`}></img>
      </Link>
      <div className={styles.textContainer}>
        <div className={styles.nameContainer}>
          <Link to={detailPath} className={styles.nameLink}>
            <strong className={styles.name}>{productData.name}</strong>
          </Link>
        </div>
        {avg_rating ?
        <div className={styles.ratingContainer}>
          <StarRating rating={avg_rating} />
          <span className={styles.ratingCount}>{rating_count}
          {rating_count > 1 ? " ratings" : " rating"}
          </span>
        </div>
        : null}
        <div className={styles.price}>{price}</div>
      </div> 
    </article>
  );
}
