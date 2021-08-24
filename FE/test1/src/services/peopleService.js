import http from "../http-common";

const getAllPeople = () => {
  return http.get("/api/people/getAllPeople");
};

const createPeople = data => {
  return http.put("/api/people/AddPeople", data);
};

const updatePeople = (data) => {
  return http.post(`/api/people/UpdatePeople/`, data);
};

const removePeople = id => {
  return http.delete(`/api/people/${id}`);
};

const PeopleService = {
  getAllPeople,
  createPeople,
  updatePeople,
  removePeople
};

export default PeopleService;
