import { MdStar, MdStarOutline, MdStarHalf } from "react-icons/md";
import styles from "./StarRating.module.css";


export default function StarRating({ rating }: { rating: string | number }) {

  function renderStars() {
    const wholeAndHalfStars = Math.round(Number(rating) * 2) / 2;  // Rounded to the nearest .5
    const wholeStars = Math.floor(wholeAndHalfStars);  // Rounded down to whole stars
    const ratingElements: React.JSX.Element[] = [];

    for (let x=0; x < wholeStars; x++) {
      ratingElements.push(<MdStar key={ratingElements.length} />);
    }
    if (wholeAndHalfStars % 1 !== 0) {
      ratingElements.push(<MdStarHalf key={ratingElements.length} />);
    }
    while (ratingElements.length < 5) {
      ratingElements.push(<MdStarOutline key={ratingElements.length} />);
    }
    return ratingElements;
  }

  return (
    <span className={styles.stars}>
      {renderStars()}
    </span>
  );
}
