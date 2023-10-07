import { Link } from "react-router-dom";

import { getProductDetailPath, getProductImagePath } from "./utils";
import StarRating from "../../components/StarRating/StarRating";

import utilStyles from "../../App/utilStyles.module.css";
import styles from "./ProductFeedItem.module.css";


export default function ProductFeedItem({ productData }) {
  const detailPath = getProductDetailPath(productData.id, productData.name);
  const imagePath = getProductImagePath(productData.id, productData.name);

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
        <StarRating rating={productData.avg_rating} />
        <div className={styles.price}>{productData.price}</div>
      </div> 
    </article>
  );
}
