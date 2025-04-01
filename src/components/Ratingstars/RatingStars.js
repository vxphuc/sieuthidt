import Rating from "react-rating";
import { memo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const RatingStars = ({value, onSelect}) => {

  return (
    <>
      <Rating
        initialRating={value}
        onChange={(rate) => {
          if(onSelect) onSelect(rate)
        }}
        emptySymbol={<span className="star"><FontAwesomeIcon icon={faStar} size="2xl" style={{ color: "#b0b6bf" }} /></span>}
        fullSymbol={<span className="star full"><FontAwesomeIcon icon={faStar} size="2xl" style={{ color: "#FFD43B" }} /></span>}
      />
    </>
  );
};

export default memo(RatingStars);
