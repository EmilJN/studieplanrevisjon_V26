import React, { useState, useEffect } from "react";
import api from "../api";

const EditCourse = () => {
    const [subjects, setSubjects] = useState([]); 
    const [filteredSubjects, setFilteredSubjects] = useState([]); 
    const [searchTerm, setSearchTerm] = useState(""); 
    const [editingSubjectId, setEditingSubjectId] = useState(null); 
    const [editedSubject, setEditedSubject] = useState({}); 

    useEffect(() => {
        api.get("/subjects/")
            .then(response => {
                setSubjects(response.data);
                setFilteredSubjects(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the subjects!", error);
            });
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        const filtered = subjects.filter((subject) =>
            subject.name.toLowerCase().includes(value) ||
            subject.subjectCode.toLowerCase().includes(value)
        );
        setFilteredSubjects(filtered);
    };

    const handleEditClick = (subject) => {
        setEditingSubjectId(subject.id);
        setEditedSubject({ ...subject }); 
    };

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setEditedSubject((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = () => {
        api.put(`/subjects/${editingSubjectId}`, editedSubject)
            .then(response => {
                setSubjects((prevSubjects) =>
                    prevSubjects.map((subject) =>
                        subject.id === editingSubjectId ? response.data : subject
                    )
                );
                setFilteredSubjects((prevFiltered) =>
                    prevFiltered.map((subject) =>
                        subject.id === editingSubjectId ? response.data : subject
                    )
                );
                setEditingSubjectId(null); 
            })
            .catch(error => {
                console.error("There was an error updating the subject!", error);
            });
    };
    const handleCancel = () => {
        setEditingSubjectId(null);
        setEditedSubject({});
    };

    return (
        <div>
            <h1>Edit Subjects</h1>
            <input
                type="text"
                placeholder="Search by Name or Subject Code"
                value={searchTerm}
                onChange={handleSearch}
                style={{ marginBottom: "20px", width: "100%", padding: "10px", fontSize: "16px" }}
            />

            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>Name</th>
                        <th>Subject Code</th>
                        <th>Semester</th>
                        <th>Credits</th>
                        <th>Is Active</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSubjects.map((subject) =>
                        editingSubjectId === subject.id ? (
                            <tr key={subject.id}>
                                <td>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editedSubject.name}
                                        onChange={handleFieldChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="subjectCode"
                                        value={editedSubject.subjectCode}
                                        onChange={handleFieldChange}
                                    />
                                </td>
                                <td>
                                    <select
                                        name="semester"
                                        value={editedSubject.semester}
                                        onChange={handleFieldChange}
                                    >
                                        <option value="Høst">Høst</option>
                                        <option value="Vår">Vår</option>
                                    </select>
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        name="credits"
                                        value={editedSubject.credits}
                                        onChange={handleFieldChange}
                                    />
                                </td>
                                <td>
                                    <select
                                        name="is_active"
                                        value={editedSubject.is_active ? "Yes" : "No"}
                                        onChange={(e) =>
                                            setEditedSubject((prev) => ({
                                                ...prev,
                                                is_active: e.target.value === "Yes",
                                            }))
                                        }
                                    >
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </td>
                                <td>
                                    <button onClick={handleSave}>Save</button>
                                    <button onClick={handleCancel}>Cancel</button>
                                </td>
                            </tr>
                        ) : (
                            <tr key={subject.id}>
                                <td>
                                    <span
                                        style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
                                        onClick={() => handleEditClick(subject)}
                                    >
                                        {subject.name}
                                    </span>
                                </td>
                                <td>{subject.subjectCode}</td>
                                <td>{subject.semester}</td>
                                <td>{subject.credits}</td>
                                <td>{subject.is_active ? "Yes" : "No"}</td>
                                <td>
                                    <button onClick={() => handleEditClick(subject)}>Edit</button>
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default EditCourse;
