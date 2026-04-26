import React, { useEffect, useState } from "react";
import api from "../api";

const AdminProgramList = () => {
  const [studyPrograms, setStudyPrograms] = useState([]);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await api.get("/studyprograms/getAllStudyPrograms");
      setStudyPrograms(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteProgram = async (id) => {
    try {
      await api.delete("/studyprograms/" + id);

      // 🔥 Oppdater state lokalt (ingen ny API call nødvendig)
      setStudyPrograms((prev) => prev.filter((program) => program.id !== id));
    } catch (error) {
      console.log(error);
    }
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
            <th>Handlinger</th>
          </tr>
        </thead>
        <tbody>
          {studyPrograms.map((studyprogram) => (
            <tr key={studyprogram.id}>
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
                    ) {
                      handleDeleteProgram(studyprogram.id);
                    }
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
