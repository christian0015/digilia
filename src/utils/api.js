// src/utils/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/', // Remplacez par votre URL de base
  // headers: {
  //   'Content-Type': 'application/json',
  //   // Vous pouvez ajouter d'autres en-têtes si nécessaire
  // },
});

export default api;
