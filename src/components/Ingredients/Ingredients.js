import React, { useReducer, useCallback, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal'
import Search from './Search';
import useHttp from '../../hooks/http';


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

function Ingredients() {
  const [ingredientsState, dispatchIng] = useReducer(ingredientReducer, []); // tavidan [] wava state argumentshi 
  //useHttp rom daaupdatetdeba anu state shecvleba avtomaturat darenderdeba Ingredients esec
  const { addLoading, deleteLoading, extra, reqIdentifier, data, sendRequest, clear, error } = useHttp();

  useEffect(() => {
    console.log('blblb');
    if (!deleteLoading && !error && reqIdentifier === 'SEND_REQUEST_DELETE') {
      dispatchIng({ type: 'DELETE', id: extra });
    } else if (!addLoading && !error && reqIdentifier === 'SEND_REQUEST_ADD') {
      dispatchIng({ type: 'ADD', ingredient: { id: data.name, ...extra } });
    }

  }, [data, extra, deleteLoading, addLoading, reqIdentifier, error])


  //useCallbacks viyenebt optimiziaciistvis
  //magram tu ingredientForm ar iqneba React.memo_shi ise azri ar aqvs
  //dependecty ar gvaqvs magitoa []: 
  //ing shida parametria, dispatchHttp kide tviton react ar daarenderebs roca ar iqneba sachiro
  const addIngredientHandler = useCallback((ing) => {
    sendRequest(`https://react-hooks-add7b.firebaseio.com/ingredients.json`
      , 'SEND_REQUEST_ADD'
      , 'RESPONSE_ADD'
      , 'ERROR_ADD'
      , 'POST'
      , ing
      , JSON.stringify(ing));
    // dispatchHttp({ type: 'SEND_REQUEST_ADD' });
    // fetch('https://react-hooks-add7b.firebaseio.com/ingredients.json', {
    //   method: 'POST',
    //   body: JSON.stringify(ing),
    //   headers: { 'Content-Type': 'application.json' }
    // }).then(response => {
    //   dispatchHttp({ type: 'RESPONSE_ADD' });
    //   return response.json();
    // }).then(responseData => {
    //   dispatchIng({ type: 'ADD', ingredient: { id: responseData.name, ...ing } });
    // }).catch(error => {
    //   dispatchHttp({ type: 'ERROR_ADD', error: error.message });
    // });
  }, [sendRequest]);

  const removeIngredientHandler = useCallback((id) => {
    sendRequest(`https://react-hooks-add7b.firebaseio.com/ingredients/${id}.json`
      , 'SEND_REQUEST_DELETE'
      , 'RESPONSE_DELETE'
      , 'ERROR_DELETE'
      , 'DELETE'
      , id);
    //dispatchHttp({ type: 'SEND_REQUEST_DELETE', id: id });
    // fetch(`https://react-hooks-add7b.firebaseio.com/ingredients/${id}.json`, {
    //   method: 'DELETE'
    // }).then(response => {
    //   dispatchHttp({ type: 'RESPONSE_DELETE' });
    //   dispatchIng({ type: 'DELETE', id: id });
    // }).catch(error => {
    //   dispatchHttp({ type: 'ERROR_DELETE', error: error.message });
    // });
  }, [sendRequest]);

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

  //ErrorModal ideti patara komponentia aq realurat arc aris sachiro
  //optimizacia radganac virtual domis checks ragac pontshi
  //patara komponentis gadarendereba jobia
  const closeHandler = useCallback(() => {
    clear();
  }, [clear]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={closeHandler}> {error} </ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler}
        loading={addLoading}
      />
      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={ingredientsState}
          onRemoveItem={removeIngredientHandler}
          deleteLoading={deleteLoading}
          deletedItem={extra} />
      </section>
    </div>
  );
}

export default Ingredients;
