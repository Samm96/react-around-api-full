function MobilePopup({ isOpen, route, userEmail, onLogout }) {
  return (
      <div className={`popup-mobile ${isOpen ? "popup-mobile_open" : ""}`}>
        <div className="popup-mobile__container">
          <p className="popup-mobile__email">{userEmail}</p>
          <button
            onClick={onLogout}
            className="popup-mobile__logout"
            href={route}
          >
            Log out
          </button>
        </div>
        <hr className="popup-mobile__line" />
      </div>
  );
}

export default MobilePopup;
