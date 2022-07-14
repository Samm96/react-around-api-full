import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card({ card, onCardClick, onCardLike, onCardDeleteClick }) {
  const currentUser = React.useContext(CurrentUserContext);

  const isOwn = card.owner._id === currentUser._id;

  const cardDeleteButtonClassName = `delete-button ${
    isOwn ? "" : "delete-button_hidden"
  }`;

  //maybe works? come back to this //not working. button not active
  const isLiked = card.likes.some((user) => user._id === currentUser._id);

  const cardLikeButtonClassName = `like-button ${
    isLiked ? "like-button_active" : ""
  }`;

  function handleCardLike() {
    onCardLike(card);
  }

  function handleClick() {
    onCardClick(card);
  }

  function handleCardDelete() {
    onCardDeleteClick(card);
  }

  return (
    <article className="element">
      <button
        arial-label="delete"
        type="button"
        className={cardDeleteButtonClassName}
        id="delete-card-button"
        onClick={handleCardDelete}
      ></button>
      <img
        className="element__image"
        src={card.link}
        alt={card.name}
        onClick={handleClick}
      />
      <div className="element__card">
        <h2 className="element__title">{card.name}</h2>
        <div className="element__like-container">
          <button
            arial-label="like"
            type="button"
            className={cardLikeButtonClassName}
            onClick={handleCardLike}
          ></button>
          <p className="like-button__counter">{card.likes.length}</p>
        </div>
      </div>
    </article>
  );
}

export default Card;
