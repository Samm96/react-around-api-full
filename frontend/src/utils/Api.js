class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  // used to get the server response
  _handleServerResponse(res) {
    return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
  }

  getAppInfo() {
    return Promise.all([this.getUserInfo(), this.getInitialCardList()]);
  }

  //used to request user info
  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    }).then(this._handleServerResponse);
  }

  //used to insert user info
  setUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name,
        about,
      }),
    }).then(this._handleServerResponse);
  }

  // used to insert profile pic
  updateProfilePicture({ avatar }) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar,
      }),
    }).then(this._handleServerResponse);
  }

  // used to get initial cards from server
  getInitialCardList() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    }).then(this._handleServerResponse);
  }

  // used to add cards to page
  addCard({ name, link }) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name,
        link,
      }),
    }).then(this._handleServerResponse);
  }

  // removes cards
  removeCard({ _id }) {
    return fetch(`${this._baseUrl}/cards/${_id}`, {
      method: "DELETE",
      headers: this._headers,
    }).then(this._handleServerResponse);
  }

  toggleLikeCardStatus(cardId, like) {
    return fetch(`${this._baseUrl}/cards/likes/${cardId}`, {
      method: like ? "PUT" : "DELETE",
      headers: this._headers,
    }).then(this._handleServerResponse);
  }
}

export const api = new Api({
  baseUrl: "https://around.nomoreparties.co/v1/group-12",
  headers: {
    authorization: "9b991f86-368d-4ef3-963c-b91580821c46",
    "Content-Type": "application/json",
  }
});

