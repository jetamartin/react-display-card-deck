import React, { useState, useEffect} from 'react';
import axios from 'axios';
import Card from './Card';

const CardDeck = () => {
  const [ deck, setDeck ] = useState(null);
  const [ card, setCard ] = useState(null);
  // const []

  const API_BASE_URL =    "https://deckofcardsapi.com/api"

  // Get new deck of cards once after component rendered
  useEffect(() => {
    const  getNewDeck = async () => {
      let deckInfo =  await axios.get(`${API_BASE_URL}/deck/new/`); 
      setDeck(deckInfo.data)
    }
    getNewDeck(deck);
    console.log('====> Deck data ', deck)
  }, []);

  useEffect(() => {
    const getNewCard = async () => {
      console.log(deck)
      debugger;
      let { deck_id } = deck;
      let cardData = await axios.get((`${API_BASE_URL}/${deck_id}/draw/`)); 
      // console.log('getNewCard => deck_id value', deck_id)
      // console.log('cardData: ', cardData);
      // const card = cardData.data.cards[0];
    }

    // setCard(card => [
    //   ...card, 
    //   { id: card.code,
    //     name: `${card.suit} ${card.value}`,
    //     image: card.image
    //   }
    //   ]);
    getNewCard();
  }, [setDeck]);
  
    const dealCard = () => {
      // console.log("Hitme clicked");
      console.log(deck)
      setCard(card.remaining)
      // setDeck((deck) => deck.remaining = deck.remaining - 1 );
      // setDeck(() => deck.remaining = deck.remaining - 1)
    }

  return (
    <div>
      <button onClick={dealCard} >
        Hit Me!
      </button>
      <Card card={card}/>

    </div>
  )
}

export default CardDeck;