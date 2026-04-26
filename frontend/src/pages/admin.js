import React, { useState } from "react";
import { useAuth } from "../components/validateuser";
import AdminUserList from "../components/adminuserlist";
import AdminLogPage from "../components/adminlogpage";
import AdminProgramList from "../components/adminprogrampage";
import AdminDatabase from "../components/admindatabase";
import AdminOverload from "../components/adminoverload";
import AdminInstituteList from "../components/admininstitute";
import ValgemneKategoriForm from "../components/valgemnekategoriform";

const Admin = () => {
  const [activePage, setActivePage] = useState("welcome");
  const { isAuthenticated } = useAuth();

  return (
    <div className="container py-4">
      <div>
        {isAuthenticated ? (
          <div className="row">
            <div className="col-12 col-md-3">
              <h1 className="mb-3 text-center">Admin Panel</h1>
              <div className="d-flex flex-column gap-2">
                <button
                  className={`btn ${activePage === "userList" ? "btn-secondary" : "btn-outline-secondary"}`}
                  onClick={() => setActivePage("userList")}
                >
                  Brukerliste
                </button>
                <button
                  className={`btn ${activePage === "logs" ? "btn-secondary" : "btn-outline-secondary"}`}
                  onClick={() => setActivePage("logs")}
                >
                  Loggside
                </button>
                <button
                  className={`btn ${activePage === "programs" ? "btn-secondary" : "btn-outline-secondary"}`}
                  onClick={() => setActivePage("programs")}
                >
                  Studieprogramliste
                </button>
                <button
                  className={`btn ${activePage === "institutes" ? "btn-secondary" : "btn-outline-secondary"}`}
                  onClick={() => setActivePage("institutes")}
                >
                  Institutter
                </button>
                <button
                  className={`btn ${activePage === "valgemneKategorier" ? "btn-secondary" : "btn-outline-secondary"}`}
                  onClick={() => setActivePage("valgemneKategorier")}
                >
                  Valgemne kategorier
                </button>
                <button
                  className={`btn ${activePage === "backups" ? "btn-secondary" : "btn-outline-secondary"}`}
                  onClick={() => setActivePage("backups")}
                >
                  Database Backups
                </button>
              </div>
            </div>
            <div className="col-12 col-md-9">
              {activePage === "welcome" && (
                <div> Velkommen til administratorsiden</div>
              )}
              {activePage === "userList" && <AdminUserList />}
              {activePage === "logs" && <AdminLogPage />}
              {activePage === "programs" && <AdminProgramList />}
              {activePage === "overloadedprograms" && <AdminOverload />}
              {activePage === "valgemneKategorier" && <ValgemneKategoriForm />}
              {activePage === "institutes" && <AdminInstituteList />}
              {activePage === "backups" && <AdminDatabase />}
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default Admin;
