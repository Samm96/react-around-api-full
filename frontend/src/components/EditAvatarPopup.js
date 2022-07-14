import React from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar, buttonText }) {
  const avatarRef = React.useRef();

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  }

  React.useEffect(() => {
    avatarRef.current.value = "";
  }, [isOpen]);

  return (
    <PopupWithForm
      name="profile pic"
      title="Change profile picture"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText={buttonText}
      buttonType="submit"
      buttonClassName="submit-button"
      buttonId="profile-pic-button"
    >
      <input
        className="popup-form__input"
        ref={avatarRef}
        placeholder="add image..."
        id="profile-pic"
        type="url"
        pattern="https://.*|http://.*"
        required
      />
      <span className="popup-form__error-text profile-pic-error"></span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
