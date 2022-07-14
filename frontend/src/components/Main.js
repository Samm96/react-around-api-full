import React from "react";
import Card from "./Card";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Main({
  onEditAvatarClick,
  onEditProfileClick,
  onAddPlaceClick,
  onCardClick,
  onCardLike,
  onCardDeleteClick,
  cards,
}) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main>
      <section className="profile">
        <div className="profile__group">
          <div className="profile__image-container">
            <div className="profile__overlay">
              <button
                onClick={onEditAvatarClick}
                type="button"
                className="edit-button edit-button_type_profile-image"
                id="edit-pic-button"
              ></button>
            </div>
            <img
              className="profile__image"
              src={currentUser.avatar}
              alt="Profile"
            />
          </div>
          <div className="profile__info">
            <h1 className="profile__name">{currentUser.name}</h1>
            <p className="profile__description">{currentUser.about}</p>
          </div>
          <button
            onClick={onEditProfileClick}
            id="edit-button"
            type="button"
            className="edit-button"
          ></button>
          <button
            onClick={onAddPlaceClick}
            type="button"
            className="add-button"
          ></button>
        </div>
      </section>

      <section className="elements">
        {cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            onCardClick={onCardClick}
            onCardLike={onCardLike}
            onCardDeleteClick={onCardDeleteClick}
          />
        ))}
      </section>
    </main>
  );
}

export default Main;
