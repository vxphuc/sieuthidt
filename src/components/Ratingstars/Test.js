import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";

export default function TestIcon() {
  return (
    <div>
      <FontAwesomeIcon icon={solidStar} style={{ fontSize: 40, color: "gold" }} />
      <FontAwesomeIcon icon={regularStar} style={{ fontSize: 40, color: "gray" }} />
    </div>
  );
}

