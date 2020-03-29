import React, { useReducer, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal'
import Search from './Search';


// yvelaperi aq gvaq da reduceris gamoyeneba magito aris praqtikuli 

//stateshi data avtomaturat modis by react tavidan [] shemdeg rac ingredients shi iqneba
const ingredientReducer = (curState, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...curState, action.ingredient]
    case 'DELETE':
      return curState.filter(ing => ing.id !== action.id);
    default:
      throw new Error('aq ra gindaa!!!');
  }
}

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case 'SEND_REQUEST_ADD':
      return { ...httpState, addLoading: true, error: null }
    case 'SEND_REQUEST_DELETE':
      return { ...httpState, deleteLoading: true, error: null, deletedIngId: action.id }
    case 'RESPONSE_ADD':
      return { ...httpState, addLoading: false }
    case 'RESPONSE_DELETE':
      return { ...httpState, deleteLoading: false }
    case 'ERROR_ADD':
      return { ...httpState, addLoading: false, error: action.error }
    case 'ERROR_DELETE':
      return { ...httpState, deleteLoading: false, error: action.error }
    case 'CLEAR':
      return { ...httpState, error: null }
    default:
      throw new Error('aq ra gindaa!!!');
  }
}

function Ingredients() {
  const [ingredientsState, dispatchIng] = useReducer(ingredientReducer, []); // tavidan [] wava state argumentshi 
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    addLoading: false
    , deleteLoading: false
    , deletedIngId: null
  });

  const addIngredientHandler = (ing) => {
    dispatchHttp({ type: 'SEND_REQUEST_ADD' });
    fetch('https://react-hooks-add7b.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ing),
      headers: { 'Content-Type': 'application.json' }
    }).then(response => {
      dispatchHttp({ type: 'RESPONSE_ADD' });
      return response.json();
    }).then(responseData => {
      dispatchIng({ type: 'ADD', ingredient: { id: responseData.name, ...ing } });
    }).catch(error => {
      dispatchHttp({ type: 'ERROR_ADD', error: error.message });
    });
  };

  const removeIngredientHandler = (id) => {
    dispatchHttp({ type: 'SEND_REQUEST_DELETE', id: id });
    fetch(`https://react-hooks-add7b.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE'
    }).then(response => {
      dispatchHttp({ type: 'RESPONSE_DELETE' });
      dispatchIng({ type: 'DELETE', id: id });
    }).catch(error => {
      dispatchHttp({ type: 'ERROR_DELETE', error: error.message });
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
    dispatchIng({ type: 'SET', ingredients: filteredIngredients });
  }, []);

  const closeHandler = () => {
    dispatchHttp({ type: 'CLEAR' });
  }

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={closeHandler}> {httpState.error} </ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler}
        loading={httpState.addLoading}
      />
      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={ingredientsState}
          onRemoveItem={removeIngredientHandler}
          deleteLoading={httpState.deleteLoading}
          deletedItem={httpState.deletedIngId} />
      </section>
    </div>
  );
}

export default Ingredients;
