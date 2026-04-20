import React, { useState } from "react";
import { useAuth } from "../components/validateuser";
import AdminUserList from "../components/adminuserlist";
import AdminLogPage from "../components/adminlogpage";
import AdminProgramList from "../components/adminprogrampage";
import AdminOverload from "../components/adminoverload";
import ValgemneKategoriForm from "../components/valgemnekategoriform";

const Admin = () => {

    const [activePage, setActivePage] = useState('welcome');
    const { currentUser, isAuthenticated } = useAuth()

    return (
        <div className="container py-4">
            <div>{isAuthenticated ? (
                <div className="row">
                    <div className="col-12 col-md-3">
                        <h1 className="mb-3 text-center">Admin Panel</h1>
                        <div className="d-flex flex-column gap-2">
                            <button
                                className={`btn ${activePage === 'userList' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => setActivePage('userList')}>
                                Brukerliste</button>
                            <button
                                className={`btn ${activePage === 'logs' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => setActivePage('logs')}>
                                Loggside</button>
                            <button
                                className={`btn ${activePage === 'programs' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => setActivePage('programs')}>
                                Studieprogramliste</button>
                            <button
                                className={`btn ${activePage === 'valgemneKategorier' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => setActivePage('valgemneKategorier')}>
                                Valgemne kategorier</button>
                        </div>
                    </div>
                    <div className="col-12 col-md-9">
                        {activePage === 'welcome' && <div> Velkommen til admininistatorsiden</div>}
                        {activePage === 'userList' && <AdminUserList />}
                        {activePage === 'logs' && <AdminLogPage />}
                        {activePage === 'programs' && <AdminProgramList />}
                        {activePage === 'overloadedprograms' && <AdminOverload />}
                        {activePage === 'valgemneKategorier' && <ValgemneKategoriForm />}
                    </div>
                </div>
            ) :
                <div></div>}
            </div>
        </div>
    )
}

export default Admin