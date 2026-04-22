import React, { useState, useEffect, useMemo } from "react";
import { SearchBar, filterCourses } from "../utils/helpers.js";
import { getElectiveGroups } from "../utils/categoryHelpers.js";

const ValgemneOverlay = ({
  isOpen,
  closeOverlay,
  semesterId,
  semesterNumber,
  valgemne,
  setValgemne,
  setFormattedValgemner,
  allCourses,
  readOnly = false,
}) => {
  const [categories, setCategories] = useState([]);
  const [currentValgemne, setCurrentValgemne] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen && !readOnly && categories.length === 0) {
      fetchCategories();
    }
  }, [isOpen, readOnly, categories]);


  useEffect(() => {
    if (isOpen && valgemne && valgemne[semesterNumber]) {
      setCurrentValgemne(valgemne[semesterNumber]);
      console.log("Current Valgemne:", valgemne[semesterNumber]);
      console.log("Valgemne for Semester in Overlay:", semesterNumber, valgemne[semesterNumber]);
    }
  }, [valgemne, semesterNumber, isOpen]);

  useEffect(() => {
    console.log("Overlay opened for semester:", semesterId);
  }, [semesterId, semesterNumber]);

  const fetchCategories = async () => {
    try {
      const categories = await getElectiveGroups();
      console.log("Fetched Categories:", categories);
      setCategories(categories || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategories([]);
    }
  };

  const filteredCourses = useMemo(
    () => filterCourses(allCourses, searchTerm),
    [searchTerm, allCourses]
  );



  // Legg te emne i kategori
  const addCourseToGroup = () => {
    if (!selectedCourse || !selectedGroup) {
      alert("Please select a course and a category.");
      return;
    }

    const courseToAdd = { ...selectedCourse, is_elective: true, category_id: selectedGroup };

    setCurrentValgemne((prev) => ({
      ...prev,
      [selectedGroup]: [
        ...(prev[selectedGroup] || []),
        courseToAdd,
      ],
    }));

    setSelectedCourse(null);
    //setSelectedGroup("");
    setSearchTerm("");
  };

  const resolveCategoryName = (categoryId, courses) => {
    const courseCategoryName = courses[0]?.category?.name;

    if (courseCategoryName) {
      return courseCategoryName;
    }

    const category = categories.find((cat) => cat.id === parseInt(categoryId, 10));
    return category?.name || `Unknown Category (${categoryId})`;
  };


  const removeCourseFromGroup = (categoryId, courseId) => {
    setCurrentValgemne((prev) => {
      const updatedCategory = prev[categoryId]?.filter(
        (course) => course.id !== courseId
      );

      // Hvis kategori ble tomt itte fjerning, fjern kategorien.
      if (!updatedCategory || updatedCategory.length === 0) {
        const { [categoryId]: _, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [categoryId]: updatedCategory,
      };
    });
  };

  const formatValgemne = (valgemne) => {
    const formatted = {};
    Object.entries(valgemne).forEach(([categoryId, courses]) => {
      formatted[categoryId] = courses.map((course) => ({
        course_id: course.id,
        is_elective: true,
        category_id: parseInt(categoryId),
      }));
    });
    console.log("Formatted valgemne:", formatted);
    return formatted;
  };

  const handleConfirmValgemner = () => {
    try {
      const formattedValgemner = formatValgemne(currentValgemne);

      setValgemne((prev) => ({
        ...prev,
        [semesterNumber]: currentValgemne,
      }));
      setFormattedValgemner((prev) => ({
        ...prev,
        [semesterNumber]: formattedValgemner,
      }));

      closeOverlay();
    } catch (error) {
      console.error("Error saving electives:", error);
      alert("Failed to save electives. Please try again.");
    }
  };


  if (!isOpen) return null;
  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
      <div className="bg-white rounded p-4" style={{ width: "600px", maxHeight: "80vh", overflowY: "auto" }}>
        <h5 className="fw-semibold mb-3">
          {readOnly ? "Vis valgemner" : "Administrer valgemner"} — Semester {semesterNumber}
        </h5>

        {!readOnly && (
          <>
            <label className="form-label fw-semibold">Velg kategori</label>
            {categories.length > 0 ? (
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="form-select mb-3"
              >
                <option value="" disabled>-- Velg en kategori --</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            ) : (
              <p className="text-muted">Ingen kategorier tilgjengelig.</p>
            )}
            {selectedGroup && (
              <div className="mb-3">
                <SearchBar
                  searchTerm={searchTerm}
                  setSearchTerm={(term) => { setSearchTerm(term); setSelectedCourse(null); }}
                  filteredCourses={filteredCourses}
                  onCourseSelect={(course) => { setSelectedCourse(course); setSearchTerm(`${course.name} (${course.courseCode})`); }}
                />
                <button
                  onClick={addCourseToGroup}
                  disabled={!selectedCourse}
                  className="btn btn-primary mt-2"
                >
                  Legg til i kategori
                </button>
              </div>
            )}
          </>
        )}

        {Object.keys(currentValgemne).length > 0 ? (
          Object.entries(currentValgemne).map(([categoryId, courses]) => {
            const categoryName = resolveCategoryName(categoryId, courses);
            const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
            return (
              <div key={categoryId} className="mb-3">
                <h6 className="fw-semibold">{categoryName}</h6>
                {courses.length > 0 ? (
                  <>
                    <ul className="list-group list-group-flush mb-2">
                      {courses.map((course) => (
                        <li
                          key={course.id}
                          className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2"
                        >
                          <div>
                            <div className="fw-semibold">{course.name}</div>
                            <div className="text-muted small">{course.courseCode} — {course.credits} sp</div>
                          </div>
                          {!readOnly && (
                            <button
                              onClick={() => removeCourseFromGroup(categoryId, course.id)}
                              className="btn btn-sm btn-outline-danger"
                            >
                              Fjern
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                    <p className="text-muted small text-end">Totalt: {totalCredits} sp</p>
                  </>
                ) : (
                  <p className="text-muted">Ingen emner i denne kategorien.</p>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-muted">Ingen valgemner lagt til for dette semesteret.</p>
        )}

        <div className="d-flex justify-content-end gap-2 mt-3">
          {!readOnly && (
            <button onClick={handleConfirmValgemner} className="btn btn-success">
              Lagre endringer
            </button>
          )}
          <button onClick={closeOverlay} className="btn btn-outline-secondary">
            Lukk
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValgemneOverlay;