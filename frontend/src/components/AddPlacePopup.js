import React from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({ isOpen, onClose, onCardAdd, buttonText }) {
  const [name, setName] = React.useState("");
  const [link, setLink] = React.useState("");

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleLinkChange(e) {
    setLink(e.target.value);
  }

  function handleInputReset() {
    setName("");
    setLink("");
  }

  React.useEffect(() => {
    handleInputReset();
  }, [isOpen]);

  function handleAddPlaceSubmit(e) {
    e.preventDefault();

    onCardAdd({
      name,
      link,
    });
  }

  return (
    <PopupWithForm
      name="create"
      title="New place"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleAddPlaceSubmit}
      buttonText={buttonText}
      buttonType="submit"
      buttonClassName="submit-button"
      buttonId="create-button"
    >
      <input
        className="popup-form__input"
        id="title"
        name="name"
        placeholder="title"
        minLength="1"
        maxLength="30"
        value={name || ""}
        onChange={handleNameChange}
        required
      />
      <span className="popup-form__error-text title-error"></span>
      <input
        className="popup-form__input"
        name="link"
        placeholder="image link"
        id="image-link"
        type="url"
        pattern="https://.*|http://.*"
        value={link || ""}
        onChange={handleLinkChange}
        required
      />
      <span className="popup-form__error-text image-link-error"></span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
