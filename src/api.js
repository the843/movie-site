import axios from "axios";

const API_KEY = "4228896b45212df64cecd5a44dd5541d";
const BASE_URL = "https://api.themoviedb.org/3";

// البحث في TMDB (Movies + TV)
export const searchMoviesAndSeries = async (query) => {
  try {
    const res = await axios.get(`${BASE_URL}/search/multi`, {
      params: { api_key: API_KEY, query, language: "en-US", page: 1, include_adult: false }
    });
    return res.data.results;
  } catch (err) {
    console.error(err);
    return [];
  }
};

// باقي الدوال كما هي
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

export const getPopularSeries = async (page = 1) => {
  try {
    const res = await axios.get(`${BASE_URL}/tv/popular`, {
      params: { api_key: API_KEY, language: "en-US", page }
    });
    return res.data.results;
  } catch (err) {
    console.error(err);
    return [];
  }
};

// في ملف api.js أضف هذه الوظيفة
export const getSearchSuggestions = async (query) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=YOUR_API_KEY&query=${encodeURIComponent(query)}&language=ar&page=1`
    );
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching search suggestions:", error);
    return [];
  }
};