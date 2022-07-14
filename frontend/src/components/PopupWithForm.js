import React from "react";

function PopupWithForm({
  name,
  title,
  children,
  isOpen,
  onClose,
  onSubmit,
  buttonText,
  buttonType,
  buttonClassName,
  buttonId,
}) {
  return (
    <div className={`popup-form ${isOpen ? "popup-form_open" : ""}`}>
      <div className="popup-form__container">
        <button
          type="button"
          className="close-button"
          onClick={onClose}
        ></button>
        <h2 className="popup-form__title">{title}</h2>
        <form name={name} onSubmit={onSubmit}>
          <div className="popup-form__input-container">
            {children}
            <button type={buttonType} className={buttonClassName} id={buttonId}>
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;
