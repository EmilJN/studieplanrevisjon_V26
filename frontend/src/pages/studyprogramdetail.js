import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/dragdrop.css";
import ValgemneOverlay from "../components/valgemne.js";
import {
  StudyProgramHeader,
  PreviousStudyPlans,
  calculatedYear,
} from "../utils/helpers.js";
import {
  exportStudyPlan,
  updateStudyPlan,
  fetchprogramcoursepackages,
} from "../utils/fetchHelpers.js";
import { useStudyPlanData } from "../hooks/studyplanData.js";
import SemesterDisplay from "../components/semesterDisplay.js";
import { DragDropContext } from "@hello-pangea/dnd";
import SearchCourses from "../components/searchCourses.js";
import ConflictSummary from "../components/conflictsummary.js";
import { handleDragEnd } from "../components/handledragdrop.js";
import { groupSemestersIntoPairs } from "../utils/helpers.js";
import { updateStudyPlanPayload } from "../utils/payloadHelpers.js";
import { useCourses } from "../utils/CoursesContext.js";
import api from "../api.js";

const colors = [
  "#3f3ce7",
  "#f22b2b",
  "#5be432",
  "#bd2eca",
  "#000000",
  "#f1d364",
  "#b07aa1",
  "#ff9da7",
];

const StudyProgramDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // const notificationsRef = useRef(null);
  const [courseToPackageMap, setCourseToPackageMap] = useState({});
  const [newCoursePackageType, setNewCoursePackageType] = useState("Emnepakke");
  const [editingCoursePackagesID, setEditingCoursePackagesID] = useState(null);
  const [coursepackages, setCoursepackages] = useState([]);
  const [newCoursePackage, setNewCoursePackage] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlaySemester, setOverlaySemester] = useState(null);
  const [overlaySemesterNumber, setOverlaySemesterNumber] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [confirmedConflicts, setConfirmedConflicts] = useState([]);
  const [showConflictSummary, setShowConflictSummary] = useState(false);
  const [formattedValgemner, setFormattedValgemner] = useState({});
  const { courses = [] } = useCourses() || {};
  const [studyplanId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [fetchedNotifications, setFetchedNotifications] = useState([]);

  const handleAssignCoursePackage = (
    courseId,
    packageId,
    prevPackageId = null,
  ) => {
    if (!packageId && prevPackageId) {
      api
        .post(`/coursepackage/RemoveCourseFromPackage/${prevPackageId}`, {
          course_id: courseId,
        })
        .then(() => {
          console.log("Removed course from package");
        })
        .catch((err) => console.error(err));
    } else if (packageId) {
      api
        .put(`coursepackage/AddCourseToPackage/${packageId}`, {
          course_id: courseId,
        })
        .then(() => {
          console.log("Updated package");
        })
        .catch((err) => console.error(err));
    }
  };

  const fetchCoursePackagesAndMapping = async () => {
    try {
      const res = await fetchprogramcoursepackages(selectedPlanId);
      const packages = res?.data || res || [];

      setCoursepackages(packages);
      const mapping = {};
      await Promise.all(
        packages.map(async (pkg) => {
          try {
            const res = await api.get(
              `/coursepackage/GetCoursesInPackage/${pkg.id}`,
            );

            res.data.forEach((course) => {
              mapping[course.id] = pkg.id;
            });
          } catch (err) {
            console.error(`Failed to fetch courses for package ${pkg.id}`, err);
          }
        }),
      );

      setCourseToPackageMap(mapping);
    } catch (error) {
      console.error("Error fetching course packages:", error);
    }
  };

  const packageColorMap = Object.fromEntries(
    (Array.isArray(coursepackages) ? coursepackages : []).map((cp, index) => [
      cp.id,
      colors[index % colors.length],
    ]),
  );

  const {
    loading,
    error,
    studyProgram,
    semesters,
    setSemesters,
    valgemne,
    setValgemne,
    valgemneCourse,
    latestStudyPlan,
    previousStudyPlans,
    selectedPlanId,
    switchStudyPlan,
    refreshData,
  } = useStudyPlanData(id);

  useEffect(() => {
    if (!loading && !latestStudyPlan) {
      const userConfirmed = window.confirm(
        "No study plans exist for this study program. Would you like to create one?",
      );

      if (userConfirmed) {
        navigate("/createSP", { state: { program: studyProgram } });
      }
    }
  }, [loading, latestStudyPlan, studyProgram, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (studyProgram?.id) {
        try {
          const res = await fetchprogramcoursepackages(selectedPlanId);
          const packages = res?.data || res || [];

          setCoursepackages(packages);

          const mapping = {};

          await Promise.all(
            packages.map(async (pkg) => {
              try {
                const res = await api.get(
                  `/coursepackage/GetCoursesInPackage/${pkg.id}`,
                );

                const courses = res.data;

                courses.forEach((course) => {
                  mapping[course.id] = pkg.id;
                });
              } catch (err) {
                console.error(
                  `Failed to fetch courses for package ${pkg.id}`,
                  err,
                );
              }
            }),
          );

          setCourseToPackageMap(mapping);
          console.log("Course → Package map:", mapping);
        } catch (error) {
          console.error("Error fetching course packages:", error);
        }
      }
    };

    fetchData();
  }, [studyProgram, selectedPlanId]);

  const handleAddCoursePackage = () => {
    api
      .post(`/coursepackage/CreateCoursePackage/${selectedPlanId}`, {
        name: newCoursePackage,
        packagetype: newCoursePackageType,
      })
      .then((response) => {
        const createdCoursePackage = response.data;

        setCoursepackages((prev) => [...prev, createdCoursePackage]);
        setNewCoursePackage("");
        setNewCoursePackageType("Emnepakke");
        setEditingCoursePackagesID(null);
      })
      .catch((error) => {
        console.error("Failed to create course package:", error);
      });
  };

  const handleDeleteCoursePackage = (id) => {
    if (!window.confirm("Er du sikker på at du vil slette denne emnepakken?"))
      return;
    api
      .delete(`/coursepackage/DeleteCoursePackage/${id}`)
      .then(() => {
        setCoursepackages((prev) => prev.filter((cp) => cp.id !== id));
      })
      .catch((error) => {
        console.error("Failed to delete course package:", error);
      });
  };

  const handleViewPlan = async (planId) => {
    setIsEditMode(false);
    switchStudyPlan(planId);
  };

  useEffect(() => {
    console.log("Updated valgemne in parent:", valgemne);
  }, [valgemne]);

  const handleVisValgemner = (semesterId, semesterNumber) => {
    setOverlaySemester(semesterId);
    setOverlaySemesterNumber(semesterNumber);
    setShowOverlay(true);
  };

  const handleUpdateStudyPlan = async () => {
    try {
      const studyPlanId = selectedPlanId;

      if (!studyPlanId) {
        console.error("No study plan ID found");
        return;
      }
      if (confirmedConflicts.length > 0 && !showConflictSummary) {
        setShowConflictSummary(true);
        return;
      }
      setErrorMessage("");

      const payload = updateStudyPlanPayload(
        studyPlanId,
        semesters,
        formattedValgemner,
      );
      const response = await updateStudyPlan(studyPlanId, payload);
      console.log("Update response:", response);

      await refreshData();
      await fetchCoursePackagesAndMapping();

      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating study plan:", error);
      alert("Failed to update study plan.");
    }
  };

  const handleDeleteStudyPlan = (e) => {
    api.delete("/studyplans/" + e).then(() => window.location.reload());
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!studyProgram) return <p>No study program found.</p>;
  const semesterPairs = groupSemestersIntoPairs(
    Array.isArray(semesters) ? semesters : Object.values(semesters),
  );

  return (
    <DragDropContext
      onDragEnd={(result) => {
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
          selectedProgram: studyProgram,
        });
      }}
    >
      <div className="container py-4">
        <StudyProgramHeader
          studyProgram={studyProgram}
          baseYear={latestStudyPlan?.year}
          onGenerate={() =>
            navigate(`/generatestudyplan/${id}`, {
              state: { studyProgram, year: latestStudyPlan?.year + 1 },
            })
          }
          setNotificationsRef={setFetchedNotifications}
        />
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        <ConflictSummary
          termConflicts={confirmedConflicts}
          isOpen={showConflictSummary}
          onClose={() => setShowConflictSummary(false)}
          onConfirm={() => {
            setShowConflictSummary(false);
            handleUpdateStudyPlan();
          }}
          onCancel={() => setShowConflictSummary(false)}
          sourceProgram={studyProgram}
          fetchedNotifications={fetchedNotifications}
        />

        {/* Action buttons */}
        <div className="d-flex gap-2 mt-4 justify-content-end">
          <button
            onClick={() =>
              navigate(`/generatestudyplan/${id}`, {
                state: { studyProgram, year: latestStudyPlan?.year + 1 },
              })
            }
            className="btn btn-primary"
          >
            Lag ny studieplan
          </button>
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`btn ${isEditMode ? "btn-outline-danger" : "btn-primary"}`}
          >
            {isEditMode ? "Avbryt" : "Rediger"}
          </button>
          {!isEditMode && (
            <button
              className="btn btn-danger"
              onClick={() => {
                if (
                  window.confirm(
                    `Er du sikker på at du vil slette denne studieplanen?`,
                  )
                )
                  handleDeleteStudyPlan(latestStudyPlan.id);
              }}
            >
              Slett studieplanen
            </button>
          )}
          {isEditMode && (
            <button onClick={handleUpdateStudyPlan} className="btn btn-success">
              Lagre studieplanen
            </button>
          )}
          <button
            className="btn btn-secondary"
            onClick={() => exportStudyPlan(studyProgram.id)}
          >
            Eksporter til word
          </button>
        </div>
        <div className="row">
          <div className="col-12 col-md-3 d-flex flex-column gap-3">
            {/* Previous study plans */}
            {previousStudyPlans.length > 0 && (
              <PreviousStudyPlans
                plans={previousStudyPlans}
                latestPlanId={latestStudyPlan?.id}
                studyprogramId={id}
                onViewPlan={handleViewPlan}
                currentPlanId={selectedPlanId}
              />
            )}

            {/* Emnepakker */}
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="fw-semibold mb-3">Pakker</h5>

                <button
                  className="btn btn-primary w-100 mb-3"
                  onClick={() =>
                    setEditingCoursePackagesID(
                      editingCoursePackagesID ? null : studyProgram.id,
                    )
                  }
                >
                  Opprett pakke
                </button>

                {editingCoursePackagesID === studyProgram.id && (
                  <div className="mb-3 d-flex flex-column gap-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Navn"
                      value={newCoursePackage}
                      onChange={(e) => setNewCoursePackage(e.target.value)}
                    />

                    <select
                      className="form-select w-auto"
                      value={newCoursePackageType}
                      onChange={(e) => setNewCoursePackageType(e.target.value)}
                    >
                      <option value="Emnepakke">Emnepakke</option>
                      <option value="Spesialisering">Spesialisering</option>
                    </select>

                    <button
                      className="btn btn-success btn-sm"
                      disabled={!newCoursePackage.trim()}
                      onClick={() => handleAddCoursePackage()}
                    >
                      Legg til
                    </button>
                  </div>
                )}

                {Array.isArray(coursepackages) && coursepackages.length > 0 ? (
                  <ul className="list-group list-group-flush">
                    {Array.isArray(coursepackages) &&
                      coursepackages.map((cp, index) => (
                        <li
                          key={cp.id}
                          className="list-group-item d-flex justify-content-between align-items-center"
                          style={{
                            borderLeft: `5px solid ${
                              colors[index % colors.length]
                            }`,
                          }}
                        >
                          <div>
                            <div className="fw-medium">{cp.name}</div>
                            <div className="text-muted small">
                              {cp.packagetype === "Spesialisering"
                                ? "Spesialisering"
                                : "Emnepakke"}
                            </div>
                          </div>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteCoursePackage(cp.id)}
                          >
                            Slett
                          </button>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <div className="text-muted text-center py-2">
                    Ingen pakker
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* HØYRE SIDE */}
          <div className="col-12 col-md-9">
            {/* Search bar if in edit mode */}
            {isEditMode && (
              <div className="mb-3">
                <SearchCourses
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  maxResults={10}
                  onResultsChange={setSearchResults}
                  allCourses={courses}
                  semesters={semesters}
                />
              </div>
            )}

            <h5 className="fw-semibold mb-3">Semester Oversikt</h5>
            <div className="d-flex flex-column gap-3">
              {semesterPairs.map((pair, pairIndex) => (
                <div key={pairIndex} className="row g-3">
                  {pair.map((semester) => (
                    <div
                      key={`semester-${semester.semester_number}`}
                      className="col-md-6"
                    >
                      <SemesterDisplay
                        courseToPackageMap={courseToPackageMap}
                        handleAssignCoursePackage={handleAssignCoursePackage}
                        setCourseToPackageMap={setCourseToPackageMap}
                        packageColorMap={packageColorMap}
                        coursepackages={coursepackages}
                        semesterId={semester.id}
                        semesterNumber={semester.semester_number}
                        courses={semester.semester_courses}
                        year={calculatedYear(
                          latestStudyPlan?.year,
                          semester.semester_number,
                          semester.term,
                        )}
                        term={semester.term}
                        onAdministrerValgemner={() =>
                          handleVisValgemner(
                            semester.id,
                            semester.semester_number,
                          )
                        }
                        readOnly={!isEditMode}
                        setFormattedValgemner={setFormattedValgemner}
                        semesters={semesters}
                        setSemesters={setSemesters}
                        valgemneCourse={valgemneCourse}
                        setSearchTerm={setSearchTerm}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Valgemne overlay */}
        <ValgemneOverlay
          isOpen={showOverlay}
          closeOverlay={() => setShowOverlay(false)}
          semester={overlaySemester}
          semesterNumber={overlaySemesterNumber}
          valgemne={valgemne}
          setValgemne={setValgemne}
          setFormattedValgemner={setFormattedValgemner}
          allCourses={courses}
          readOnly={!isEditMode}
        />
      </div>
    </DragDropContext>
  );
};

export default StudyProgramDetail;
