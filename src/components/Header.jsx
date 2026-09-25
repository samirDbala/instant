import { Link } from "react-router-dom";
import logo from "../assets/instant-logo.svg";

function Header() {
  return (
    <header className="site-header">
      <Link
        to="/"
        className="site-logo"
        onClick={() => {
          localStorage.clear();
          sessionStorage.clear();
        }}
      >
        <img src={logo} alt="instant" />
      </Link>

      <Link to="/gallery" className="gallery-link">
        GALLERY
      </Link>
    </header>
  );
}

export default Header;
