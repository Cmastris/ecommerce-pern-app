import { Link } from "react-router-dom";
import { getProductDetailPath } from "../products/utils";

export default function CartItem({ productData }) {
  const { product_id, product_name, product_price } = productData;
  const productPath = getProductDetailPath(product_id, product_name);

  return (
    <article>
      <hr />
      <div>
        <h3><Link to={productPath}>{product_name}</Link></h3>
        <p>{product_price}</p>
        {/* TODO: implement delete functionality */}
        <button>Remove</button>
      </div>
    </article>
  );
}
