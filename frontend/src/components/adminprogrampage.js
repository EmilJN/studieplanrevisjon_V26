import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "./validateuser";

const AdminProgramList = () => {
  const [studyPrograms, setStudyPrograms] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      await api
        .get("/studyprograms/getAllStudyPrograms")
        .then((response) => {
          setStudyPrograms(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getUsers();
  }, []);

  const handleDeleteProgram = (e) => {
    api
      .delete("/studyprograms/" + e)
      .then((response) => console.log(response))
      .catch((response) => console.log(response));
  };

  return (
    <div>
      <h2 className="mb-4">Liste over studieprogrammene</h2>
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Id</th>
            <th>Navn</th>
            <th>Ansvarlig</th>
            <th>Handlnger</th>
          </tr>
        </thead>
        <tbody>
          {studyPrograms.map((studyprogram) => (
            <tr>
              <td>{studyprogram.id}</td>
              <td>{studyprogram.name}</td>
              <td>
                {studyprogram.program_ansvarlig
                  ? studyprogram.program_ansvarlig.name
                  : "ingen"}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Er du sikker på at du vil slette ${studyprogram.name}?`,
                      )
                    )
                      handleDeleteProgram(studyprogram.id);
                  }}
                >
                  Slett studieprogram
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default AdminProgramList;
