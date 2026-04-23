import React from "react";
import { useState, useEffect } from "react";
import DroppableSemester from "./DroppableSemester.js";
import {
  addValgemneToSemester,
  removeValgemneFromSemester,
  removeCourses,
} from "../utils/courseHelpers.js";
import "../styles/dragdrop.css";

const SemesterDisplay = ({
  semesterId,
  courseToPackageMap,
  packageColorMap,
  handleAssignCoursePackage,
  setCourseToPackageMap,
  coursepackages,
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
  const regularCourses = displayCourses.filter(
    (course) => !course.is_elective || course.courseCode?.includes("VALGEMNE"),
  );
  const fetchedValgemneCourse =
    valgemneCourse ||
    allCourses.find((course) => course.courseCode?.includes("VALGEMNE"));

  useEffect(() => {
    const valgemnePresent = courses.some((course) =>
      course.courseCode?.includes("VALGEMNE"),
    );
    setHasValgemne(valgemnePresent);
  }, [courses]);

  const handleAddValgemne = () => {
    if (!fetchedValgemneCourse) {
      console.error("VALGEMNE course not found.");
      return;
    }
    const updatedSemesters = addValgemneToSemester(
      semesterNumber,
      semesters,
      fetchedValgemneCourse,
    );
    console.log("Updated semesters after adding valgemne:", updatedSemesters);
    setSemesters(updatedSemesters);
    setHasValgemne(true);
    onAdministrerValgemner();
  };

  const handleRemoveValgemne = () => {
    const updatedSemesters = removeValgemneFromSemester(
      semesterNumber,
      semesters,
    );
    setSemesters(updatedSemesters);

    setFormattedValgemner((prev) => {
      const { [semesterNumber]: _, ...rest } = prev;
      return rest;
    });

    setHasValgemne(false);
  };

  const handleRemoveCourse = (courseId) => {
    setTimeout(() => {
      const updatedSemesters = removeCourses(
        semesterNumber,
        semesters,
        courseId,
      );
      console.log("Updated semesters after removing course:", updatedSemesters);
      setSemesters(updatedSemesters);

      if (typeof setSearchTerm === "function") {
        setSearchTerm("");
      }
    }, 0);
  };
  const creditsPerPackage = {};

  regularCourses.forEach((course) => {
    const pkgId = courseToPackageMap?.[course.id] || "none";

    if (!creditsPerPackage[pkgId]) {
      creditsPerPackage[pkgId] = 0;
    }

    creditsPerPackage[pkgId] += course.credits || 0;
  });
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
              className="btn btn-sm btn-outline-secondary"
            >
              {hasValgemne ? "Administrer Valgemne" : "Legg til Valgemne"}
            </button>
          </div>
        )}
      </div>
      <DroppableSemester
        setCourseToPackageMap={setCourseToPackageMap}
        courseToPackageMap={courseToPackageMap}
        handleAssignCoursePackage={handleAssignCoursePackage}
        packageColorMap={packageColorMap}
        coursepackages={coursepackages}
        semesterNumber={semesterNumber}
        semesterId={semesterId}
        courses={regularCourses}
        onRemove={handleRemoveCourse}
        onRemoveValgemne={handleRemoveValgemne}
        onAdministrerValgemner={onAdministrerValgemner}
        readOnly={readOnly}
      />
      <div className="text-muted small mt-2">
        {/* Faste emner først */}
        {creditsPerPackage["none"] > 0 && (
          <div className="d-flex justify-content-between fw-semibold">
            <span>Faste emner</span>
            <span>{creditsPerPackage["none"]} sp</span>
          </div>
        )}

        {/* Pakkene */}
        {Object.entries(creditsPerPackage)
          .filter(([pkgId]) => pkgId !== "none")
          .map(([pkgId, credits]) => {
            const pkg = coursepackages.find((cp) => cp.id === pkgId);

            return (
              <div key={pkgId} className="d-flex justify-content-between">
                <span>{pkg?.name || "Ukjent pakke"}</span>
                <span>{credits} sp</span>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default SemesterDisplay;
