import { useState, useEffect } from 'react';

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('digiliaUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return user;
};

export default useAuth;