import React, { useState, useEffect, useRef} from 'react';
import axios from 'axios';
import Card from './Card';
import './CardDeck.css'

const CardDeck = () => {
  const [ deck, setDeck ] = useState(null); // Deck available from API
  const [ card, setCard ] = useState([]);   // Holds cards from API
  const [ draw, setDraw ] = useState(false); // Boolean for card draw button 
  const [ cardsRemaining, setCardsRemaining ] = useState(true); // Boolean to track if any cards left to draw.
  const [ cardCount, setCardCount] = useState(0); // Keep track of number of cards drawn
  const [ autoDraw, setAutoDraw ] = useState(false)
  const timerRef = useRef(null);
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

        // Check to see if any cards remain to be displayed if not then skip display
        if (cardsRemaining) {  

          // Retrieve a card from the deck 
          let cardDrawnData = await axios.get((`${API_BASE_URL}/${deck_id}/draw/`)); 

          // Card #52 will have cardsRemaining = 0, so set cardsRemaing flag to false
          if (cardDrawnData.data.remaining === 0) {
            // When no cards remaining we will disable button in the view to request more cards
            setCardsRemaining(false);
            setAutoDraw(false);
            // throw new Error("Error: No cards remaining!")
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

    if (autoDraw && !timerRef.current) {
      timerRef.current = setInterval(async () => {
        await getNewCard();
      }, 1000);
    }
    return () => {
      clearInterval(timerRef.current); 
      timerRef.current = null;
    }

  }, [draw, autoDraw]);
  
    // Function associated with Part 1 of exercise:
    const dealCard = () => {
      // Toggle draw state each time button is clicked to cause rerender of component to display new card
       setDraw(!draw)
    }

    const autoDealCard = () => {
      setAutoDraw(!autoDraw)
    }

    // Build array of card components for each card 
    const cards = card.map(c => (
      <Card key={c.id} name={c.name} image={c.image} cardsRemaining={c.cardsRemaining} />
    )); 

  return (
    <div className="CardDeck">

      {/* {!cardsRemaining ? <span>Sorry, No more cards</span> : */}
      <div>
        { !cardsRemaining ? <div>No more cards in this Deck - Refresh Browswer for a new deck</div> : ""}
        <button onClick={autoDealCard} disabled={!cardsRemaining} >
            Hit Me!
        </button>
        <br/>
        <span>{cardCount}</span>
        <div className="CardDeck-cards">{cards}</div>
      </div>
      {/* }  */}

    </div>
  )
}

export default CardDeck;