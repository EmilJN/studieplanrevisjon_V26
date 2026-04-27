import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import logo from "../assets/logo.jpg";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "./validateuser";

const NavBar = () => {
  const { isAuthenticated, logout, currentUser } = useAuth();

  return (
    <nav
      className="navbar navbar-expand navbar-dark px-4 mb-4"
      style={{ backgroundColor: "var(--color-dark)" }}
    >
      <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
        <img src={logo} alt="logo" height="40" />
        <span>Studieplanrevisjon</span>
      </Link>
      {isAuthenticated && (
        <>
          <div className="navbar-nav me-auto ms-3 gap-2">

            <NavLink className="btn btn-outline-light" to="/courses">
              Emner
            </NavLink>
            <NavLink className="btn btn-outline-light" to="/editstudyprogram">
              Studieprogram
            </NavLink>

            {currentUser.role === "admin" && (
              <NavLink className="btn btn-outline-danger" to="/admin">Admin</NavLink>
            )}
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="text-white-50 small">{currentUser.name}</span>
            <button className="btn btn-outline-light btn-sm" onClick={logout}>Logg ut</button>
          </div>
        </>
      )}
    </nav>
  );
};
export default NavBar;
