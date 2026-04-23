import React, { useState, useEffect, useMemo } from "react";
import api from "../api.js";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/dragdrop.css";
import ValgemneOverlay from "../components/valgemne.js";
import {
  StudyProgramHeader,
  determineBaseYear,
  groupSemestersIntoPairs,
  calculatedYear
} from "../utils/helpers.js";
import { useStudyPlanData } from "../hooks/studyplanData.js";
import SemesterDisplay from "../components/semesterDisplay.js";
import { DragDropContext } from "@hello-pangea/dnd";
import SearchCourses from "../components/searchCourses.js";
import ConflictSummary from '../components/conflictsummary.js';
import { handleDragEnd } from '../components/handledragdrop.js';
import { generateStudyPlanPayload } from "../utils/payloadHelpers.js";
import { useCourses } from "../utils/CoursesContext.js";

const GenerateStudyplan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlaySemesterNumber, setOverlaySemesterNumber] = useState(null);
  const { courses } = useCourses();
  const [confirmedConflicts, setConfirmedConflicts] = useState([]);
  const [showConflictSummary, setShowConflictSummary] = useState(false);
  const [formattedValgemner, setFormattedValgemner] = useState({});
  const [fetchedNotifications, setFetchedNotifications] = useState([]);

  const {
    loading,
    error,
    studyProgram,
    semesters,
    setSemesters,
    valgemne,
    setValgemne,
    studyplanId,
    isEditMode,
    latestStudyPlan,
    valgemneCourse,
  } = useStudyPlanData(id);



  const baseYear = useMemo(() => determineBaseYear(latestStudyPlan), [latestStudyPlan]);
  const newYear = useMemo(() => baseYear + 1, [baseYear]);
  const semesterPairs = groupSemestersIntoPairs(Array.isArray(semesters) ? semesters : Object.values(semesters));


  useEffect(() => {
    if (latestStudyPlan && latestStudyPlan.semesters) {
      setSemesters(latestStudyPlan.semesters);
    }
  }, [latestStudyPlan, setSemesters]);

  useEffect(() => {
    console.log("Updated valgemne in parent:", valgemne);
  }, [valgemne]);


  const handleVisValgemner = (semesterId, semesterNumber) => {
    console.log("Opening ValgemneOverlayGENERATE for:", { semesterId, semesterNumber });
    setOverlaySemesterNumber(semesterNumber);
    setShowOverlay(true);
  };


  const handleSaveNewPlan = async () => {
    if (!id || !newYear) {
      alert("Missing required information for creating study plan.");
      return;
    }

    try {

      if (confirmedConflicts.length > 0 && !showConflictSummary) {
        setShowConflictSummary(true);
        return;
      }



      const semesterCoursesData = generateStudyPlanPayload(semesters, formattedValgemner);
      console.log("Generated semester courses data:", semesterCoursesData);
      const payload = {
        year: newYear,
        studyprogram_id: studyProgram.id,
        semester_courses: semesterCoursesData,
      };
      console.log("Payload for GEnerARTE study plan:", payload);
      const response = await api.post(`/studyplans/create/sp`, payload)
      console.log("Response from createStudyPlan:", response.data);
      alert("New study plan created successfully!");
      navigate(`/studyprograms/${id}`);
    } catch (error) {
      console.error("Error in study plan creation process:", error);
      alert(error.message || "Failed to create study plan.");
    }
  };

  if (loading) return <p>Loading study plan data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!studyProgram) return <p>No study program found.</p>;

  return (
    <DragDropContext
      onDragEnd={(result) =>
        handleDragEnd({
          result,
          semesters,
          setSemesters,
          setConfirmedConflicts,
          setShowConflictSummary,
          studyplanId,
          searchResults,
          setSearchResults,
          selectedProgram: studyProgram,

        })
      }
    >
      <div className="container py-4">
        <StudyProgramHeader
          studyProgram={studyProgram}
          baseYear={newYear}
          setNotificationsRef={setFetchedNotifications}
        />

        <ConflictSummary
          termConflicts={confirmedConflicts}
          isOpen={showConflictSummary}
          onClose={() => setShowConflictSummary(false)}
          onConfirm={() => {
            setShowConflictSummary(false);
            handleSaveNewPlan();

          }}
          onCancel={() => setShowConflictSummary(false)}
          sourceProgram={studyProgram}
          fetchedNotifications={fetchedNotifications}
        />

        {/* Action buttons */}
        <div className="d-flex gap-2 mb-4 justify-content-end">
          <button onClick={() => navigate(`/studyprograms/${id}`)} className="btn btn-outline-danger">
            Avbryt
          </button>
          <button onClick={handleSaveNewPlan} className="btn btn-outline-success">
            Lagre ny studieplan
          </button>
        </div>

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

        <h5 className="fw-semibold mb-3">Semester Oversikt</h5>
        <div className="d-flex flex-column gap-3">
          {semesterPairs.map((pair, pairIndex) => (
            <div key={pairIndex} className="row g-3">
              {pair.map(semester => (
                <div key={`semester-${semester.semester_number}`} className="col-md-6">
                  <SemesterDisplay
                    semesterId={semester.id}
                    semesterNumber={semester.semester_number}
                    courses={semester.semester_courses}
                    year={calculatedYear(newYear, semester.semester_number, semester.term)}
                    term={semester.term}
                    onAdministrerValgemner={() => handleVisValgemner(semester.id, semester.semester_number)}
                    readOnly={isEditMode}
                    semesters={semesters}
                    setSemesters={setSemesters}
                    setFormattedValgemner={setFormattedValgemner}
                    valgemneCourse={valgemneCourse}
                    setSearchTerm={setSearchTerm}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        <ValgemneOverlay
          isOpen={showOverlay}
          closeOverlay={() => setShowOverlay(false)}
          semester={overlaySemesterNumber}
          semesterNumber={overlaySemesterNumber}
          valgemne={valgemne}
          setValgemne={setValgemne}
          setFormattedValgemner={setFormattedValgemner}
          allCourses={courses}
          readOnly={false}
        />
      </div>
    </DragDropContext>
  );
};

export default GenerateStudyplan;