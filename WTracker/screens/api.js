import axios from 'axios';

const BASE_URL = 'http://192.168.0.27:8000';

export const registerUser = async (username, email, password) => {
  try {
    const res = await axios.post(`${BASE_URL}/register`, {
      username,
      email,
      password,
    });
    return res.data;
  } catch (error) {
    console.error('Error al registrar usuario:', error.response?.data || error.message);
    throw error;
  }
};

export const loginUser = async (username, password) => {
  try {
    const res = await axios.post(`${BASE_URL}/login`, {
      username,
      password,
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error.response?.data || error.message);
    throw error;
  }
};

export const addWeight = async (username, value, date) => {
  try {
    const res = await axios.post(`${BASE_URL}/add_weight/${username}`, {
      value,
      date,
    });
    return res.data;
  } catch (error) {
    console.error('Error al añadir peso:', error.response?.data || error.message);
    throw error;
  }
};

export const getWeights = async (username) => {
  try {
    const res = await axios.get(`${BASE_URL}/weights/${username}`);
    return res.data;
  } catch (error) {
    console.error('Error al obtener pesos:', error.response?.data || error.message);
    throw error;
  }
};