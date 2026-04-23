import React, { useState, useEffect} from "react";
import { useCourses } from "../utils/CoursesContext";
import { useNavigate } from "react-router-dom";
import CreateCourseForm from "../components/createcourseform";

const Courses = () => {
  const { courses } = useCourses();
  const navigate = useNavigate();
  const [showCreateCourseForm, setShowCreateCourseForm] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState(courses);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    semester: "",
    degree: "",
    credits: "",
    is_active: "",
    current: "",
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
    if (filters.current === "yes") result = result.filter((c) => c.is_current);
    if (filters.current === "no") result = result.filter((c) => !c.is_current);
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
      <button
        className="btn btn-outline-primary mb-3"
        onClick={() => setShowCreateCourseForm((prev) => !prev)}
      >
        {showCreateCourseForm ? "Lukk skjema" : "Legg til nytt emne"}
      </button>
      {showCreateCourseForm && (
        <div className="border rounded p-4 mb-3">
          <h5 className="mb-3">Legg til nytt emne</h5>
          <CreateCourseForm onSuccess={() => setShowCreateCourseForm(false)} />
        </div>
      )}

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
              <label className="form-label fw-semibold">Nåværende</label>
              <select
                className="form-select"
                name="current"
                value={filters.current}
                onChange={handleFilterChange}
              >
                <option value="">Alle</option>
                <option value="yes">Nåværende</option>
                <option value="no">Tidligere</option>
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
        <thead className="table-dark">
          <tr>
            <th>Navn</th>
            <th>Emnekode</th>
            <th>Nivå</th>
            <th>Semester</th>
            <th>Studiepoeng</th>
            <th>Tidligere versjoner</th>
            <th>Aktiv</th>
          </tr>
        </thead>
        <tbody>
          {filteredCourses.map((course) => (
            <tr
              key={course.id}
              onClick={() => navigate(`/courses/details/${course.id}`)}
              style={{ cursor: "pointer" }}
            >
              <td>{course.name}</td>
              <td>{course.courseCode}</td>
              <td>{course.degree}</td>
              <td>
                {course.semester === "H"
                  ? "Høst"
                  : course.semester === "V"
                    ? "Vår"
                    : course.semester}
              </td>
              <td>{course.credits}</td>
              <td>{course.version - 1 === 0 ? "Nei" : course.version - 1}</td>
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
