import React from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup({ isOpen, onClose, onUpdateUser, buttonText }) {
  const [name, setName] = React.useState("");
  const [about, setAbout] = React.useState("");
  const currentUser = React.useContext(CurrentUserContext);

  React.useEffect(() => {
    setName(currentUser.name);
    setAbout(currentUser.about);
  }, [currentUser, isOpen]);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAboutChange(e) {
    setAbout(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateUser({
      name,
      about,
    });
  }

  return (
    <PopupWithForm
      name="edit"
      title="Edit Profile"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText={buttonText}
      buttonType="submit"
      buttonClassName="submit-button"
      buttonId="edit-submit"
    >
      <input
        type="text"
        className="popup-form__input"
        id="name"
        name="name"
        placeholder="name"
        minLength="2"
        maxLength="40"
        value={name || ""}
        onChange={handleNameChange}
        required
      />
      <span className="popup-form__error-text name-error"></span>
      <input
        type="text"
        className="popup-form__input"
        name="about"
        placeholder="description"
        id="about"
        minLength="2"
        maxLength="200"
        value={about || ""}
        onChange={handleAboutChange}
        required
      />
      <span className="popup-form__error-text about-error"></span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
