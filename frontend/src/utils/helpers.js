

/*

This file contains helper functions and components used in more than 1 page.

*/


import React from "react";
import Notifications from "../components/notifications.js";
// import { useAuth } from "../components/validateuser";
import api from "../api.js";


//whichYear, used in studyprogramdetail and generatestudyplan for determining year.
export const determineBaseYear = (mostRecentPlan) => {
  return mostRecentPlan ? mostRecentPlan.year : new Date().getFullYear();
};


export const handleBecomeInCharge = async (studyProgramId) => {
  await api.post(`studyprograms/becomeincharge/${studyProgramId}`)
    .then(response => {
      console.log(response)
    })
    .catch(error => {
      console.log(error)
    })

}
export const handleBecomeNotInCharge = async (studyProgramId) => {
  await api.delete(`studyprograms/becomenotincharge/${studyProgramId}`)
    .then(response => {
      console.log(response)
    })
    .catch(error => {
      console.log(error)
    })

}

// Used in studyprogramDetails.js(With Generate button) and used in generatestudyplan.js (without generate button)
// Header func for "info at the top" of the study program detail and generate studyplan pages.
export const StudyProgramHeader = ({ studyProgram, baseYear, setNotificationsRef }) => (
  <div className="d-flex justify-content-between align-items-start mb-4">
    <div className="d-flex flex-column gap-1">
      <h1 className="mb-0">Studieplaner for: {studyProgram.name}</h1>
      <Notifications
        programId={studyProgram.id}
        setNotificationsRef={setNotificationsRef}
      />
      <div className="d-flex flex-column text-muted mt-1">
        <span><strong>Grad type:</strong> {studyProgram.degree_type}</span>
        <span><strong>Institutt:</strong> {studyProgram.institute_name}</span>
        <span>
          <strong>Ansvarlig:</strong>{" "}
          {studyProgram.program_ansvarlig ? (
            studyProgram.program_ansvarlig.name
          ) : (
            <button onClick={() => handleBecomeInCharge(studyProgram.id, studyProgram)} className="btn btn-sm btn-outline-secondary ms-1">
              Bli Ansvarlig
            </button>
          )}
        </span>
      </div>
    </div>
  </div>
);

export const calculatedYear = (baseYear, semesterNumber, term) => {
  return parseInt(baseYear) + Math.floor((semesterNumber - 1) / 2) + (term === "V" ? 1 : 0);
};

// Used in studyprogramdetail.js for å lista opp tidligere studieplaner.
export const PreviousStudyPlans = ({ plans, latestPlanId, studyprogramId, onViewPlan, currentPlanId }) => (
  <div>
    <h5 className="fw-semibold">Tidligere studieplaner</h5>
    {plans.length > 0 ? (
      <div className="d-flex flex-column gap-2">
        {plans.slice(0, 8).map((plan) => (
          <button
            key={plan.id}
            className={`btn ${plan.id === currentPlanId ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => onViewPlan(plan.id)}
            disabled={plan.id === currentPlanId}>
            Year: {plan.year} {plan.id === latestPlanId ? "(Valgt)" : ""}
          </button>
        ))}
      </div>
    ) : (
      <p className="text-muted small">Ingen tidligere studieplaner funnet.</p>
    )}
  </div>
);

// used in valgemne.js, reuseable if needed.
// Displaying search bar and autocomplete dropdown for subjects.
export const SearchBar = ({ searchTerm, setSearchTerm, filteredCourses, onCourseSelect }) => (
  <div className="search-bar">
    <input
      type="text"
      placeholder="Search courses..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    {searchTerm && filteredCourses.length > 0 && (
      <ul className="autocomplete-dropdown">
        {filteredCourses.map((course) => (
          <li
            key={course.id}
            onClick={() => onCourseSelect(course)}
            className="autocomplete-item"
          >
            {course.name} ({course.courseCode})
          </li>
        ))}
      </ul>
    )}
  </div>
);

// SearchBar og filterSubjects blir brukt for valgemne (oldschool way), no drag/drop her. 
// Kan brukes plasser drag and drop kje går.


export const filterCourses = (courses, searchTerm) => {
  return courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );
};


//semesterpairs, studyprogramdetail
// Når man vil visa heila studieplanen i to og to semestre.
// 1-2, 3-4, 5-6 osv.
export const groupSemestersIntoPairs = (semesters) => {
  const pairs = [];
  for (let i = 0; i < semesters.length; i += 2) {
    pairs.push(semesters.slice(i, i + 2));
  }
  return pairs;
};


