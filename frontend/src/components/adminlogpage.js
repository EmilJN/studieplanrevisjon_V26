import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/NavBar.css";
import api from "../api";
import { useAuth } from "./validateuser";
import Admin from "../pages/admin";

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
      <h2>Liste over brukere</h2>
      <div>
        <table>
          <thead>
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
    </div>
  );
};
export default AdminLogPage;
