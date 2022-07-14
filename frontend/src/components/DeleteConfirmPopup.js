import React from "react";

function DeleteConfirmPopup({
  isOpen,
  onClose,
  title,
  onDeleteCardSubmit,
  cardToDelete,
}) {
  function handleDelete() {
    onDeleteCardSubmit(cardToDelete);
  }

  return (
    <div className={`popup-form ${isOpen ? "popup-form_open" : ""}`}>
      <div className="popup-form__container">
        <button
          type="button"
          className="close-button"
          onClick={onClose}
        ></button>
        <h2 className="popup-form__title">{title}</h2>
        <button
          type="button"
          className="delete-button delete-button_type_deleteConfirm"
          id="confirmation-button"
          onClick={handleDelete}
        >
          Yes
        </button>
      </div>
    </div>
  );
}

export default DeleteConfirmPopup;
