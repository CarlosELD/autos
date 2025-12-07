import React from "react";
import { Button } from "react-bootstrap";
import AccessibilityDropdown from "./AccessibilityDropdown";

export default function NavbarPrincipal({ onLoginClick, goToContacto }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-react">
      <div className="container">
        <a className="navbar-brand fw-bold">
          <i className="bi bi-car-front-fill me-2"></i>Motors 70's
        </a>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link active" href="#catalogo">Inicio</a>
            </li>
            {goToContacto && (
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-white"
                  onClick={goToContacto}
                  style={{
                    background: 'none',
                    border: 'none',
                    textDecoration: 'none'
                  }}
                >
                  Contacto
                </button>
              </li>

            )}
            <div className="dropdown me-2" data-bs-auto-close="outside">
              <button
                className="btn btn-outline-light dropdown-toggle"
                type="button"
                id="accessDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-universal-access-circle me-1"></i> Accesibilidad
              </button>

              <div className="dropdown-menu dropdown-menu-end p-2" aria-labelledby="accessDropdown">
                <AccessibilityDropdown />
              </div>
            </div>
          </ul>
        </div>

        <div className="ms-auto d-flex">
          <Button
            className="btn-login-navbar"
            onClick={onLoginClick}
            style={{ minWidth: '100px' }}
          >
            <i className="bi bi-box-arrow-in-right me-2"></i>
            Login
          </Button>
        </div>
      </div>
    </nav>
  );
}