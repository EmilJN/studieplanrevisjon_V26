import React, { useState, useEffect, Fragment } from "react";
//import "../styles/EditStudyprogram.css";
import {
  handleBecomeNotInCharge,
} from "../utils/helpers";
import {
  fetchAllInstitutes,
  searchStudyPrograms,
  fetchStudyPrograms,
} from "../utils/fetchHelpers";
import { useAuth } from "../components/validateuser";
import api from "../api";
import { useNavigate } from "react-router-dom";
import CreateStudyProgramForm from "../components/createstudyprogramform";

const EditStudyProgram = () => {
  const [studyPrograms, setStudyPrograms] = useState([]); // Fetched study programs
  const [searchTerm, setSearchTerm] = useState(""); // Current search term
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [editingID, setEditingId] = useState(null);
  const [editingProgram, setEditingProgram] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageSearch, setErrorMessageSearch] = useState("");
  const [institutes, setInstitutes] = useState({});
  const [errors, setErrors] = useState({});
  const { currentUser } = useAuth;
  const [filterOpen, setFilterOpen] = useState(false);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    degree_type: "",
    institute_id: "",
    semester_number: "",
    has_responsible: "",
  });

  // henta fra backend
  useEffect(() => {
    const fetchOnLoad = async () => {
      const inst = await fetchAllInstitutes();
      const progs = await fetchStudyPrograms();
      setInstitutes(inst);
      setStudyPrograms(progs);
    };
    fetchOnLoad();
  }, []);

  // søkebarinput
  const handleSearch = async (e) => {
    const value = e.target.value;
    if (editingID) {
      setErrorMessageSearch("Avrbyt eller lagre programmet som blir redigert");
    } else {
      setSearchTerm(value);
      if (value) {
        // Søke ette program hvis det blir søkt etter noe, ellers fetche alle programmene
        const progs = await searchStudyPrograms(value);
        setStudyPrograms(progs);
      } else {
        const progs = await fetchStudyPrograms();
        setStudyPrograms(progs);
      }
    }
  };
  const handleEditClick = (program) => {
    setEditingId(program.id);
    setEditingProgram({ ...program }); // Lagra eksisterende verdier
  };
  const handleCancel = () => {
    setEditingId(null);
    setErrorMessage("");
    setErrorMessageSearch("");
    setEditingProgram({});
    setErrors({});
  };

  const handleSave = (program) => {
    const err = validateForm();
    if (Object.keys(err).length === 0) {
      setErrors({});
      try {
        api
          .put(`/studyprograms/${editingID}/update`, editingProgram)
          .then(() => {
            setStudyPrograms((prev) =>
              prev.map((p) =>
                p.id === editingID
                  ? {
                      ...p,
                      ...editingProgram,
                      institute:
                        institutes.find(
                          (i) => i.id === Number(editingProgram.institute),
                        ) || p.institute,
                    }
                  : p,
              ),
            );
            setEditingId(null);
          })
          .catch((error) => {
            console.error("There was an error updating the program!", error);
          });
      } catch (error) {
        console.error("Failed to log in:", error);
      }
    } else {
      setErrors(err);
    }
  };

  const validateForm = () => {
    const formErrors = {};
    if (!editingProgram.name) formErrors.name = "Vennligst skriv noe her";

    if (!editingProgram.program_code)
      formErrors.program_code = "Vennligst skriv noe her";
    return formErrors;
  };

  // Håndtere endringer i input
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditingProgram((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredPrograms = studyPrograms.filter((p) => {
    if (filters.degree_type && p.degree_type !== filters.degree_type)
      return false;
    if (filters.institute_id && String(p.institute.id) !== filters.institute_id)
      return false;
    if (
      filters.semester_number &&
      String(p.semester_number) !== filters.semester_number
    )
      return false;
    if (filters.has_responsible === "yes" && !p.program_ansvarlig) return false;
    if (filters.has_responsible === "no" && p.program_ansvarlig) return false;
    return true;
  });

  const toggleMoreInfo = (id) => {
    if (editingID) {
      setErrorMessage("Avbryt eller lagre før du lukker fanen");
    } else if (selectedProgram === id) {
      setSelectedProgram(null);
      setErrorMessage("");
    } else {
      setErrorMessage("");
      setSelectedProgram(id);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: "900px" }}>
      <h1 className="mb-4">Oversikt over studieprogram</h1>
      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowCreateForm((prev) => !prev)}
      >
        {showCreateForm ? "Lukk skjema" : "Legg til nytt studieprogram"}
      </button>

      {showCreateForm && (
        <div className="border rounded p-4 mb-3">
          <h5 className="mb-3">Legg til nytt studieprogram</h5>
          <CreateStudyProgramForm onSuccess={() => setShowCreateForm(false)} />
        </div>
      )}

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Søk etter navn..."
        value={searchTerm}
        onChange={handleSearch}
      />
      {errorMessageSearch && (
        <div className="alert alert-warning">{errorMessageSearch}</div>
      )}

      <div className="border rounded mb-3">
        <button
          className="btn w-100 text-start d-flex justify-content-between align-items-center px-3 py-2"
          style={{
            backgroundColor: "var(--color-light-blue)",
            color: "var(--color-dark)",
          }}
          onClick={() => setFilterOpen((prev) => !prev)}
        >
          <span className="fw-semibold">Filter</span>
          <span>{filterOpen ? "▲" : "▼"}</span>
        </button>
        {filterOpen && (
          <div className="p-3 row g-3">
            <div className="col-md-3">
              <label className="form-label fw-semibold">Nivå</label>
              <select
                className="form-select"
                name="degree_type"
                value={filters.degree_type}
                onChange={handleFilterChange}
              >
                <option value="">Alle</option>
                <option value="Bachelor">Bachelor</option>
                <option value="Master">Master</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">Institutt</label>
              <select
                className="form-select"
                name="institute_id"
                value={filters.institute_id}
                onChange={handleFilterChange}
              >
                <option value="">Alle</option>
                {institutes &&
                  institutes.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">Antall semester</label>
              <select
                className="form-select"
                name="semester_number"
                value={filters.semester_number}
                onChange={handleFilterChange}
              >
                <option value="">Alle</option>
                {[...new Set(studyPrograms.map((p) => p.semester_number))]
                  .sort()
                  .map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">Ansvarlig</label>
              <select
                className="form-select"
                name="has_responsible"
                value={filters.has_responsible}
                onChange={handleFilterChange}
              >
                <option value="">Alle</option>
                <option value="yes">Har ansvarlig</option>
                <option value="no">Ingen ansvarlig</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th style={{ width: "40%" }}>Navn</th>
            <th style={{ width: "15%" }}>Nivå</th>
            <th style={{ width: "35%" }}>Institutt</th>
            <th style={{ width: "10%", textAlign: "center" }}>Handling</th>
          </tr>
        </thead>
        <tbody>
          {filteredPrograms.map((program) => (
            <Fragment key={program.id}>
              <tr
                onClick={() => toggleMoreInfo(program.id)}
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    selectedProgram === program.id
                      ? "var(--color-light-blue)"
                      : "",
                }}
              >
                <td>
                  <strong>{program.name}</strong>
                </td>
                <td>{program.degree_type}</td>
                <td>{program.institute.name}</td>
                <td className="text-center">
                  {selectedProgram === program.id ? "▲" : "▼"}
                </td>
              </tr>

              {selectedProgram === program.id && (
                <tr style={{ backgroundColor: "var(--color-gray)" }}>
                  {editingID === program.id ? (
                    <td colSpan="4" className="p-4">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Navn</label>
                          <input
                            className="form-control"
                            onChange={handleFieldChange}
                            name="name"
                            value={editingProgram.name}
                          />
                          {errors.name && (
                            <div className="text-danger small">
                              {errors.name}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Studieprogramkode
                          </label>
                          <input
                            className="form-control"
                            onChange={handleFieldChange}
                            value={editingProgram.program_code}
                            name="program_code"
                          />
                          {errors.program_code && (
                            <div className="text-danger small">
                              {errors.program_code}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Studienivå
                          </label>
                          <select
                            className="form-select"
                            onChange={handleFieldChange}
                            value={editingProgram.degree_type}
                            name="degree_type"
                          >
                            <option value="Bachelor">Bachelor</option>
                            <option value="Master">Master</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Institutt
                          </label>
                          <select
                            className="form-select"
                            name="institute"
                            value={editingProgram.institute.id}
                            onChange={handleFieldChange}
                          >
                            {institutes &&
                              institutes.map((inst) => (
                                <option key={inst.id} value={inst.id}>
                                  {inst.name}
                                </option>
                              ))}
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Antall Semester
                          </label>
                          <p>{program.semester_number}</p>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Program Aktivt?
                          </label>
                          <p>{program.is_active ? "Ja" : "Nei"}</p>
                        </div>
                      </div>
                      {errorMessage && (
                        <div className="alert alert-warning mt-3">
                          {errorMessage}
                        </div>
                      )}
                      <div className="d-flex gap-2 mt-3">
                        <button
                          className="btn btn-success"
                          onClick={() => handleSave(program)}
                        >
                          Lagre endringer
                        </button>
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => handleCancel()}
                        >
                          Avbryt
                        </button>
                      </div>
                    </td>
                  ) : (
                    <td colSpan="4" className="p-4">
                      <div className="row g-2">
                        <div className="col-md-4">
                          <span className="fw-semibold">
                            Studieprogramkode:
                          </span>{" "}
                          {program.program_code}
                        </div>
                        <div className="col-md-4">
                          <span className="fw-semibold">Antall Semester:</span>{" "}
                          {program.semester_number}
                        </div>
                        <div className="col-md-4">
                          <span className="fw-semibold">Program Aktivt:</span>{" "}
                          {program.is_active ? "Ja" : "Nei"}
                        </div>
                        <div className="col-md-6">
                          <span className="fw-semibold">Ansvarlig:</span>{" "}
                          {program.program_ansvarlig
                            ? program.program_ansvarlig_id === currentUser && (
                                <span>
                                  {program.program_ansvarlig.name}{" "}
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() =>
                                      handleBecomeNotInCharge(program.id)
                                    }
                                  >
                                    Ikke vær ansvarlig
                                  </button>
                                </span>
                              )
                            : "Ingen"}
                        </div>
                      </div>
                      <div className="mt-3">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handleEditClick(program)}
                        >
                          Rediger studieprogram
                        </button>
                        <button
                          className="btn btn-outline-primary"
                          onClick={() =>
                            navigate(`/studyprograms/${program.id}`)
                          }
                        >
                          Rediger studieplaner
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EditStudyProgram;
