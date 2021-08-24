import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:19855",
  headers: {
    "Content-type": "application/json"
  }
});
