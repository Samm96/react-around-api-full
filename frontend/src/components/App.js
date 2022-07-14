import React from "react";
import { Route, Redirect, Switch, useHistory } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Main from "./Main";
import ImagePopup from "./ImagePopup";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";
import MobilePopup from "./MobilePopup";
import * as auth from "../utils/auth";
import { api } from "../utils/Api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import DeleteConfirmPopup from "./DeleteConfirmPopup";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
  const [isDeleteConfirmPopupOpen, setDeleteConfirmPopupOpen] =
    React.useState(false);

  const [isInfoToolPopupOpen, setInfoToolPopupOpen] = React.useState(false);
  const [isInfoToolStatus, setInfoToolStatus] = React.useState("");
  const [isMobilePopupOpen, setMobilePopupOpen] = React.useState(false);

  const [selectedCard, setSelectedCard] = React.useState(null);
  const [selectedCardToDelete, setSelectedCardToDelete] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const [currentUser, setCurrentUser] = React.useState({
    name: "",
    about: "",
    avatar: "",
  });

  const [userEmail, setUserEmail] = React.useState("");

  const [cards, setCards] = React.useState([]);

  const userHistory = useHistory();

  React.useEffect(() => {
    const userToken = localStorage.getItem("jwt");
    if (userToken) {
      auth
        .checkToken(userToken)
        .then((res) => {
          if (res) {
            setUserEmail(res.data.email);
            setIsLoggedIn(true);
            userHistory.push("/");
          } else {
            localStorage.removeItem("jwt");
          }
        })
        .catch((err) => console.log(err));
    }
  }, [userHistory]);

  function onRegister({ email, password }) {
    auth
      .register(email, password)
      .then((res) => {
        if (res.data._id) {
          setInfoToolStatus("success");
          setInfoToolPopupOpen(true);
          userHistory.push("/signin");
        } else {
          setInfoToolStatus("fail");
          setInfoToolPopupOpen(true);
        }
      })
      .catch((err) => {
        setInfoToolStatus("fail");
        setInfoToolPopupOpen(true);
      });
  }

  function onLogin({ email, password }) {
    auth
      .login(email, password)
      .then((res) => {
        if (res.token) {
          setIsLoggedIn(true);
          setUserEmail(email);
          localStorage.setItem("jwt", res.token);
          localStorage.setItem("email", email);
          userHistory.push("/");
        } else {
          setInfoToolStatus("fail");
          setInfoToolPopupOpen(true);
        }
      })
      .catch((err) => {
        setInfoToolStatus("fail");
        setInfoToolPopupOpen(true);
      });
  }

  function onLogout() {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    userHistory.push("/signin");
    closeAllPopups();
  }

  React.useEffect(() => {
    api
      .getInitialCardList()
      .then((cardData) => {
        setCards(cardData);
      })
      .catch((err) => console.log(err));
  }, []);

  function handleCardLike(card) {
    const isLiked = card.likes.some((user) => user._id === currentUser._id);
    api
      .toggleLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((currentCard) =>
            currentCard._id === card._id ? newCard : currentCard
          )
        );
      })
      .catch((err) => console.log(err));
  }

  function handleCardAdd(data) {
    setIsLoading(true);
    api
      .addCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleCardDelete(card) {
    api
      .removeCard(card)
      .then(() => {
        setCards((cardData) => cardData.filter((c) => c._id !== card._id));
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleCardDeleteSubmit(card) {
    handleCardDelete(card);
  }

  React.useEffect(() => {
    api
      .getUserInfo()
      .then((userData) => {
        setCurrentUser(userData);
      })
      .catch((err) => console.log(err));
  }, []);

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleUpdateUser(userUpdate) {
    setIsLoading(true);
    api
      .setUserInfo(userUpdate)
      .then((newUserData) => {
        setCurrentUser(newUserData);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleUpdateAvatar(avatarUpdate) {
    setIsLoading(true);
    api
      .updateProfilePicture(avatarUpdate)
      .then((newAvatar) => {
        setCurrentUser(newAvatar);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  function handleDeleteConfirmClick(card) {
    setSelectedCardToDelete(card);
    setDeleteConfirmPopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleMenuClick() {
    setMobilePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setAddPlacePopupOpen(false);
    setDeleteConfirmPopupOpen(false);
    setSelectedCard(null);
    setInfoToolPopupOpen(false);
    setMobilePopupOpen(false);
  }

  React.useEffect(() => {
    const closeByEscape = (e) => {
      if (e.key === "Escape") {
        closeAllPopups();
      }
    };

    document.addEventListener("keydown", closeByEscape);

    return () => document.removeEventListener("keydown", closeByEscape);
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <div>
          <MobilePopup
            isOpen={isMobilePopupOpen}
            userEmail={userEmail}
            onLogout={onLogout}
          />
          <Header
            userEmail={isLoggedIn ? userEmail : ""}
            onLogout={onLogout}
            mobilePopup={handleMenuClick}
            menuOpen={isMobilePopupOpen}
            onClose={closeAllPopups}
          />
          <Switch>
            <ProtectedRoute exact path="/" loggedIn={isLoggedIn}>
              <Main
                onEditProfileClick={handleEditProfileClick}
                onAddPlaceClick={handleAddPlaceClick}
                onEditAvatarClick={handleEditAvatarClick}
                onCardDeleteClick={handleDeleteConfirmClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                cards={cards}
              />
            </ProtectedRoute>
            <Route path="/signup">
              <Register route="/signin" onRegister={onRegister} />
            </Route>
            <Route path="/signin">
              <Login route="/signup" onLogin={onLogin} />
            </Route>
            <Route>
              {isLoggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
            </Route>
          </Switch>
          <Footer />

          <InfoTooltip
            onClose={closeAllPopups}
            isOpen={isInfoToolPopupOpen}
            status={isInfoToolStatus}
          />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            buttonText={isLoading ? "Saving..." : "Save"}
          />

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            buttonText={isLoading ? "Saving..." : "Save"}
          />

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onCardAdd={handleCardAdd}
            buttonText={isLoading ? "Creating..." : "Create"}
          />

          <DeleteConfirmPopup
            title="Are you sure?"
            isOpen={isDeleteConfirmPopupOpen}
            onClose={closeAllPopups}
            onDeleteCardSubmit={handleCardDeleteSubmit}
            cardToDelete={selectedCardToDelete}
          ></DeleteConfirmPopup>

          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
