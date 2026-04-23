import React from "react";

const Login = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "var(--color-gray)" }}
    >
      <div
        className="card shadow p-5 text-center"
        style={{
          maxWidth: "420px",
          width: "100%",
          backgroundColor: "var(--color-white)",
        }}
      >
        <img
          src="../uis_logo.jpg"
          alt="UiS logo"
          className="mx-auto mb-4"
          style={{ maxWidth: "100px" }}
        />
        <h2 className="mb-2" style={{ color: "var(--color-dark)" }}>
          Studieplanrevisjon
        </h2>
        <p className="text-muted mb-4">Logg inn for å fortsette</p>
        <a
          href={`${process.env.REACT_APP_BACKEND_URL}/user/login`}
          className="btn btn-outline-secondary w-100"
        >
          Logg inn med FEIDE
        </a>
      </div>
    </div>
  );
};

export default Login;
