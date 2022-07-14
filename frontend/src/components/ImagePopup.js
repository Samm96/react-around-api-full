import React from "react";

function ImagePopup({ card, onClose }) {
  return (
    <div className={`popup-form ${card && "popup-form_open"}`}>
      <div className="popup-form__container popup-form__container_type_image">
        <img
          className="popup-form__image"
          id="imgPopupImg"
          src={card && card.link}
          alt={card && card.name}
        />
        <p className="popup-form__caption">{card && card.name}</p>
        <button
          type="button"
          className="close-button"
          onClick={onClose}
        ></button>
      </div>
    </div>
  );
}

export default ImagePopup;
