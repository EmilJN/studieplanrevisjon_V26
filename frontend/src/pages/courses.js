import React, { useState, useEffect, useCallback, use } from "react";
import { Link } from "react-router-dom";
import { useCourses } from "../utils/CoursesContext";

const Courses = () => {
  const { courses } = useCourses();
  const [filteredCourses, setFilteredCourses] = useState(courses);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    semester: "",
    degree: "",
    credits: "",
    is_active: "",
  });

  useEffect(() => {
    let result = courses;
    if (searchTerm) {
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm) ||
          c.courseCode.toLowerCase().includes(searchTerm),
      );
    }
    if (filters.semester)
      result = result.filter((c) => c.semester === filters.semester);
    if (filters.degree)
      result = result.filter((c) => c.degree === filters.degree);
    if (filters.credits)
      result = result.filter((c) => String(c.credits) === filters.credits);
    if (filters.is_active === "yes") result = result.filter((c) => c.is_active);
    if (filters.is_active === "no") result = result.filter((c) => !c.is_active);
    setFilteredCourses(result);
  }, [searchTerm, filters, courses]);

  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Oversikt over emner</h1>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Søk på navn eller emnekode..."
        value={searchTerm}
        onChange={handleSearch}
      />

      <div className="border rounded mb-4">
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
              <label className="form-label fw-semibold">Semester</label>
              <select
                className="form-select"
                name="semester"
                value={filters.semester}
                onChange={handleFilterChange}
              >
                <option value="">Alle</option>
                <option value="H">Høst</option>
                <option value="V">Vår</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">Nivå</label>
              <select
                className="form-select"
                name="degree"
                value={filters.degree}
                onChange={handleFilterChange}
              >
                <option value="">Alle</option>
                <option value="Bachelor">Bachelor</option>
                <option value="Master">Master</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">Studiepoeng</label>
              <select
                className="form-select"
                name="credits"
                value={filters.credits}
                onChange={handleFilterChange}
              >
                <option value="">Alle</option>
                {[...new Set(courses.map((c) => c.credits))]
                  .sort((a, b) => a - b)
                  .map((cr) => (
                    <option key={cr} value={cr}>
                      {cr}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">Aktiv</label>
              <select
                className="form-select"
                name="is_active"
                value={filters.is_active}
                onChange={handleFilterChange}
              >
                <option value="">Alle</option>
                <option value="yes">Aktiv</option>
                <option value="no">Inaktiv</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <table className="table table-bordered table-hover">
        <thead
          style={{
            backgroundColor: "var(--color-dark)",
            color: "var(--color-white)",
          }}
        >
          <tr>
            <th>Navn</th>
            <th>Emnekode</th>
            <th>Semester</th>
            <th>Studiepoeng</th>
            <th>Aktiv</th>
          </tr>
        </thead>
        <tbody>
          {filteredCourses.map((course) => (
            <tr key={course.id}>
              <td>
                <Link
                  to={`/courses/details/${course.id}`}
                  state={{ courseid: course.id }}
                >
                  {course.name}
                </Link>
              </td>
              <td>{course.courseCode}</td>
              <td>
                {course.semester === "H"
                  ? "Høst"
                  : course.semester === "V"
                    ? "Vår"
                    : course.semester}
              </td>
              <td>{course.credits}</td>
              <td>
                <span
                  className={`badge ${course.is_active ? "bg-success" : "bg-secondary"}`}
                >
                  {course.is_active ? "Ja" : "Nei"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Courses;
