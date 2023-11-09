import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function TesterLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
const navigate = useNavigate();
  const handleLogin = (e) => {
    e.preventDefault();
    const enteredUsername = 'pavani';
    const enteredPassword = 'p@123';

    if (username === enteredUsername && password === enteredPassword) {
     
        navigate('/tester', { state: { isAuthenticated: true } });

    } else {
     
      console.log('Invalid credentials');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row ">
      <div className="col-md-3">
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header text-center " style={{backgroundColor:'#D0A2F7'}}> <h3>Name Craft Tester Login</h3></div>
            <div className="card-body">
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className='text-center'>
                <button type="submit" className="btn btn-primary btn-block">
                  Login
                </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-3">
        </div>
      </div>
    </div>
  );
}
