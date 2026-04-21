import React from 'react';
import { useState, useEffect } from 'react';
import DroppableSemester from './DroppableSemester.js';
import { addValgemneToSemester, removeValgemneFromSemester, removeCourses } from '../utils/courseHelpers.js';
import '../styles/dragdrop.css';

const SemesterDisplay = ({
  semesterId,
  semesterNumber,
  courses,
  year,
  term,
  onAdministrerValgemner,
  readOnly = false,
  allCourses,
  semesters,
  setSemesters,
  setFormattedValgemner,
  valgemneCourse,
  setSearchTerm,
}) => {

  const [hasValgemne, setHasValgemne] = useState(false);
  const semesterTitle = `Semester ${semesterNumber}: ${year}-${term}`;
  const displayCourses = courses || [];
  const regularCourses = displayCourses.filter((course) => !course.is_elective || course.courseCode?.includes("VALGEMNE"));
  const fetchedValgemneCourse = valgemneCourse || allCourses.find((course) => course.courseCode?.includes("VALGEMNE"));


  useEffect(() => {
    const valgemnePresent = courses.some((course) => course.courseCode?.includes("VALGEMNE"));
    setHasValgemne(valgemnePresent);
  }, [courses]);


  const handleAddValgemne = () => {
    if (!fetchedValgemneCourse) {
      console.error("VALGEMNE course not found.");
      return;
    }
    const updatedSemesters = addValgemneToSemester(semesterNumber, semesters, fetchedValgemneCourse);
    console.log("Updated semesters after adding valgemne:", updatedSemesters);
    setSemesters(updatedSemesters);
    setHasValgemne(true);
    onAdministrerValgemner();
  }

  const handleRemoveValgemne = () => {
    const updatedSemesters = removeValgemneFromSemester(semesterNumber, semesters);
    setSemesters(updatedSemesters);

    setFormattedValgemner((prev) => {
      const { [semesterNumber]: _, ...rest } = prev;
      return rest;
    });

    setHasValgemne(false);
  }

  const handleRemoveCourse = (courseId) => {
    setTimeout(() => {
      const updatedSemesters = removeCourses(semesterNumber, semesters, courseId);
      console.log("Updated semesters after removing course:", updatedSemesters);
      setSemesters(updatedSemesters);


      if (typeof setSearchTerm === 'function') {
        setSearchTerm("");
      }
    }, 0);
  };


  return (
    <div className="border rounded p-3 mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="mb-0 fw-semibold">{semesterTitle}</h6>
        {!readOnly && (
          <div className="d-flex gap-2">
            <button
              onClick={() => {
                if (hasValgemne) {
                  onAdministrerValgemner(); // ← manage existing valgemne
                } else {
                  handleAddValgemne(); // ← add + open overlay
                }
              }}
              className="btn btn-sm btn-secondary"
            >
              {hasValgemne ? 'Administrer Valgemne' : 'Legg til Valgemne'}
            </button>
            {hasValgemne && (
              <button onClick={handleRemoveValgemne} className="btn btn-sm btn-outline-danger">
                Fjern Valgemne
              </button>
            )}
          </div>
        )}
      </div>
      <DroppableSemester
        semesterNumber={semesterNumber}
        semesterId={semesterId}
        courses={regularCourses}
        onRemove={handleRemoveCourse}
        onAdministrerValgemner={onAdministrerValgemner}
        readOnly={readOnly}
      />
      <div className="text-muted small mt-2 text-end">
        Antall studiepoeng: {regularCourses.reduce((sum, course) => sum + (course.credits || 0), 0)}
      </div>
    </div>
  );
};

export default SemesterDisplay;