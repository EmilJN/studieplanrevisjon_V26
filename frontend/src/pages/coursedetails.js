import api from "../api";
import { useEffect, useState } from "react";
import { useAuth } from "../components/validateuser";
import {useParams } from "react-router-dom";
import AddPrerequisites from "../components/addprerequisites";
import { Link } from "react-router-dom";

function CollapsibleSection({ title, children, defaultCollapsed = true }) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-header bg-light">
        <button
          className="btn btn-sm w-100 text-start d-flex justify-content-between align-items-center"
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-expanded={!collapsed}
        >
          <span className="fw-semibold">{title}</span>
          <span>{collapsed ? ">" : "v"}</span>
        </button>
      </div>

      <div className={`collapse ${!collapsed ? "show" : ""}`}>
        <div className="card-body">{children}</div>
      </div>
    </div>
  );
}

function CourseDetails() {
  const [editAsNewVersion, setEditAsNewVersion] = useState(false);
  const { id } = useParams();
  const {currentUser } = useAuth();
  const [subject, setSubject] = useState({});
  const [editingActive, setEditingActive] = useState(false);
  const [isPreReqVisible, setIsPreReqVisible] = useState(false);
  const [studyPrograms, setStudyPrograms] = useState([]);
  const [allVersions, setAllVersions] = useState([]);
  const previousCourses = allVersions.filter(
    (c) => c.version < subject.version,
  );
  const newerCourses = allVersions.filter((c) => c.version > subject.version);
  const [overlappingCourses, setOverlappingCourses] = useState([]);
  const [reallyDeleteCourse, setReallyDeleteCourse] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    api
      .get("/courses/" + id)
      .then((response) => {
        setSubject(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the subject!", error);
      });

    api
      .get("/courses/course_usage/" + id)
      .then((response) => {
        setStudyPrograms(response.data);
      })
      .catch((error) => {
        console.error("Could not get studyplans!", error);
      });

    api
      .get(`/courses/${id}/course_group`)
      .then((response) => {
        setAllVersions(
          Array.isArray(response.data) ? response.data : [response.data],
        );
      })
      .catch((error) => {
        console.error("Could not get previous course version!", error);
      });

    api
      .get(`/courses/overlapping_courses/${id}`)
      .then((response) => {
        setOverlappingCourses(response.data);
      })
      .catch((error) => {
        console.error("Could not get overlapping courses!", error);
      });
  }, [id]);

  function handleEdit() {
    if (editingActive) {
      setEditingActive(false);
    }
    if (!editingActive) {
      setEditingActive(true);
    }
  }

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setSubject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    api
      .put(`/courses/${subject.id}`, {
        ...subject,
        editAsNewVersion,
        user_id: currentUser.feide_id,
      })
      .then((response) => {
        if (response) {
          alert(response.data.message);
        }
        Promise.all([
          api.get("/courses/" + subject.id),
          api.get("/courses/course_usage/" + subject.id),
          api.get(`/courses/${subject.id}/course_group`),
          api.get(`/courses/overlapping_courses/${subject.id}`),
        ])
          .then(
            ([
              subjectRes,
              studyProgramsRes,
              allVersionsRes,
              overlappingCoursesRes,
            ]) => {
              setSubject(subjectRes.data);
              setStudyPrograms(studyProgramsRes.data);
              setAllVersions(
                Array.isArray(allVersionsRes.data)
                  ? allVersionsRes.data
                  : [allVersionsRes.data],
              );
              setOverlappingCourses(overlappingCoursesRes.data);
            },
          )
          .catch((error) => {
            console.error("Error refreshing course details after save", error);
          });
        setEditingActive(false);
      })
      .catch((error) => {
        console.error("Klarte ikke å endre emnet.", error);
      });
  };

  const handlePrerequisiteVisible = () => {
    if (isPreReqVisible) {
      setIsPreReqVisible(false);
    }
    if (!isPreReqVisible) {
      setIsPreReqVisible(true);
    }
  };

  const handleRemovePreRequisite = (e) => {
    api
      .delete(`/prerequisites/remove/${subject.id}/${e.id}`)
      .then(() => {
        api.get("/courses/" + id).then((response) => setSubject(response.data));
      })
      .catch((error) => {
        console.error("Klarte ikke å slette emnet");
      });
  };

  const handleDeleteCourse = () => {
    if (studyPrograms.length !== 0) {
      setErrorMessage("Kan ikke slette emner som er i bruk");
    } else if (!reallyDeleteCourse) {
      setReallyDeleteCourse(true);
    } else if (studyPrograms.length === 0 && reallyDeleteCourse) {
      console.log("Emnet er slettet");
      api.delete(`/courses/${subject.id}`);
      alert(`${subject.name} har nå blitt slettet`);
      window.location.href = "/courses/";
    }
  };

  if (editingActive) {
    return (
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8">
            <h2 className="mb-4">
              <input
                className="form-control"
                name="name"
                value={subject.name}
                onChange={handleFieldChange}
              />
            </h2>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Emnekode</label>
                <input
                  className="form-control"
                  name="courseCode"
                  value={subject.courseCode}
                  onChange={handleFieldChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Studiepoeng</label>
                <input
                  className="form-control"
                  name="credits"
                  value={subject.credits}
                  onChange={handleFieldChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Semester (H eller V)
                </label>
                <input
                  className="form-control"
                  name="semester"
                  value={subject.semester}
                  onChange={handleFieldChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Nivå</label>
                <select
                  className="form-select"
                  name="degree"
                  value={subject.degree}
                  onChange={handleFieldChange}
                >
                  <option value="Bachelor">Bachelor</option>
                  <option value="Master">Master</option>
                </select>
              </div>
            </div>

            <CollapsibleSection
              title={`Blir brukt i (${studyPrograms.length})`}
              defaultCollapsed={true}
            >
              <ul className="list-group mb-4">
                {studyPrograms && studyPrograms.length > 0 ? (
                  studyPrograms.map((element) => (
                    <li
                      key={element.name + element.year}
                      className="list-group-item"
                    >
                      {element.name} - Årskull: {element.year} -
                      {element.mandatory ? "Obligatorisk" : "Valgemne"}
                    </li>
                  ))
                ) : (
                  <li className="list-group-item text-muted">Ingen</li>
                )}
              </ul>
            </CollapsibleSection>
            <CollapsibleSection
              title={`Overlappende (${overlappingCourses.length})`}
              defaultCollapsed={true}
            >
              <ul className="list-group mb-4">
                {overlappingCourses && overlappingCourses.length > 0 ? (
                  overlappingCourses.map((element) => (
                    <li key={element.id} className="list-group-item">
                      <a href={`/courses/details/${element.id}`}>
                        {element.name}
                      </a>
                    </li>
                  ))
                ) : (
                  <li className="list-group-item text-muted">Ingen</li>
                )}
              </ul>
            </CollapsibleSection>
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="editAsNewVersion"
                checked={editAsNewVersion}
                onChange={() => setEditAsNewVersion((prev) => !prev)}
              />
              <label className="form-check-label" htmlFor="editAsNewVersion">
                Lagre som ny variant av emnet
              </label>
              <div className="form-text">
                Lagre emnet som en ny variant, slik at den gamle versjonen
                fortsatt er tilgjengelig.
              </div>
              {studyPrograms.length > 0 && (
                <div className="alert alert-warning mt-2">
                  Dette emnet brukes i {studyPrograms.length} studieprogrammer.
                  Hvis du gjør endringer uten å opprette en ny versjon, vil det
                  sendes e-post til alle berørte programmeransvarlige.
                </div>
              )}
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-success" onClick={handleSave}>
                Lagre
              </button>
              <button
                className="btn btn-outline-danger"
                onClick={() => {
                  handleEdit();
                  api
                    .get("/courses/" + id)
                    .then((response) => setSubject(response.data));
                }}
              >
                Lukk
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8">
          <div className="d-flex justify-content-between align-items-start mb-4">
            <h2 className="mb-0">{subject.name}</h2>
            <div className="d-flex gap-2">
              {subject.is_current && (
                <button className="btn btn-primary" onClick={handleEdit}>
                  Rediger emne
                </button>
              )}
              <button
                className="btn btn-outline-danger"
                onClick={handleDeleteCourse}
              >
                Slett emne
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="alert alert-warning">{errorMessage}</div>
          )}
          {reallyDeleteCourse && (
            <div className="alert alert-danger d-flex align-items-center gap-3">
              <span>
                Er du sikker på at du vil slette {subject.courseCode}?
              </span>
              <button
                className="btn btn-sm btn-danger"
                onClick={handleDeleteCourse}
              >
                Ja
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setReallyDeleteCourse(false)}
              >
                Nei
              </button>
            </div>
          )}

          <div className=" card border-0 shadow-sm mb-4">
            <div className="card-body row g-3">
              <div className="col-md-6">
                <span className="fw-semibold">Emnekode:</span>{" "}
                {subject.courseCode}
              </div>
              <div className="col-md-6">
                <span className="fw-semibold">Versjon:</span> {subject.version}
              </div>
              <div className="col-md-6">
                <span className="fw-semibold">Gjeldende:</span>{" "}
                {subject.is_current ? "Ja" : "Nei"}
              </div>
              <div className="col-md-6">
                <span className="fw-semibold">Studiepoeng:</span>{" "}
                {subject.credits}
              </div>
              <div className="col-md-6">
                <span className="fw-semibold">Semester:</span>{" "}
                {subject.semester === "H" && "Høst"}
                {subject.semester === "V" && "Vår"}
              </div>
              <div className="col-md-6">
                <span className="fw-semibold">Nivå:</span> {subject.degree}
              </div>
            </div>
          </div>

          <h5 className="fw-semibold">Forkunnskaper</h5>
          <ul className="list-group mb-4">
            {subject.prerequisites !== undefined &&
            subject.prerequisites.length > 0 ? (
              subject.prerequisites.map((element) => (
                <li
                  key={element.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {element.name}
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleRemovePreRequisite(element)}
                  >
                    Fjern
                  </button>
                </li>
              ))
            ) : (
              <li className="list-group-item text-muted">Ingen</li>
            )}
          </ul>
          <button
            className="btn btn-outline-secondary mb-2"
            onClick={handlePrerequisiteVisible}
          >
            {isPreReqVisible ? "Lukk" : "Legg til forkunnskaper"}
          </button>
          {isPreReqVisible && (
            <div className="mt-3">
              <AddPrerequisites
                parentSubject={subject}
                onPrereqsAdded={() => {
                  api
                    .get("/courses/" + id)
                    .then((response) => setSubject(response.data));
                }}
              />
            </div>
          )}
          <CollapsibleSection
            title={`Blir brukt i (${studyPrograms.length})`}
            defaultCollapsed={true}
          >
            <ul className="list-group mb-4">
              {studyPrograms && studyPrograms.length > 0 ? (
                studyPrograms.map((element) => (
                  <li
                    key={element.name + element.year}
                    className="list-group-item"
                  >
                    {element.name} - Årskull: {element.year} -
                    {element.mandatory ? "Obligatorisk" : "Valgemne"}
                  </li>
                ))
              ) : (
                <li className="list-group-item text-muted">Ingen</li>
              )}
            </ul>
          </CollapsibleSection>
          <CollapsibleSection
            title={`Overlapper med (${overlappingCourses.length})`}
            defaultCollapsed={true}
          >
            <ul className="list-group mb-4">
              {overlappingCourses && overlappingCourses.length > 0 ? (
                overlappingCourses.map((element) => (
                  <li key={element.id} className="list-group-item">
                    <a href={`/courses/details/${element.id}`}>
                      {element.name}
                    </a>
                  </li>
                ))
              ) : (
                <li className="list-group-item text-muted">Ingen</li>
              )}
            </ul>
          </CollapsibleSection>
          <CollapsibleSection
            title={`Tidligere versjoner (${previousCourses.length})`}
            defaultCollapsed={true}
          >
            <ul className="list-group mb-4">
              {previousCourses.length > 0 ? (
                previousCourses.map((c) => (
                  <li key={c.id} className="list-group-item">
                    <Link
                      to={`/courses/details/${c.id}`}
                      className="stretched-link text-decoration-none"
                    >
                      {c.name} - Versjon: {c.version}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="list-group-item text-muted">Ingen</li>
              )}
            </ul>
          </CollapsibleSection>
          <CollapsibleSection
            title={`Nyere versjoner (${newerCourses.length})`}
            defaultCollapsed={true}
          >
            <ul className="list-group mb-4">
              {newerCourses.length > 0 ? (
                newerCourses.map((c) => (
                  <li key={c.id} className="list-group-item">
                    <Link
                      to={`/courses/details/${c.id}`}
                      className="stretched-link text-decoration-none"
                    >
                      {c.name} - Versjon: {c.version}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="list-group-item text-muted">Ingen</li>
              )}
            </ul>
          </CollapsibleSection>
        </div>
      </div>
    </div>
  );
}
export default CourseDetails;
