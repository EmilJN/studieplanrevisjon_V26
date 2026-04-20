import React, { useState, useEffect } from "react";
import api from "../api";

function AddPrerequisites({ parentSubject, onPrereqsAdded }) {
  const [subjects, setSubjects] = useState([]); // All subjects fetched from the backend
  const [filteredSubjects, setFilteredSubjects] = useState([]); // filtersøk på emne
  const [searchTerm, setSearchTerm] = useState(""); // søkeord
  const [prerequisiteList, setPrerequisiteList] = useState([]);

  // Henta emner
  useEffect(() => {
    api
      .get("/courses/")
      .then((response) => {
        setSubjects(response.data);
        setFilteredSubjects(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the subjects!", error);
      });
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = subjects.filter(
      (subject) =>
        (subject.name.toLowerCase().includes(value) ||
          subject.courseCode.toLowerCase().includes(value)) &&
        !prerequisiteList.some((prereq) => prereq.id === subject.id),
    );
    setFilteredSubjects(filtered);
  };

  const handleAddToPreReqList = (subject) => {
    if (prerequisiteList.some((prereq) => prereq.id === subject.id)) {
      return false;
    }
    const updated = [...prerequisiteList, subject];
    setPrerequisiteList(updated);
    setFilteredSubjects((curr) => curr.filter((s) => s.id !== subject.id));
    // Send inn automatisk
    const parentSubjectId = parentSubject.id;
    api
      .post(`/prerequisites/add/${parentSubjectId}`, [subject])
      .then((response) => {
        if (response && response.data) {
          if (onPrereqsAdded) onPrereqsAdded();
        }
      })
      .catch((error) => {
        console.error("Klarte ikke å legge til emnet som forkunnskap.", error);
      });
  };

  const handleRemovePreRequisite = (subject) => {
    setPrerequisiteList((oldList) => {
      const updated = oldList.filter((s) => s.id !== subject.id);
      if (
        subject.name.toLowerCase().includes(searchTerm) ||
        subject.courseCode.toLowerCase().includes(searchTerm)
      ) {
        setFilteredSubjects((curr) => [subject, ...curr]);
      }
      return updated;
    });
  };
  const handleSubmitPreRequisite = () => {
    const parentSubjectId = parentSubject.id;
    api
      .post(`/prerequisites/add/${parentSubjectId}`, prerequisiteList)
      .then((response) => {
        if (response && response.data) {
          alert(
            "Emnene ble lagt til!\n" + JSON.stringify(response.data, null, 2),
          );
          setPrerequisiteList([]);
          if (onPrereqsAdded) onPrereqsAdded();
        }
      })
      .catch((error) => {
        console.error("Klarte ikke å legge til emnene, prøv igjen.", error);
      });
  };

  return (
    <div className="mt-3">
      <input
        className="form-control mb-3"
        type="text"
        placeholder="Søk på navn eller emnekode..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Subject Code</th>
            <th>Semester</th>
            <th>Credits</th>
            <th>Legg til</th>
          </tr>
        </thead>
        <tbody>
          {filteredSubjects
            .filter(
              (subject) =>
                subject.id !== parentSubject.id &&
                !(
                  Array.isArray(parentSubject.prerequisites) &&
                  parentSubject.prerequisites
                    .map((p) => p.name)
                    .includes(subject.name)
                ),
            )
            .map((subject) => (
              <tr key={subject.id}>
                <td>{subject.name}</td>
                <td>{subject.courseCode}</td>
                <td>{subject.semester}</td>
                <td>{subject.credits}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleAddToPreReqList(subject)}
                  >
                    Legg til
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
export default AddPrerequisites;
