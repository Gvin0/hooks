import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const [enteredFilter, setEnteredFilter] = useState('');
  const { onLoadIngredients } = props;
  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      //aq enteredFilter AR iqneba mimdinare mnishvneloba, radganac js closures koncepciis tanaxmad
      //tviton Search component enclosed_s gauketebs mnishvnelobas da ara useEffect
      //da iqneba dzveli anu naxevari wamit adre mnishvneloba anu !!!
      //rac sheexeba inputRef_s aqac igive moxdeba realurat magram
      //inputRef aris Mutable object da current ukve mimdinare mnishvnelobas amoigebs!!!
      if (enteredFilter === inputRef.current.value) {
        const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
        fetch('https://react-hooks-add7b.firebaseio.com/ingredients.json' + query)
          .then(response => {
            return response.json();
          })
          .then(responseData => {
            const loadedIngredients = [];
            for (const key in responseData) {
              loadedIngredients.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount
              })
            }
            onLoadIngredients(loadedIngredients); // from props
          })
      }
    }, 500);

    return () => {
      //aseve magalitat dzveli subscriptionis washla tu gvinda
      clearTimeout(timer); // clean up
    }

  }, [enteredFilter, onLoadIngredients, inputRef]); //like componentDidUpdate and triggers when ONLY!!! enteredFilter or onLoadIngredients will change

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            type="text"
            ref={inputRef}
            value={enteredFilter}
            onChange={event => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
