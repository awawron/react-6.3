import React from 'react';
import { createContext, useContext, useState } from 'react';
import { CurrentUserContext } from './Form.js';
import json from '../data/users.json' assert { type: 'json' };

const ErrorContext = createContext([]);

export function Login() {
  const { setCurrentUser } = useContext(CurrentUserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const defaultErrors = ['Email incorrect', 'Password too short'];
  const [error, setError] = useState(defaultErrors);

  function handleLogin(email, password) {
    const users = json.users;
    const user = users.filter((el) => el.email == email);
    if (user.length > 0) {
      if (user[0].password == password) {
        setCurrentUser(user[0]);
      }
    }
  }

  const canLogin = error.length === 0;

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      <h1>Login</h1>
      <Input
        label={'Email'}
        value={email}
        onchangeFunc={setEmail}
        errorFunc={checkEmail}
      />
      <br />
      <Input
        label={'Password'}
        value={password}
        onchangeFunc={setPassword}
        errorFunc={checkEmpty}
      />
      <br />
      <button
        disabled={!canLogin}
        onClick={() => {
          handleLogin(email, password);
        }}
      >
        Login
      </button>
      <button
        onClick={() => {
          setEmail('');
          setPassword('');
          setError(defaultErrors);
        }}
      >
        Reset
      </button>
      <ul>
        {error.map((err, i) => {
          return <li key={i}>{err}</li>;
        })}
      </ul>
    </ErrorContext.Provider>
  );
}

function Input({ label, type, value, onchangeFunc, errorFunc }) {
  const { error, setError } = useContext(ErrorContext);

  return (
    <label>
      {label}
      {': '}
      <input
        type={type}
        required
        value={value}
        onChange={(e) => {
          onchangeFunc(e.target.value);
          setError(errorFunc(e.target.value, label, error));
        }}
      ></input>
    </label>
  );
}

function checkEmpty(value, label, errorArr) {
  const errmsg = label + ' too short';
  if (value.length < 8) {
    if (errorArr.filter((el) => el == errmsg).length == 0) {
      return [...errorArr, errmsg];
    }
  } else {
    return errorArr.filter((el) => el != errmsg);
  }
  return errorArr;
}

function checkEmail(value, label, errorArr) {
  const errmsg = 'Email incorrect';
  const check = value.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  if (check === null) {
    if (errorArr.filter((el) => el == errmsg).length == 0) {
      return [...errorArr, errmsg];
    }
  } else {
    return errorArr.filter((el) => el != errmsg);
  }
  return errorArr;
}

function findUsername(email, password) {
  const found = json.users.find((el) => el.email == email);
  if (found == undefined) {
    return false;
  } else {
    if (found.password == password) {
      return found.username;
    }
  }
  return false;
}
