import React, { useState, useEffect, useRef } from 'react';
import useHttp from '../../hooks/http';

import ErrorModal from '../UI/ErrorModal';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const [enteredFilter, setEnteredFilter] = useState('');
  const { onLoadIngredients } = props;
  const inputRef = useRef();
  const { searchLoading, sendRequest, data, error, clear } = useHttp();

  useEffect(() => {
    const timer = setTimeout(() => {
      //aq enteredFilter AR iqneba mimdinare mnishvneloba, radganac js closures koncepciis tanaxmad
      //tviton Search component enclosed_s gauketebs mnishvnelobas (ara useEffect!)
      //da iqneba dzveli anu naxevari wamit adre mnishvneloba!!!
      //rac sheexeba inputRef_s aqac igive moxdeba realurat magram
      //inputRef aris Mutable object da current ukve mimdinare mnishvnelobas amoigebs!!!
      if (enteredFilter === inputRef.current.value) {
        const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
        sendRequest('https://react-hooks-add7b.firebaseio.com/ingredients.json' + query
          , 'SEND_REQUEST_SEARCH'
          , 'RESPONSE_SEARCH'
          , 'ERROR_SEARCH'
          , 'GET');
        // fetch('https://react-hooks-add7b.firebaseio.com/ingredients.json' + query)
        //   .then(response => {
        //     return response.json();
        //   })
        //   .then(responseData => {
        //     const loadedIngredients = [];
        //     for (const key in responseData) {
        //       loadedIngredients.push({
        //         id: key,
        //         title: responseData[key].title,
        //         amount: responseData[key].amount
        //       })
        //     }
        //     onLoadIngredients(loadedIngredients); // from props
        //   })
      }
    }, 500);

    return () => {
      //aseve magalitat dzveli subscriptionis washla tu gvinda
      clearTimeout(timer); // clean up
    }

  }, [enteredFilter, sendRequest, inputRef]); //like componentDidUpate and triggers when ONLY!!! enteredFilter or onLoadIngredients will change

  useEffect(() => {
    if (!searchLoading && !error && data) {
      const loadedIngredients = [];
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        })
      }
      onLoadIngredients(loadedIngredients); // from props
    }

  }, [searchLoading, data, error, onLoadIngredients]);

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}> {error} </ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {searchLoading && <span>loading...</span>}
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
