import React from 'react';
import { createContext, useContext, useState } from 'react';
import { Register } from './Register.js';
import { Login } from './Login.js';

export const CurrentUserContext = createContext(null);

export default function Form() {
  const [currentUser, setCurrentUser] = useState(null);

  function setUserToNothing() {
    setCurrentUser(null);
  }

  function WelcomePanel() {
    if (currentUser === null) {
      return <Intro />;
    } else {
      console.log(currentUser);
      return <Welcome user={currentUser} />;
    }
  }

  function Welcome({ user }) {
    return (
      <>
        Welcome {user.name}!
        <br />
        <table>
          <tr>
            <td>Name</td>
            <td>{user.name}</td>
          </tr>
          <tr>
            <td>Surname</td>
            <td>{user.surname}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{user.email}</td>
          </tr>
          <tr>
            <td>Password</td>
            <td>{user.password}</td>
          </tr>
          <tr>
            <td>Birth Day</td>
            <td>{user.bday}</td>
          </tr>
          <tr>
            <td>Picture</td>
            <td>{user.pic}</td>
          </tr>
        </table>
        <button onClick={setUserToNothing}>Back</button>
      </>
    );
  }

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
      }}
    >
      <WelcomePanel />
    </CurrentUserContext.Provider>
  );
}

function Intro() {
  return (
    <table>
      <tbody>
        <tr>
          <th>
            <Register />
          </th>
          <th>
            <Login />
          </th>
        </tr>
      </tbody>
    </table>
  );
}
