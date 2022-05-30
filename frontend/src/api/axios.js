import axios from "axios";
const baseURL = 'https://vilbedawg-parser.herokuapp.com/';

export default axios.create({
    baseURL: baseURL,
});

// export const axiosPrivate = axios.create({
//     baseURL: baseURL,
//     headers: { 'Content-Type': 'application/json' },
//     withCredentials: true
// });