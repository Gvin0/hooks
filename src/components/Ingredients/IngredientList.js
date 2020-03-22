import React from 'react';

import LoadingIndicator from '../UI/LoadingIndicator';
import './IngredientList.css';

const IngredientList = props => {
  return (
    <section className="ingredient-list">
      <h2>Loaded Ingredients</h2>
      <ul>
        {props.ingredients.map(ig => {
          let loadingIndicator = null;
          if (props.deleteLoading && props.deletedItem === ig.id) {
            loadingIndicator = <LoadingIndicator />
          }
          return (
            <li key={ig.id} onClick={props.onRemoveItem.bind(this, ig.id)}>
              <span>{ig.title}</span>
              {loadingIndicator}
              <span>{ig.amount}x</span>
            </li>
          )
        })}
      </ul>
    </section>
  );
};

export default IngredientList;
