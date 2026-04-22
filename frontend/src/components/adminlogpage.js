import React, { useEffect, useState } from "react";
import api from "../api";

const AdminLogPage = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const getLog = async () => {
      await api
        .get("/user/get_logs")
        .then((response) => {
          setLogs(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getLog();
  }, []);

  return (
    <div>
      <h2 className="mb-4">Logg</h2>
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Id</th>
            <th>Tid</th>
            <th>Melding</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr>
              <td>{log.id}</td>
              <td>{log.time}</td>
              <td>{log.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default AdminLogPage;
