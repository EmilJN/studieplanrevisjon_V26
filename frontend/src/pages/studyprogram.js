import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStudyPrograms } from "../utils/programContext";

const StudyProgram = () => {
  const [programSearchQuery, setProgramSearchQuery] = useState("");
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const { programs } = useStudyPrograms();
  const navigate = useNavigate();


  const handleProgramSearch = (query) => {
    setProgramSearchQuery(query);

    if (!query.trim()) {
      setFilteredPrograms(programs);
    } else {
      const filtered = programs.filter((program) =>
        program.name.toLowerCase().includes(query.toLowerCase()) ||
        program.degree_type.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPrograms(filtered);
    }
  };
  useEffect(() => {
    setFilteredPrograms(programs);
  }, [programs]);


  return (
    <div className="container py-4">
      <h1 className="mb-4">Studieplaner</h1>

      {/* Search Bar */}
      <div>
        <input
          id="programSearch"
          name="programSearch"
          type="text"
          placeholder="Søk etter studieprogram..."
          value={programSearchQuery}
          onChange={(e) => handleProgramSearch(e.target.value)}
        />
      </div>

      {/* Study Program List */}
      <div>
        {filteredPrograms.length > 0 ? (
          <table className="table table-bordered table-hover">
            <thead
              style={{
                backgroundColor: "var(--color-dark)",
                color: "var(--color-white)",
              }}
            >
              <tr>
                <th>Navn</th>
                <th>Nivå</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrograms.map((program) => (
                <tr
                  key={program.id}
                  onClick={() => navigate(`/studyprograms/${program.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{program.name}</td>
                  <td>{program.degree_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Ingen studieprogram funnet.</p>
        )}
      </div>
    </div>
  );
};

export default StudyProgram;
