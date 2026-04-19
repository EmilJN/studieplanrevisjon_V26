import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/NavBar.css";
import api from "../api";
import { useAuth } from "./validateuser";

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getUsers = async () => {
      await api
        .get("/user/get_all_users")
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getUsers();
  }, []);

  const handleDeleteUser = (user) => {
    api
      .delete("/user/delete/" + user.id)
      .then(() => {
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        setMessage(`Brukeren ${user.email} ble slettet`);
      })
      .catch(() => setMessage(`Klarte ikke å slette ${user.email}`));
  };

  const handlePromoteUser = (user) => {
    api
      .put("/user/promote_user/" + user.id)
      .then(() => {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, role: "admin" } : u)),
        );
        setMessage(`Brukeren ${user.email} er nå administrator`);
      })
      .catch(() => setMessage(`Klarte ikke å promotere ${user.email}`));
  };

  return (
    <div>
      <h2>Liste over brukere</h2>
      {message && message}
      <div>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Navn</th>
              <th>Epostadresse</th>
              <th>Rolle</th>
              <th>Verifisert</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.verified ? "Ja" : "Nei"}</td>
                {user.role !== "admin" && (
                  <td>
                    <button onClick={() => handleDeleteUser(user)}>
                      Slett bruker
                    </button>
                    <button onClick={() => handlePromoteUser(user)}>
                      Gjør administrator
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminUserList;
