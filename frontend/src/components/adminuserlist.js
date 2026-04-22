import React, { useEffect, useState } from "react";
import api from "../api";


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
      .delete("/user/delete/" + user.feide_id)
      .then(() => {
        setUsers((prev) => prev.filter((u) => u.feide_id !== user.feide_id));
        setMessage(`Brukeren ${user.email} ble slettet`);
      })
      .catch(() => setMessage(`Klarte ikke å slette ${user.email}`));
  };

  const handlePromoteUser = (user) => {
    api
      .put("/user/promote_user/" + user.feide_id)
      .then(() => {
        setUsers((prev) =>
          prev.map((u) =>
            u.feide_id === user.feide_id ? { ...u, role: "admin" } : u,
          ),
        );
        setMessage(`Brukeren ${user.email} er nå administrator`);
      })
      .catch(() => setMessage(`Klarte ikke å promotere ${user.email}`));
  };

  return (
    <div>
      <h2 className="mb-4">Liste over brukere</h2>
      {message && message}
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Navn</th>
            <th>Epostadresse</th>
            <th>Rolle</th>
            <th>Handlnger</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.feide_id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              {user.role !== "admin" && (
                <td>
                  <button className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteUser(user)}>
                    Slett bruker
                  </button>
                  <button className="btn btn-sm btn-outline-danger"
                    onClick={() => handlePromoteUser(user)}>
                    Gjør administrator
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default AdminUserList;
