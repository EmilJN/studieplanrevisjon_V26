import React, { useEffect, useState } from "react";
import api from "../api";

const AdminDatabase = () => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchBackups = async () => {
    try {
      const res = await api.get("/db/backups/list");
      setBackups(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Feil ved henting av backups");
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleBackup = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/db/backups/start-backup");
      setMessage("Backup opprettet!");
      await fetchBackups();
    } catch (err) {
      console.error(err);
      setMessage("Feil ved backup");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (filename) => {
    if (!window.confirm(`Er du sikker på at du vil restore ${filename}?`))
      return;

    setLoading(true);
    setMessage("");

    try {
      await api.post(`/db/backups/restore/${filename}`);
      setMessage("Restore fullført!");
    } catch (err) {
      console.error(err);
      setMessage("Feil ved restore");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm(`Er du sikker på at du vil slette ${filename}?`))
      return;

    setLoading(true);
    setMessage("");

    try {
      await api.delete(`/db/backups/delete/${filename}`);
      setMessage("Backup slettet!");
      await fetchBackups();
    } catch (err) {
      console.error(err);
      setMessage("Feil ved sletting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Database Backups</h2>

      {/* Statusmelding */}
      {message && <div className="alert alert-info mt-3">{message}</div>}

      {/* Knapper */}
      <div className="mb-3 d-flex gap-2">
        <button
          className="btn btn-primary"
          onClick={handleBackup}
          disabled={loading}
        >
          {loading ? "Jobber..." : "Ta backup"}
        </button>

        <button
          className="btn btn-secondary"
          onClick={fetchBackups}
          disabled={loading}
        >
          Oppdater liste
        </button>
      </div>

      {/* Tabell */}
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Filnavn</th>
            <th>Handling</th>
          </tr>
        </thead>
        <tbody>
          {backups.length === 0 ? (
            <tr>
              <td colSpan="2" className="text-center">
                Ingen backups funnet
              </td>
            </tr>
          ) : (
            backups.map((backup) => (
              <tr key={backup}>
                <td>{backup}</td>
                <td className="d-flex gap-2">
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleRestore(backup)}
                    disabled={loading}
                  >
                    Restore
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(backup)}
                    disabled={loading}
                  >
                    Slett
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDatabase;
