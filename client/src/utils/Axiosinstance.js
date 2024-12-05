import axios from 'axios';

// Create an axios instance with custom configuration
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api', 
  timeout: 8000,
  withCredentials: true, // Moved out of headers and set as an instance option
  headers: {
    'Content-Type': 'application/json',
  }
});

export default axiosInstance;
