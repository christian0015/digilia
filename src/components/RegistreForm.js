import React, { useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './Formulaire.css';
import LoginForm from './LoginForm';

const RegistreForm = () => {
  // Rédirection
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate('/logIn');
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('/api/login', { email, password });
      const { token, user } = response.data;

      // Stocker le token et les informations de l'utilisateur dans localStorage
      localStorage.setItem('digiliaToken', token);
      localStorage.setItem('digiliaUser', JSON.stringify(user));

      // Redirection ou autre logique après la connexion réussie
      window.location.href = '/dashboard'; // Exemple de redirection
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    }
  };

  return (
    <form className='login-form' onSubmit={handleSubmit}>
      <div>
        <div className='login-form-enonce'>
          <h5>Inscrit-toi à toi compte Digilia</h5>
          <h2>Inscription</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>

        <div className='login-form-champs'>
          <div>
            <label htmlFor="email">E-mail:</label> <br/>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Mot de passe:</label><br/>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">S'Inscrire'</button>
        </div>
        
        <div className="link" onClick={handleLoginClick}>S'inscrire</div>
      </div>
    </form>
  );
};

// export default RegistreForm;

function Router() {
  return (
    <Routes>
      <Route path="/" element={<RegistreForm />} />
      <Route path="/logIn" element={<LoginForm />} />
      {/* Ajoutez d'autres routes ici */}
    </Routes>
  );
}

export default Router;