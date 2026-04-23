import React, { useMemo, useEffect, useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import DraggableCourse from "./DraggableCourse";
import "../styles/dragdrop.css";

const SearchBar = ({ searchTerm, setSearchTerm }) => (
  <div className="mb-3">
    <input
      id="search-input"
      type="text"
      className="form-control form-control-lg shadow-sm"
      placeholder="Søk etter emner..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>
);

const SearchCourses = ({
  searchTerm,
  setSearchTerm,
  maxResults = 10,
  allCourses,
  semesters,
  onResultsChange = () => {},
}) => {
  const [isDragging] = useState(false);
  const [showInactive, setShowInactive] = useState(false);

  const filteredCourses = useMemo(() => {
    if (searchTerm.length < 2) return [];

    const isInSemester = (courseId) =>
      Object.values(semesters).some((semester) =>
        (semester.semester_courses || []).some((c) => c.id === courseId),
      );

    const results = allCourses.filter((course) => {
      const matchesSearch =
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseCode.toLowerCase().includes(searchTerm.toLowerCase());

      const notInSemester = !isInSemester(course.id);
      const isAllowed = showInactive || course.is_current !== false;

      return matchesSearch && notInSemester && isAllowed;
    });

    return results.slice(0, maxResults);
  }, [searchTerm, allCourses, semesters, maxResults, showInactive]);

  useEffect(() => {
    onResultsChange(filteredCourses);
  }, [filteredCourses, onResultsChange]);

  return (
    <div className="search-courses-container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4 className="fw-semibold m-0">Søk etter emner</h4>

        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="toggleInactive"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="toggleInactive">
            Vis eldre versjoner
          </label>
        </div>
      </div>

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Results */}
      <div
        className={`card shadow-sm border-0 ${isDragging ? "dragging" : ""}`}
      >
        <div className="card-body p-2">
          <div className="d-flex justify-content-between align-items-center mb-2 px-2">
            <small className="text-muted">
              {filteredCourses.length} resultater
            </small>
          </div>

          <Droppable
            droppableId="search-results"
            isDropDisabled={true}
            direction="vertical"
          >
            {(provided) => (
              <div
                className="search-results-list"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {filteredCourses.map((course, index) => {
                  const displayName =
                    showInactive && course.is_current === false
                      ? `${course.name} (v.${course.version ?? "?"})`
                      : course.name;

                  return (
                    <DraggableCourse
                      key={course.id}
                      course={{ ...course, name: displayName }}
                      index={index}
                      readOnly={false}
                    />
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center mt-3 text-muted">
          <i className="bi bi-search me-2"></i>
          Ingen emner funnet
        </div>
      )}
    </div>
  );
};

export default SearchCourses;
