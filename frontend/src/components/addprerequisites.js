import React, { useState, useEffect } from "react";
import api from "../api";


function AddPrerequisites(parentSubject) {
    const [subjects, setSubjects] = useState([]); // All subjects fetched from the backend
    const [filteredSubjects, setFilteredSubjects] = useState([]); // filtersøk på emne
    const [searchTerm, setSearchTerm] = useState(""); // søkeord
    const [prerequisiteList, setPrerequisiteList] = useState([])

    // Henta emner
    useEffect(() => {
        api.get("/courses/")
            .then(response => {
                setSubjects(response.data);
                setFilteredSubjects(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the subjects!", error);
            });
    }, []);

    // søkebar input
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        console.log(value)
        // Søk på navn/emnekode
        const filtered = subjects.filter((subject) =>
            subject.name.toLowerCase().includes(value) ||
            subject.courseCode.toLowerCase().includes(value)
        );
        setFilteredSubjects(filtered);
    };

    const handleAddToPreReqList = (e) => {
        if (prerequisiteList.includes(e)) {
            return false
        }
        setPrerequisiteList(prev => {
            return [...prev, e];
        })
    }

    const handleRemovePreRequisite = (e) => {
        setPrerequisiteList(oldSubject => {
            return oldSubject.filter(subject => subject !== e)
        })
    }
    const handleSubmitPreRequisite = () => {
        const parentSubjectId = parentSubject.parentSubject.id
        api.post(`/prerequisites/add/${parentSubjectId}`, prerequisiteList)
            .then(response => {
                if (response) {
                    alert("Emnene ble lagt til")
                    setPrerequisiteList([])
                    window.location.reload()
                }
            })
            .catch(error => {
                console.error("Klarte ikke å legge til emnene, prøv igjen.", error);
            });

    }

    return (
        <div className="mt-3" >
            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>Emnekode</th>
                        <th>Emnenavn</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {prerequisiteList.length ? prerequisiteList.map((subject) =>
                        <tr key={subject.id}>
                            <td>{subject.courseCode}</td>
                            <td>{subject.name}</td>
                            <td>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemovePreRequisite(subject)}>
                                    Fjern
                                </button>
                            </td>
                        </tr>
                    ) : null}
                </tbody>
            </table>
            {prerequisiteList.length ? (
                <button className="btn btn-success mb-2" onClick={handleSubmitPreRequisite}>
                    Send inn emner
                </button>
            ) : null}
            <input className="form-control mb-3"
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
                    {filteredSubjects.map((subject) => {
                        if (subject.id !== parentSubject.parentSubject.id && !parentSubject.parentSubject.prereqs.includes(subject.name)) {
                            return (
                                <tr key={subject.id}>
                                    <td>{subject.name}</td>
                                    <td>{subject.courseCode}</td>
                                    <td>{subject.semester}</td>
                                    <td>{subject.credits}</td>
                                    <td>
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleAddToPreReqList(subject)}>
                                            Legg til
                                        </button>
                                    </td>
                                </tr>
                            )
                        }
                    }
                    )}
                </tbody>
            </table>
        </div>
    );
}
export default AddPrerequisites