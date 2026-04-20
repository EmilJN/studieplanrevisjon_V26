import React from "react";
import api from "../api";

export default function CreateCourseForm() {
  function submitCourseForm(formData) {
    const coursecode = formData.get("coursecode");
    const coursename = formData.get("coursename");
    const coursesemester = formData.get("coursesemester");
    const coursecredits = formData.get("coursecredits");
    const coursedegree = formData.get("coursedegree");
    const data = {
      code: coursecode,
      name: coursename,
      semester: coursesemester,
      credits: coursecredits,
      degree: coursedegree,
    };
    api
      .post("/courses/create", data, { withCredentials: true })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  }

  return (
    <form action={submitCourseForm} className="row g-3">
      <div className="col-md-6">
        <label htmlFor="coursecode" className="form-label fw-semibold">Emnekode:</label>
        <input name="coursecode" id="coursecode" className="form-control" />
      </div>

      <div className="col-md-6">
        <label htmlFor="coursename" className="form-label fw-semibold">Emnenavn:</label>
        <input name="coursename" id="coursename" className="form-control" />
      </div>

      <div className="col-md-6">
        <label htmlFor="coursesemester" className="form-label fw-semibold">Semester:</label>
        <select id="coursesemester" name="coursesemester" className="form-select">
          <option value="H">Høst</option>
          <option value="V">Vår</option>
        </select>
      </div>

      <div className="col-md-6">
        <label htmlFor="coursecredits" className="form-label fw-semibold">Studiepoeng:</label>
        <input name="coursecredits" id="coursecredits" className="form-control" type="number" />
      </div>

      <div className="col-md-6">
        <label htmlFor="coursedegree" className="form-label fw-semibold">Nivå:</label>
        <select id="coursedegree" name="coursedegree">
          <option value="Bachelor">Bachelor</option>
          <option value="Master">Master</option>
        </select>
      </div>

      <div className="col-12">
        <button type="submit" className="btn btn-success">Send inn</button>
      </div>

    </form>
  );
}
