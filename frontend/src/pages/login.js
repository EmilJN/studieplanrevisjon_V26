import React from "react";
import "../styles/Forms.css";



const Login = () => {
    return (
        <div className="form-container" >
            <h2>Velkommen til studieplanrevisjon</h2>
            <a href="http://127.0.0.1:5000/backend/user/login">
                <button>Logg inn med FEIDE</button>
            </a>
        </div>
    )
};

export default Login;