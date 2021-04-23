import React from 'react';

const Card = ({name, image}) => {
  // console.log(card)
  return (
    <img
       alt={name}
       src={image}
    />
  )
}
export default Card;