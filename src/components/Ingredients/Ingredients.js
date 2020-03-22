import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal'
import Search from './Search';

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deletedId, setdeletedId] = useState('');
  const [error, setError] = useState();

  const addIngredientHandler = (ing) => {
    setIsLoading(true);
    fetch('https://react-hooks-add7b.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ing),
      headers: { 'Content-Type': 'application.json' }
    }).then(response => {
      setIsLoading(false);
      return response.json();
    }).then(responseData => {
      setIngredients(prevIngredients => [
        ...prevIngredients,
        { id: responseData.name, ...ing }
      ]);
    })

  };

  const removeIngredientHandler = (id) => {
    setIsDeleteLoading(true);
    setdeletedId(id);
    fetch(`https://react-hooks-add7b.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE'
    }).then(response => {
      setIsDeleteLoading(false);
      setIngredients(prevIngredients => prevIngredients.filter(ing => ing.id !== id));
    }).catch(error => {
      //ony one render cycle - react batches setStates
      setError(error.message);
      setIsDeleteLoading(false); 
    });
  };

  // useCallback is mtavari mugami aris rom , roca mshobeli renderdeba
  // axlidan iqmndeba yvelaperi ANU PUNQCIEBIC
  // shesabamisad qvevit anu shvilshi gamoiwvevs shvilis darenderebas radganac props sheaicvala realurat
  // nu eg am shetxvevashi iwvevda infinite loops
  // es rom ar moxdes useCallback cashavs filteredIngredientsHandler punqcias da 
  // axal variants ar gadacems shvils - 
  // gadacems igive anu dzvel variants da igive ukve agar iwvevs axlidan shvilis renders
  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    setIngredients(filteredIngredients);
  }, []);

  const closeHandler = () => {  
    setError(null);
  }

  return (
    <div className="App">
      {error && <ErrorModal onClose={closeHandler}> {error} </ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} 
        loading={isLoading}
      />
      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList 
          ingredients={ingredients} 
          onRemoveItem={removeIngredientHandler} 
          deleteLoading={isDeleteLoading}
          deletedItem={deletedId}/>
      </section>
    </div>
  );
}

export default Ingredients;
