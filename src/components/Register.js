import React from 'react';
import { createContext, useContext, useState } from 'react';
import json from '../data/users.json' assert { type: 'json' };

const ErrorContext = createContext([]);
const TermsContext = createContext(null);

export function Register() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bday, setBday] = useState('');
  const [pic, setPic] = useState('');
  const defaultErrors = [
    'Name too short',
    'Surname too short',
    'Email incorrect',
    'Password too short',
    'Include your birthday',
    'Please accept the terms',
  ];
  const [error, setError] = useState(defaultErrors);
  const [terms, setTerms] = useState(true);

  const canLogin =
    error.length === 1 &&
    (error[0] == 'Weak password' ||
      error[0] == 'Good password' ||
      error[0] == 'Strong password');

  function handleCheckbox() {
    setTerms(!terms);
    setError(checkTerms(terms, error));
  }

  function createUser(name, surname, email, password, bday, pic) {
    const users = json.users;
    let id = 0;
    if (users.length != undefined) {
      id = users.length;
    }

    if (users.length <= id) {
      const user = {
        id: users.length,
        name: name,
        surname: surname,
        email: email,
        password: password,
        bday: bday,
        pic: pic,
      };
      json.users = [...json.users, user];

      console.log(json.users);
    }

    setName('');
    setSurname('');
    setEmail('');
    setPassword('');
    setBday('');
    setPic('');
    setTerms(true);
    setError(defaultErrors);
  }

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      <h1>Register</h1>
      <Input
        label={'Name'}
        value={name}
        onchangeFunc={setName}
        errorFunc={checkEmpty}
      />
      <br />
      <Input
        label={'Surname'}
        value={surname}
        onchangeFunc={setSurname}
        errorFunc={checkEmpty}
      />
      <br />
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
        errorFunc={checkPassword}
      />
      <br />
      <label>
        Birth Day{': '}
        <input
          label={'Birth Day'}
          type={'date'}
          value={bday}
          onChange={(e) => {
            setBday(e.target.value);
            setError(checkBday(e.target.value, error));
          }}
        />
      </label>
      <br />
      <Input
        label={'Image'}
        type={'file'}
        value={pic}
        onchangeFunc={setPic}
        errorFunc={checkImage}
      />
      <br />
      <TermsContext.Provider value={{ terms, setTerms }}>
        <label>
          I accept
          <input
            type={'checkbox'}
            checked={!terms}
            onChange={handleCheckbox}
          ></input>
        </label>
      </TermsContext.Provider>
      <br />
      <button
        disabled={!canLogin}
        onClick={() => {
          createUser(name, surname, email, password, bday, pic);
        }}
      >
        Register
      </button>
      <button
        onClick={() => {
          setName('');
          setSurname('');
          setEmail('');
          setPassword('');
          setBday('');
          setPic('');
          setTerms(true);
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

function checkBday(value, errorArr) {
  const nodate = 'Include your birthday';
  const tooyoung = 'Too young';
  const tooold = 'Too old';
  let errmsg = '';

  const replacedArr1 = errorArr.filter((el) => el != nodate);
  const replacedArr2 = replacedArr1.filter((el) => el != tooold);
  const replacedArr3 = replacedArr2.filter((el) => el != tooyoung);

  if (value == '') {
    return [...replacedArr3, nodate];
  }
  const date = value.split('-');
  const today = new Date();
  const parsedDate = {
    year: parseInt(date[0]),
    month: parseInt(date[1]),
    day: parseInt(date[2]),
  };
  const parsedToday = {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  };

  if (parsedDate.year - parsedToday.year <= -123) {
    errmsg = tooold;
  } else if (parsedDate.year - parsedToday.year <= -14) {
    return replacedArr3;
  } else if (
    parsedDate.year - parsedToday.year == -13 &&
    parsedDate.month - parsedToday.month < 0
  ) {
    errmsg = tooyoung;
  } else if (
    parsedDate.year - parsedToday.year == -13 &&
    parsedDate.month - parsedToday.month == 0 &&
    parsedDate.day - parsedToday.day < 0
  ) {
    return replacedArr3;
  } else {
    errmsg = tooyoung;
  }

  return [...replacedArr3, errmsg];
}

function checkTerms(terms, errorArr) {
  const errmsg = 'Please accept the terms';
  if (!terms) {
    if (errorArr.filter((el) => el == errmsg).length == 0) {
      return [...errorArr, errmsg];
    }
  } else {
    return errorArr.filter((el) => el != errmsg);
  }
  return errorArr;
}

function checkImage(thing, label, errorArr) {
  return errorArr;
}

function checkEmpty(value, label, errorArr) {
  const errmsg = label + ' too short';
  if (value.length <= 0) {
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

function checkPassword(value, label, errorArr) {
  const tooshort = 'Password too short';
  const weak = 'Weak password';
  const okay = 'Good password';
  const strong = 'Strong password';

  function checkPasswordStrength(password) {
    let str = 0;

    if (/[A-Z]/.test(password)) {
      str += 5;
    }
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) {
      str += 10;
    }
    if (/[0-9]/.test(password)) {
      str += 5;
    }
    str += password.length;

    if (password.length < 8) {
      return tooshort;
    } else if (str < 20) {
      return weak;
    } else if (str < 30) {
      return okay;
    } else {
      return strong;
    }
  }

  const errmsg = checkPasswordStrength(value);
  if (errmsg == tooshort) {
    if (errorArr.filter((el) => el == errmsg).length == 0) {
    } else {
      return errorArr;
    }
  }

  const replacedArr1 = errorArr.filter((el) => el != tooshort);
  const replacedArr2 = replacedArr1.filter((el) => el != weak);
  const replacedArr3 = replacedArr2.filter((el) => el != okay);
  const replacedArr4 = replacedArr3.filter((el) => el != strong);

  return [...replacedArr4, errmsg];
}
