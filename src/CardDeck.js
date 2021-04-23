import React, { useState, useEffect} from 'react';
import axios from 'axios';
import Card from './Card';

const CardDeck = () => {
  const [ deck, setDeck ] = useState(null); // Deck available from API
  const [ card, setCard ] = useState([]);   // Holds cards from API
  const [ draw, setDraw ] = useState(false); //
  const [ cardsRemaining, setCardsRemaining ] = useState(true);
  const [ cardCount, setCardCount] = useState(0);
 

  const API_BASE_URL = "https://deckofcardsapi.com/api/deck";
 
  // Get new deck of cards once after component rendered
  useEffect(() => {
    const  getNewDeck = async () => {
      let deckInfo =  await axios.get(`${API_BASE_URL}/new/shuffle/`); 
      setDeck(deckInfo.data)
    }
    getNewDeck(deck);
  }, []);

  useEffect(() => {
    const getNewCard = async () => {
      if (deck) { // After initial render card deck won't be available from API call
        let { deck_id } = deck;
        try {
        // Retrieve a card from the deck 
        let cardDrawnData = await axios.get((`${API_BASE_URL}/${deck_id}/draw/`)); 
        // Check to see if any cards remain to be displayed if not then skip display
        if (cardsRemaining) {  

          // Card #52 will have cardsRemaining = 0, so set cardsRemaing flag to false
          if (cardDrawnData.data.remaining === 0) {
            // When no cards remaining we will disable button in the view to request more cards
            setCardsRemaining(false);
            throw new Error("Error: No cards remaining!")
          }
          // Used to display number of cards dealt to user 
          setCardCount(cardCount => cardCount + 1);

          // Get card values (suit, cardvalue, card image)
          const cardDrawn = cardDrawnData.data.cards[0];

          // Add new card values to array containing other cards 
          setCard(d => [
            ...d, 
            { id: cardDrawn.code,
              name: `${cardDrawn.suit} ${cardDrawn.value}`,
              image: cardDrawn.image, 
              cardsRemaining: cardDrawnData.data.remaining ,
              cardCount: cardCount
            }
          ]);
          }
        } catch (err) {
          alert(err)
        }
      } 

    }
    getNewCard();
  }, [draw]);
  
    const dealCard = () => {
      // Toggle draw state each time button is clicked to cause rerender of component to display new card
       setDraw(!draw)
    }

    // Build array of card components for each card 
    const cards = card.map(c => (
      <Card key={c.id} name={c.name} image={c.image} cardsRemaining={c.cardsRemaining} />
    )); 

  return (
    <div>

      {!cardsRemaining ? <span>Sorry, No more cards</span> :
      <div>
        <button onClick={dealCard} disabled={!cardsRemaining} >
        {/* <button onClick={dealCard}  > */}

            Hit Me!
        </button>
        <br></br>
        <span>{cardCount}</span>
        <div>{cards}</div>
      </div>
      } 

    </div>
  )
}

export default CardDeck;