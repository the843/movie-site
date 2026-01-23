import axios from "axios";

const API_KEY = "4228896b45212df64cecd5a44dd5541d";
const BASE_URL = "https://api.themoviedb.org/3";

// Movies trending
export const getTrendingMovies = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/trending/movie/week`, {
      params: { api_key: API_KEY }
    });
    return res.data.results;
  } catch (err) {
    console.error(err);
    return [];
  }
};

// Latest movies (Now Playing)
export const getLatestMovies = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/movie/now_playing`, {
      params: { api_key: API_KEY, language: "en-US", page: 1 }
    });
    return res.data.results;
  } catch (err) {
    console.error(err);
    return [];
  }
};

// Popular TV Series
export const getPopularSeries = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/tv/popular`, {
      params: { api_key: API_KEY, language: "en-US", page: 1 }
    });
    return res.data.results;
  } catch (err) {
    console.error(err);
    return [];
  }
};

// Popular movies (ممكن تستعملو كذلك)
export const getPopularMovies = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/movie/popular`, {
      params: { api_key: API_KEY, language: "en-US", page: 1 }
    });
    return res.data.results;
  } catch (err) {
    console.error(err);
    return [];
  }
};
