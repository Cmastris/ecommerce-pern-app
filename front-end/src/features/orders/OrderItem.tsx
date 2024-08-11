import { Form, Link } from "react-router-dom";

import { OrderItemData } from "./orderItemData";
import { getProductDetailPath } from "../products/utils";
import styles from "./OrderItem.module.css";
import utilStyles from "../../App/utilStyles.module.css";


export type RemoveCartItemActionData = {
  error: boolean,
  productId: string,
  productName: string
}

type OrderItemProps = {
  orderItemData: OrderItemData,
  editable?: boolean,
  lastItem?: boolean
}


export async function removeCartItemAction({ request }: { request: Request }) {
  // https://reactrouter.com/en/main/start/tutorial#data-writes--html-forms
  // https://reactrouter.com/en/main/route/action
  let formData = await request.formData();
  const productId = formData.get("product_id");
  const productName = formData.get("product_name");
  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/cart/items/${productId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (res.ok) {
      return { error: false, productId, productName };
    }
    throw new Error("Unexpected status code.");
  } catch (error) {
    return { error: true, productId, productName };
  }
}


export function OrderItem({ orderItemData, editable, lastItem }: OrderItemProps) {
  const { product_id, product_name, product_price } = orderItemData;
  const productPath = getProductDetailPath(product_id, product_name);

  return (
    <div className={styles.orderItem}>
      <hr className={utilStyles.separator} />
      <article className={styles.flexContainer}>
        <div className={styles.contentContainer}>
          <strong>
            <Link to={productPath} className={`${utilStyles.largeText} ${utilStyles.link}`}>{product_name}</Link>
          </strong>
          <div className={utilStyles.mt1rem}>{product_price}</div>
        </div>
        {editable ?
        <Form method="post">
          <input type="hidden" name="product_id" value={product_id}></input>
          <input type="hidden" name="product_name" value={product_name}></input>
          <button type="submit" className={styles.button}>Remove</button>
        </Form>
        : null}
      </article>
      {lastItem ? <hr className={utilStyles.separator} /> : null}
    </div>
  );
}
