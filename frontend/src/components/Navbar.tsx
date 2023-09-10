import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const logout = async () => {
    sessionStorage.removeItem("email");
    navigate("/login");
  };
  const location = useLocation();
  return (
    <>
      <nav
        className="navbar navbar-expand-sm bg-body-tertiary"
        data-bs-theme="dark"
      >
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarsExample03"
            aria-controls="navbarsExample03"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarsExample03">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === "/" ? "active" : ""
                  }`}
                  style={{ fontSize: "20px" }}
                  aria-current="page"
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === "/about" ? "active" : ""
                  }`}
                  style={{ paddingLeft: "20px", fontSize: "20px" }}
                  aria-current="page"
                  to="/about"
                >
                  About
                </Link>
              </li>
            </ul>

            <button
              type="button"
              className="btn btn-link px-3 me-2"
              style={{ color: "white", fontSize: "20px" }}
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
