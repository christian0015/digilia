import React from 'react';
import LoginForm  from '../components/LoginForm';
import './LoginPage.css'

function LoginPage(){
  return(
      <div className="login-page">
        <div className='login-page-blur'>
          <div className='login-block'>
            <div>
            <LoginForm />
            </div>
            <div className='login-sous-block'></div>
          </div>
        </div>
    </div>
  )
}

export default LoginPage;