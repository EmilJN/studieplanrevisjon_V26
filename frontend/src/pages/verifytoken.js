import React, { useState, useEffect } from "react";
import { Form, Link, useParams } from "react-router-dom";
import api from "../api";



const VerifyToken = () => {
    const [isVerified, setIsVerified] = useState(false)
    const { token } = useParams()
    useEffect(() => {
        api.post(`/user/verify/${token}`)
            .then(response => {
                window.location.href = '/'
            })
            .catch(error => {
                console.error("Error verifying", error);
                setIsVerified(false)
            });
    }, [token]);
    return (
        <div>
            {isVerified ? <p>Du er nå verifisert</p> : <p>Feil ved verifisering</p>}
        </div>
    )
};

export default VerifyToken;