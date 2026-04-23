import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const Programoverview = ({ userId }) => {
  const [programs, setPrograms] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getPrograms = async () => {
      try {
        const response = await api.get(`/studyprograms/${userId}/programs`);
        setPrograms(response.data);
      } catch (error) {
        console.log(error);
        setMessage("Klarte ikke å hente studieprogrammer");
      }
    };

    getPrograms();
  }, [userId]);

  return (
    <div className="container mt-3">
      <h3 className="mb-3">Studieprogram du er ansvarlig for</h3>

      {message && <div className="alert alert-danger py-2">{message}</div>}

      <div className="list-group shadow-sm">
        {programs.map((program) => (
          <button
            key={program.id}
            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            onClick={() => navigate(`/studyprograms/${program.id}`)}
          >
            <div>
              <div className="fw-semibold">{program.name}</div>
              {program.code && (
                <small className="text-muted">{program.code}</small>
              )}
            </div>

            <span className="badge bg-primary rounded-pill">Gå til</span>
          </button>
        ))}
      </div>

      {programs.length === 0 && (
        <div className="text-muted mt-3">Ingen studieprogram funnet</div>
      )}
    </div>
  );
};

export default Programoverview;
