import React, { useState } from "react";
import api from "../api";

export default function CreateCourseForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    coursecode: "",
    coursename: "",
    coursesemester: "H",
    coursecredits: "",
    coursedegree: "Bachelor",
  });
  const [errors, setErrors] = useState({});

  const handleFieldChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = (formData) => {
    const formErrors = {};
    if (!formData.coursecode)
      formErrors.coursecode = "Vennligst skriv inn en emnekode";
    if (!formData.coursename)
      formErrors.coursename = "Vennligst skriv inn et emnenavn";
    if (!formData.coursecredits)
      formErrors.coursecredits = "Vennligst skriv inn antall studiepoeng";
    return formErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validateForm(formData);
    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }
    setErrors({});
    const data = {
      code: formData.coursecode,
      name: formData.coursename,
      semester: formData.coursesemester,
      credits: formData.coursecredits,
      degree: formData.coursedegree,
    };

    api
      .post("/courses/create", data, { withCredentials: true })
      .then((response) => {
        console.log(response);
        onSuccess?.();
      })
      .catch((error) => console.log(error));
  }

  return (
    <form onSubmit={handleSubmit} className="row g-3">
      <div className="col-md-6">
        <label htmlFor="coursecode" className="form-label fw-semibold">Emnekode:</label>
        <input name="coursecode" id="coursecode" className="form-control" onChange={handleFieldChange} />
        {errors.coursecode && <div className="text-danger small">{errors.coursecode}</div>}
      </div>

      <div className="col-md-6">
        <label htmlFor="coursename" className="form-label fw-semibold">Emnenavn:</label>
        <input name="coursename" id="coursename" className="form-control" onChange={handleFieldChange} />
        {errors.coursename && <div className="text-danger small">{errors.coursename}</div>}
      </div>

      <div className="col-md-6">
        <label htmlFor="coursesemester" className="form-label fw-semibold">Semester:</label>
        <select id="coursesemester" name="coursesemester" className="form-select" onChange={handleFieldChange}>
          <option value="H">Høst</option>
          <option value="V">Vår</option>
        </select>
      </div>
      
      <div className="col-md-6">
        <label htmlFor="coursecredits" className="form-label fw-semibold">Studiepoeng:</label>
        <input name="coursecredits" id="coursecredits" className="form-control" type="number" onChange={handleFieldChange} />
        {errors.coursecredits && <div className="text-danger small">{errors.coursecredits}</div>}
      </div>

      <div className="col-md-6">
        <label htmlFor="coursedegree" className="form-label fw-semibold">Nivå:</label>
        <select id="coursedegree" name="coursedegree" className="form-select" onChange={handleFieldChange}>
          <option value="Bachelor">Bachelor</option>
          <option value="Master">Master</option>
        </select>
      </div>

      <div className="col-12">
        <button type="submit" className="btn btn-outline-success">Lagre</button>
      </div>
    </form>
  );
}
