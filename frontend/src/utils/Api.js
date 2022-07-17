class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  // used to get the server response
  _handleServerResponse(res) {
    return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
  }

  getAppInfo(token) {
    return Promise.all([
      this.getUserInfo(token),
      this.getInitialCardList(token),
    ]);
  }

  //used to request user info
  getUserInfo(token) {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: {
        authorization: `Bearer ${token}`,
        ...this._headers,
      },
    }).then(this._handleServerResponse);
  }

  //used to insert user info
  setUserInfo({ name, about }, token) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${token}`,
        ...this._headers,
      },
      body: JSON.stringify({
        name,
        about,
      }),
    }).then(this._handleServerResponse);
  }

  // used to insert profile pic
  updateProfilePicture({ avatar }, token) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${token}`,
        ...this._headers,
      },
      body: JSON.stringify({
        avatar,
      }),
    }).then(this._handleServerResponse);
  }

  // used to get initial cards from server
  getInitialCardList(token) {
    return fetch(`${this._baseUrl}/cards`, {
      headers: {
        authorization: `Bearer ${token}`,
        ...this._headers,
      },
    }).then(this._handleServerResponse);
  }

  // used to add cards to page
  addCard({ name, link }, token) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        ...this._headers,
      },
      body: JSON.stringify({
        name,
        link,
      }),
    }).then(this._handleServerResponse);
  }

  // removes cards
  removeCard({ _id }, token) {
    return fetch(`${this._baseUrl}/cards/${_id}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
        ...this._headers,
      },
    }).then(this._handleServerResponse);
  }

  toggleLikeCardStatus(cardId, like, token) {
    return fetch(`${this._baseUrl}/cards/likes/${cardId}`, {
      method: like ? "PUT" : "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
        ...this._headers,
      },
    }).then(this._handleServerResponse);
  }
}

export const api = new Api({
  baseUrl:
    process.env.NODE_ENV === "production"
      ? "https://api.samantha-horsch-around-us.students.nomoredomainssbs.ru"
      : "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});