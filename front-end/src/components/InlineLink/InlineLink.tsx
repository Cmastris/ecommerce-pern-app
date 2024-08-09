import { Link } from "react-router-dom";
import utilStyles from "../../App/utilStyles.module.css";


type InlineLinkProps = {
  /** The link URL path, starting with a forward slash */
  path: string,
  /** The clickable (anchor) link text */
  anchor: string
}


export default function InlineLink({ path, anchor }: InlineLinkProps) {
  return <Link to={path} className={utilStyles.link}>{anchor}</Link>
}
