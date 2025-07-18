import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// You can either hardcode the URL or use an .env file with react-native-dotenv

// const baseURL = "http://192.168.1.156:8080/api/v1/"; // Fallback if env is missing

const baseURL = "http://192.168.1.10:8080/api/v1/"; // Fallback if env is missing


const ApiService = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Intercept requests to add token from AsyncStorage
ApiService.interceptors.request.use(
  async (config) => {
    try {
      const authDataString = await AsyncStorage.getItem("authData");

      if (authDataString) {
        const authData = JSON.parse(authDataString);
        const token = authData?.token;

        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
    } catch (e) {
      console.warn("Token retrieval failed", e);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses to catch errors
ApiService.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default ApiService;
