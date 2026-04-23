// src/pages/createsp.js
import React, { useState, useEffect } from "react";
import api from "../api.js";
import { useNavigate, useLocation } from "react-router-dom";
import { DragDropContext } from "@hello-pangea/dnd";
import "../styles/dragdrop.css";
import ValgemneOverlay from "../components/valgemne.js";
import Notifications from "../components/notifications.js";
import SemesterDisplay from "../components/semesterDisplay.js";
import SearchCourses from "../components/searchCourses.js";
import ConflictSummary from "../components/conflictsummary.js";
import { handleDragEnd } from "../components/handledragdrop.js";
import { groupSemestersIntoPairs } from "../utils/helpers.js";
import {
  checkStudyplan,
  semesterinfo,
  fetchSemesterInfo,
} from "../utils/fetchHelpers.js";
import { createNewStudyplanPayload } from "../utils/payloadHelpers.js";
import { useCourses } from "../utils/CoursesContext.js";
import { useStudyPrograms } from "../utils/programContext.js";

const CreateSP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefilledProgram = location.state?.program || null;
  const [programSearchQuery, setProgramSearchQuery] = useState(
    prefilledProgram?.name || "",
  );
  const [selectedProgram, setSelectedProgram] = useState(
    prefilledProgram || null,
  );
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [isInitialized, setIsInitialized] = useState(false);
  const [studyplanId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { courses } = useCourses();
  const { programs } = useStudyPrograms();
  const [searchResults, setSearchResults] = useState([]);
  const [semesters, setSemesters] = useState({});
  const [valgemneOverlayOpen, setValgemneOverlayOpen] = useState(false);
  const [selectedSemesterNumber, setSelectedSemesterNumber] = useState(null);
  const [valgemne, setValgemne] = useState({});
  const [formattedValgemner, setFormattedValgemner] = useState({});
  const [confirmedConflicts, setConfirmedConflicts] = useState([]);
  const [showConflictSummary, setShowConflictSummary] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (prefilledProgram) {
      setSelectedProgram(prefilledProgram);
      setProgramSearchQuery(prefilledProgram.name);
    }
  }, [prefilledProgram]);

  const handleProgramSearch = (query) => {
    setProgramSearchQuery(query);

    if (!query.trim()) {
      setFilteredPrograms([]);
    } else {
      const filtered = programs.filter(
        (program) =>
          program.name.toLowerCase().includes(query.toLowerCase()) ||
          program.degree_type.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredPrograms(filtered);
    }
  };

  // Select a study program
  const selectProgram = (program) => {
    setSelectedProgram(program);
    setProgramSearchQuery(program.name);
    setFilteredPrograms([]);
    setErrorMessage("");
  };

  const handleAdministrerValgemner = (semesterId, semesterNumber) => {
    setValgemne((prev) => ({
      ...prev,
      [semesterNumber]: prev[semesterNumber] || {},
    }));
    setSelectedSemesterNumber(semesterNumber);
    setValgemneOverlayOpen(true);
  };

  const initializeStudyplan = async () => {
    if (!selectedProgram) {
      setErrorMessage("Please select a study program first.");
      return;
    }

    if (!year || year < 2000) {
      setErrorMessage("Please enter a valid year (2000 or later).");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);
    console.log("Initializing study plan for:", selectedProgram, year);

    try {
      const checkResponse = await checkStudyplan(selectedProgram.id, year);
      if (checkResponse.exists) {
        setErrorMessage(
          `A study plan for ${selectedProgram.name} (${year}) already exists.`,
        );
        return;
      }
      const newSemesters = await semesterinfo(selectedProgram.id, year);
      setSemesters(newSemesters);
      setIsInitialized(true);
      setSuccessMessage(
        `Initialized study plan for ${selectedProgram.name} (${year})`,
      );
    } catch (error) {
      console.error("Error initializing study plan:", error);
      setErrorMessage(
        error.response?.data?.error ||
        "Failed to initialize study plan. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const saveStudyplan = async () => {
    if (!selectedProgram || !year || !isInitialized || semesters.length === 0) {
      setErrorMessage("Please initialize the study plan first.");
      return;
    }

    if (confirmedConflicts.length > 0 && !showConflictSummary) {
      setShowConflictSummary(true);
      return;
    }
    setIsLoading(true);
    setErrorMessage("");

    try {
      const structureResponse = await fetchSemesterInfo(selectedProgram.id);
      const semesterinfoData = structureResponse.data;
      const semesterCoursesData = createNewStudyplanPayload(
        semesters,
        formattedValgemner,
        semesterinfoData,
      );

      const payload = {
        year: parseInt(year),
        studyprogram_id: selectedProgram.id,
        semester_courses: semesterCoursesData,
      };
      console.log("CREATESP Payload for study plan creation:", payload);
      const response = await api.post("/studyplans/create/sp", payload);
      console.log("CREATESP Sending semester data:", semesterCoursesData);
      console.log("CreateSP study plan response:", response.data);
      setSuccessMessage("Study plan saved successfully!");
      setTimeout(() => {
        navigate(`/studyprograms/${selectedProgram.id}`);
      }, 2000);
    } catch (error) {
      console.error("Error saving study plan:", error);
      setErrorMessage(
        error.response?.data?.error ||
        "Failed to save study plan. Please try again.",
      );
    } finally {
      setIsLoading(false);
      setShowConflictSummary(false);
    }
  };

  const semesterPairs = groupSemestersIntoPairs(
    Array.isArray(semesters) ? semesters : Object.values(semesters),
  );

  return (
    <DragDropContext
      onDragEnd={(result) =>
        handleDragEnd({
          result,
          semesters,
          setSemesters,
          setErrorMessage,
          setSuccessMessage,
          setConfirmedConflicts,
          setShowConflictSummary,
          studyplanId,
          searchResults,
          setSearchResults,
          selectedProgram,
        })
      }
    >
      <div className="container py-4">
        <h1 className="mb-4">Lag ny studieplan</h1>
        {selectedProgram && (
          <div className="mb-3">
            <Notifications programId={selectedProgram.id} />
          </div>
        )}
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}

        <div className="border rounded p-4 mb-4">
          <h5 className="fw-semibold mb-3">Lag studieplan</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Studieprogram</label>
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control"
                  value={programSearchQuery}
                  onChange={(e) => handleProgramSearch(e.target.value)}
                  placeholder="Søk etter studieprogram..."
                  disabled={isInitialized || isLoading}
                />

                {/* Show search results */}
                {filteredPrograms.length > 0 && (
                  <ul className="list-group position-absolute w-100" style={{ zIndex: 1100 }}>
                    {filteredPrograms.map((program) => (
                      <li
                        key={program.id}
                        onClick={() => selectProgram(program)}
                        className="list-group-item list-group-item-action"
                        style={{ cursor: "pointer" }}
                      >
                        <div className="fw-semibold">{program.name}</div>
                        <div className="text-muted small">{program.degree_type}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Display selected program */}
              {selectedProgram && (
                <div className="selected-program">
                  <div className="mt-2 text-muted small">
                    <strong>Valgt:</strong> {selectedProgram.name} (
                    {selectedProgram.degree_type})
                  </div>
                </div>
              )}
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">År</label>
              <input
                type="number"
                className="form-control"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="2000"
                disabled={isInitialized || isLoading}
              />
            </div>

            <div className="col-md-3 d-flex align-items-center">
              <button
                onClick={initializeStudyplan}
                disabled={!selectedProgram || isInitialized || isLoading}
                className="btn btn-outline-primary w-100"
              >
                {isLoading ? "Laster..." : "Initialiser studieplan"}
              </button>
            </div>
          </div>
        </div>

        <ConflictSummary
          termConflicts={confirmedConflicts}
          isOpen={showConflictSummary}
          onClose={() => setShowConflictSummary(false)}
          onConfirm={() => {
            setShowConflictSummary(false);
            saveStudyplan();
          }}
          onCancel={() => setShowConflictSummary(false)}
          sourceProgram={selectedProgram}
        />

        {isInitialized && (
          <>
            <div className="row justify-content-center mb-3">
              <div className="col-md-8">
                <SearchCourses
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  maxResults={10}
                  onResultsChange={setSearchResults}
                  allCourses={courses}
                  semesters={semesters}
                />
              </div>
            </div>

            <h5 className="fw-semibold mb-3">Semesteroversikt</h5>
            <div className="d-flex flex-column gap-3">
              {semesterPairs.map((pair, pairIndex) => (
                <div key={pairIndex} className="row g-3">
                  {pair.map((semester) => (
                    <div
                      key={`semester-${semester.semester_number}`}
                      className="col-md-6"
                    >
                      <SemesterDisplay
                        semesterId={semester.id}
                        semesterNumber={semester.semester_number}
                        courses={semester.semester_courses}
                        year={semester.year}
                        term={semester.term}
                        onAdministrerValgemner={() =>
                          handleAdministrerValgemner(
                            semester.id,
                            semester.semester_number,
                          )
                        }
                        readOnly={false}
                        allCourses={courses}
                        semesters={semesters}
                        setFormattedValgemner={setFormattedValgemner}
                        setSemesters={setSemesters}
                        setSearchTerm={setSearchTerm}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-end mt-4">
              <button
                onClick={saveStudyplan}
                disabled={isLoading}
                className="btn btn-outline-success"
              >
                {isLoading ? "Lagrer..." : "Lagre studieplan"}
              </button>
            </div>

            {/* ValgemneOverlay */}
            <ValgemneOverlay
              isOpen={valgemneOverlayOpen}
              closeOverlay={() => setValgemneOverlayOpen(false)}
              semester={selectedSemesterNumber}
              semesterNumber={selectedSemesterNumber}
              valgemne={valgemne}
              setValgemne={setValgemne}
              setFormattedValgemner={setFormattedValgemner}
              allCourses={courses}
              readOnly={false}
            />
          </>
        )}
      </div>
    </DragDropContext >
  );
};

export default CreateSP;
