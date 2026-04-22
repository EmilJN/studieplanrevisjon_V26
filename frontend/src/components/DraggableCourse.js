import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import "../styles/dragdrop.css";

const DraggableCourse = ({
  course,
  courseToPackageMap,
  setCourseToPackageMap,
  handleAssignCoursePackage,
  index,
  onRemove,
  coursepackages,
  packageColorMap,
  isDragDisabled = false,
  readOnly,
  onAdministrerValgemner,
  semesterNumber = null,
  semesterId = null,
}) => {
  // valgemne er ikke draggable
  const isValgemne = course.courseCode?.includes("VALGEMNE");
  const courseDragDisabled = readOnly || isValgemne || isDragDisabled;

  const currentPackageId = courseToPackageMap?.[course.id];

  return (
    <Draggable
      draggableId={`course-${course.id}`}
      index={index}
      isDragDisabled={courseDragDisabled}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`course-item ${snapshot.isDragging ? "dragging" : ""} ${
            isValgemne ? "valgemne-item" : ""
          } ${courseDragDisabled ? "disabled" : ""}`}
          style={{
            borderLeft: `5px solid ${
              currentPackageId ? packageColorMap?.[currentPackageId] : "#d9d9d9"
            }`,
            ...provided.draggableProps.style,
            background: snapshot.isDragging ? "#e6f7ff" : "white",
            borderTop: snapshot.isDragging
              ? "2px dashed #1890ff"
              : "1px solid #eee",
            borderRight: snapshot.isDragging
              ? "2px dashed #1890ff"
              : "1px solid #eee",
            borderBottom: snapshot.isDragging
              ? "2px dashed #1890ff"
              : "1px solid #eee",
            boxSizing: "border-box",
            outline: snapshot.isDragging ? "2px solid purple" : "none",
          }}
        >
          <div className="course-details">
            <div className="course-name">
              {isValgemne ? "Valgemne" : course.name}
            </div>

            <div className="course-info">
              <span className="course-code">
                {isValgemne ? "Valgemne" : course.courseCode}
              </span>

              {course.credits > 0 && !isValgemne && (
                <span className="course-credits">{course.credits} sp</span>
              )}

              {course.semester && !isValgemne && (
                <span className="course-semester">{course.semester}</span>
              )}
            </div>

            {/* Dropdown */}
            {!readOnly && !isValgemne && (
              <div className="mt-2 d-flex justify-content-end">
                <select
                  className="form-select form-select-sm w-auto"
                  value={currentPackageId || ""}
                  onChange={(e) => {
                    const packageId = e.target.value || null;
                    setCourseToPackageMap((prev) => {
                      const updated = { ...prev };
                      const prevPackageId = prev[course.id];

                      if (!packageId) {
                        delete updated[course.id];
                      } else {
                        updated[course.id] = packageId;
                      }

                      handleAssignCoursePackage(
                        course.id,
                        packageId,
                        prevPackageId,
                      );

                      return updated;
                    });
                  }}
                >
                  <option value="">Ingen emnepakke</option>
                  {coursepackages?.map((cp) => (
                    <option key={cp.id} value={cp.id}>
                      {cp.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {!readOnly && semesterNumber && !isValgemne && (
            <button
              onClick={() => onRemove(course.id)}
              className="remove-button"
            >
              Fjern
            </button>
          )}

          {isValgemne && (
            <button
              onClick={() => onAdministrerValgemner()}
              className="manage-valgemner-button"
            >
              {readOnly ? "Vis valgemner" : "Administrer valgemner"}
            </button>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default DraggableCourse;
