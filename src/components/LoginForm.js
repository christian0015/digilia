import React, { useState } from 'react';
import axios from 'axios';
import './Formulaire.css';

const LoginAndRegisterForm = () => {
  const [isLogin, setIsLogin] = useState(true); // État pour basculer entre login et registre
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Utilisé uniquement pour l'inscription
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // Logique de connexion
        const response = await axios.post('https://digilia-server.vercel.app/api/auth/login', { email, password });
        const { token, user } = response.data;

        localStorage.setItem('digiliaToken', token);
        localStorage.setItem('digiliaUser', JSON.stringify(user));
        window.location.href = 'projet'; // Redirection après connexion
      } else {
        // Logique d'inscription
        const response = await axios.post('https://digilia-server.vercel.app/api/auth/register', { email, password, username });
        alert('Inscription réussie, vous pouvez maintenant vous connecter');
        setIsLogin(true); // Bascule vers la connexion après l'inscription
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur');
    }
  };

  return (
    <div className="form-container">
      <form className='login-form' onSubmit={handleSubmit}>
        <div>
          <div className='login-form-enonce'>
            <h5>{isLogin ? 'Connecte toi à ton compte Digilia ' : 'Inscript toi pour créer un compte'}</h5>
            <h2>{isLogin ? 'Connexion' : 'Inscription'}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>

          <div className='login-form-champs'>
            {!isLogin && (
              <div>
                <label htmlFor="username">Nom d'utilisateur:</label><br/>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}

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

            <button type="submit">{isLogin ? 'Se connecter' : "S'inscrire"}</button>
          </div>

          <div className="switch-form">
            <p onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Pas de compte ?" : "Déjà un compte ?"}{' '}
              <span >
                {isLogin ? "Inscrivez-vous ici" : "Connectez-vous ici"}
              </span>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginAndRegisterForm;
