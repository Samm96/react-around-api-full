import React from "react";
import { Link } from "react-router-dom";

function UserForm({
  buttonText,
  name,
  onSubmit,
  route,
  children,
  title,
  text,
}) {
  return (
      <section className="user-form">
        <div className="user-form__container">
          <h2 className="user-form__title">{title}</h2>
          <form name={name} onSubmit={onSubmit}>
            <div className="user-form__input-container">{children}</div>
            <button className="submit-button submit-button_type_user-form">
              {buttonText}
            </button>
            <p className="user-form__text">
              {text}{" "}
              <Link className="user-form__link" to={route}>
                here
              </Link>
              !
            </p>
          </form>
        </div>
      </section>
  );
}

export default UserForm;
