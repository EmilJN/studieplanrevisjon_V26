import React, { useEffect, useState } from "react";
import api from "../api";

const AdminInstituteList = () => {
  const [institutes, setInstitutes] = useState([]);
  const [message, setMessage] = useState("");
  const [newInstituteName, setNewInstituteName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    const getInstitutes = async () => {
      try {
        const response = await api.get("/institutes/get_all");
        setInstitutes(response.data);
      } catch (error) {
        console.log(error);
        setMessage("Klarte ikke å hente institutter");
      }
    };
    getInstitutes();
  }, []);

  const handleAddInstitute = async () => {
    if (!newInstituteName.trim()) {
      setMessage("Navn er påkrevd");
      return;
    }

    try {
      const response = await api.post("/institutes/add", {
        name: newInstituteName,
      });

      setInstitutes((prev) => [...prev, response.data]);
      setNewInstituteName("");
      setMessage(`Instituttet "${response.data.name}" ble opprettet`);
    } catch (error) {
      setMessage("Klarte ikke å opprette institutt");
    }
  };

  const handleDeleteInstitute = async (institute) => {
    const confirmDelete = window.confirm(
      `Er du sikker på at du vil slette "${institute.name}"?\n\nDette vil også slette ALLE studieprogram som tilhører dette instituttet!`,
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/institutes/delete/${institute.id}`);
      setInstitutes((prev) => prev.filter((i) => i.id !== institute.id));
      setMessage(`Instituttet "${institute.name}" ble slettet`);
    } catch (error) {
      setMessage(`Klarte ikke å slette "${institute.name}"`);
    }
  };

  const startEditing = (institute) => {
    setEditingId(institute.id);
    setEditingName(institute.name);
  };

  const handleUpdateInstitute = async (id) => {
    if (!editingName.trim()) {
      setMessage("Navn er påkrevd");
      return;
    }

    try {
      const response = await api.put(`/institutes/update/${id}`, {
        name: editingName,
      });

      setInstitutes((prev) =>
        prev.map((i) => (i.id === id ? response.data : i)),
      );

      setEditingId(null);
      setEditingName("");
      setMessage(`Instituttet ble oppdatert`);
    } catch (error) {
      setMessage("Klarte ikke å oppdatere institutt");
    }
  };

  return (
    <div>
      <h2 className="mb-4">Liste over institutter</h2>

      {message && <p>{message}</p>}

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Nytt institutt"
          value={newInstituteName}
          onChange={(e) => setNewInstituteName(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleAddInstitute}>
          Opprett institutt
        </button>
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Navn</th>
            <th>Handlinger</th>
          </tr>
        </thead>
        <tbody>
          {institutes.map((institute) => (
            <tr key={institute.id}>
              <td>{institute.id}</td>

              <td>
                {editingId === institute.id ? (
                  <input
                    className="form-control"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                ) : (
                  institute.name
                )}
              </td>

              <td>
                {editingId === institute.id ? (
                  <>
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => handleUpdateInstitute(institute.id)}
                    >
                      Lagre
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setEditingId(null)}
                    >
                      Avbryt
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => startEditing(institute)}
                    >
                      Rediger
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteInstitute(institute)}
                    >
                      Slett
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminInstituteList;
