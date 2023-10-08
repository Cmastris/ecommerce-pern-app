import { Link } from "react-router-dom";
import utilStyles from "../../App/utilStyles.module.css";

export default function InlineLink({ path, anchor }) {
  return <Link to={path} className={utilStyles.link}>{anchor}</Link>
}
