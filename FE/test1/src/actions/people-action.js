import {
  CREATE_PEOPLE,
  RETRIEVE_PEOPLES,
  UPDATE_PEOPLE,
  DELETE_PEOPLE,
} from "./types";

import PeopleService from "../services/peopleService";

export const createPeople = (data) => async (dispatch) => {
  try {
    const res = await PeopleService.createPeople(data);

    dispatch({
      type: CREATE_PEOPLE,
      payload: res.data,
    });

    return Promise.resolve(res.data);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const retrievePeople = () => async (dispatch) => {
  try {
    const res = await PeopleService.getAllPeople();
    console.log(res.data)
    dispatch({
      type: RETRIEVE_PEOPLES,
      payload: res.data,
    });
    return res.data
  } catch (err) {
    console.log(err);
  }
};

export const updatePeople = (data) => async (dispatch) => {
  try {
    const res = await PeopleService.updatePeople(data);

    dispatch({
      type: UPDATE_PEOPLE,
      payload: res.data,
    });

    return Promise.resolve(res.data);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deletePeople = (id) => async (dispatch) => {
  try {
    await PeopleService.removePeople(id);

    dispatch({
      type: DELETE_PEOPLE,
      payload: { id }
    });
  } catch (err) {
    console.log(err);
  }
};

