import {
  CREATE_PEOPLE,
  RETRIEVE_PEOPLES,
  UPDATE_PEOPLE,
  DELETE_PEOPLE,
} from "../actions/types";

const initialState = [];

const peopleReducer = (peoples = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case CREATE_PEOPLE:
      return [...peoples, payload];

    case RETRIEVE_PEOPLES:
      return [...peoples, payload];;

    case UPDATE_PEOPLE:
      return [...peoples, payload];

    case DELETE_PEOPLE:
      return [...peoples, payload]; 

    default:
      return peoples;
  }
};

export default peopleReducer;