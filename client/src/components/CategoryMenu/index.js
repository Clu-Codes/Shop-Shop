import React, { useEffect } from "react";
import { useQuery } from '@apollo/react-hooks';
import { UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY } from '../../utils/actions'; 
import { QUERY_CATEGORIES } from "../../utils/queries";
import { useStoreContext } from '../../utils/GlobalState';

function CategoryMenu() {

  // retrieve the current state from global state object and dispatch to update state.
  const [state, dispatch ] = useStoreContext();
  // only using categories here, so this is all we grab
  const { categories } = state;
  const { data: categoryData } = useQuery(QUERY_CATEGORIES);
  
  useEffect(() => {
    // if categoryData exists or has changed from the response of useQuery, then run dispatch()
    if (categoryData) {
      // execute our dispatch function with our action object indicating the type of action and the data to set our state for categories to
      dispatch({
        type: UPDATE_CATEGORIES,
        categories: categoryData.categories
      });
    }
  }, [categoryData, dispatch]);

  // upon retrieval of category from server, save category to global state object and use that data to print the list of categories to page
  const handleClick = id => {
    dispatch({
      type: UPDATE_CURRENT_CATEGORY,
      currentCategory: id
    });
  };

  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map(item => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;
