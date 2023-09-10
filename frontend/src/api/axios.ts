import axios from 'axios';

export default axios.create({
    // backend url
    baseURL: "https://appointease-backend1.onrender.com",
    // baseURL: "http://localhost:4500",
});
