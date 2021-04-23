import React, {useState} from 'react';
import './Card.css'
const Card = ({name, image}) => {

  const [{angle, xPos, yPos}] = useState({
    angle: Math.random() * 90 - 45,
    xPos: Math.random() * 40 - 20,
    yPos: Math.random() * 40 - 20
  });
  // console.log(card)
  return (
    <img className="Card"
       alt={name}
       src={image}
       style={{transform: `rotate(${angle}deg) translate(${xPos}px, ${yPos}px)` }}
    />
  )
}
export default Card;