import api from "../api";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function CreateStudyProgramForm() {
  const navigate = useNavigate();
  const [institutes, setInstitutes] = useState([])

  const [formData, setFormData] = useState({
    "studyprogram_name": "",
    "degree": "",
    "institute": "",
    "semester_number": "",
    "program_code": ""
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    const getInstitutes = async () => {
      await api.get('/institutes/get_all')
        .then(response => {
          setInstitutes(response.data)
        })

        .catch(error => {
          console.log(error)
        })
    }
    getInstitutes();

  }, []);

  const handleFieldChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const validateForm = (formData) => {
    const formErrors = {}
    if (!formData.degree)
      formErrors.degree = "Velg en av alternativene"

    if (!formData.institute)
      formErrors.institute = "Velg en av alternativene"

    if (!formData.studyprogram_name)
      formErrors.studyprogram_name = "Vennligst skriv inn et navn"

    if (!formData.semester_number)
      formErrors.semester_number = "Vennligst tast inn hvor mange semester studieprogrammet skal ha"

    if (!formData.program_code)
      formErrors.program_code = "Vennligst skriv inn en programkode"
    return formErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validateForm(formData)
    if (Object.keys(err).length === 0) {
      setErrors({})
      try {
        const response = await api.post("studyprograms/create", formData);
        // window.location.href = `./studyprograms/${response.data.id}`
        const createdProgram = response.data;
        console.log("Program created:", createdProgram);
        navigate("/createSP", { state: { program: createdProgram } });
        // window.location.href = `./createSP`
      } catch (error) {
        console.error("Failed to log in:", error);
      }
    }
    else {
      setErrors(err)
    }
  }


  return (
    <form onSubmit={handleSubmit} className="row g-3">
      <div className="col-md-6">
        <label htmlFor="studyprogram_name" className="form-label fw-semibold">Studieprogram navn:</label>
        <input name="studyprogram_name" id="studyprogram_name" className="form-control" onChange={handleFieldChange} />
        {errors.studyprogram_name && <div className="text-danger small">{errors.studyprogram_name}</div>}
      </div>

      <div className="col-md-6">
        <label htmlFor="program_code" className="form-label fw-semibold">Studieprogramkode:</label>
        <input type="text" name="program_code" id="program_code" className="form-control" onChange={handleFieldChange} />
        {errors.program_code && <div className="text-danger small">{errors.program_code}</div>}
      </div>

      <div className="col-md-6">
        <label htmlFor="degree" className="form-label fw-semibold">Nivå:</label>
        <select name="degree" id="degree" className="form-select" onChange={handleFieldChange}>
          <option value="">Velg en</option>
          <option value="Bachelor">Bachelor</option>
          <option value="Master">Master</option>
        </select>
        {errors.degree && <div className="text-danger small">{errors.degree}</div>}
      </div>

      <div className="col-md-6">
        <label htmlFor="institute" className="form-label fw-semibold">Institutt:</label>
        <select name="institute" id="institute" className="form-select" onChange={handleFieldChange}>
          <option value="">Velg en</option>
          {institutes && institutes.map(inst => (
            <option key={inst.id} value={inst.id}>{inst.name}</option>
          ))}
        </select>
        {errors.institute && <div className="text-danger small">{errors.institute}</div>}
      </div>

      <div className="col-md-6">
        <label htmlFor="semester_number" className="form-label fw-semibold">Antall Semester:</label>
        <input name="semester_number" id="semester_number" type="number" className="form-control" onChange={handleFieldChange} />
        {errors.semester_number && <div className="text-danger small">{errors.semester_number}</div>}
      </div>

      <div className="col-12">
        <button type="submit" className="btn btn-success">Send inn</button>
      </div>
    </form>
  );
}