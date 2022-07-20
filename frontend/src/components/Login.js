import React from "react";
import UserForm from "./UserForm";

function Login({ route, onLogin }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const userData = {
      email,
      password,
    };
    onLogin(userData);
  }

  return (
    <UserForm
      buttonText="Log in"
      title="Log In"
      text="Not a member yet? Sign up"
      route={route}
      onSubmit={handleSubmit}
    >
      <input
        type="email"
        className="user-form__input"
        id="email"
        name="email"
        placeholder="Email"
        minLength="2"
        maxLength="40"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        className="user-form__input"
        id="password"
        name="password"
        placeholder="Password"
        minLength="2"
        maxLength="40"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </UserForm>
  );
}

export default Login;
