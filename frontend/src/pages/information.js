import React, { useState } from "react";

const Information = () => {
    const [activePage, setActivePage] = useState("oversikt");

    return (
        <div className="container py-4">
            <div className="row">
                <div className="col-12 col-md-3">
                    <h1 className="mb-3 text-centerd">Brukerveildening</h1>
                    <div className="d-flex flex-column gap-2">
                        <button
                            className={`btn ${activePage === 'overview' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                            onClick={() => setActivePage('overview')}>
                            Oversikt</button>
                        <button
                            className={`btn ${activePage === 'courses' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                            onClick={() => setActivePage('courses')}>
                            Emner</button>
                        <button
                            className={`btn ${activePage === 'stydyPrograms' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                            onClick={() => setActivePage('stydyPrograms')}>
                            Studieprogram</button>
                    </div>
                </div>

                <div className="col-12 col-md-9">
                    {activePage === 'overview' && (
                        <div>
                            <h4 className="mb-3">Oversikt</h4>
                            <p>Skriv innhold her.</p>
                        </div>
                    )}
                    {activePage === 'courses' && (
                        <div>
                            <h4 className="mb-3">Emner</h4>
                            <p>Skriv innhold her.</p>
                        </div>
                    )}
                    {activePage === 'stydyPrograms' && (
                        <div>
                            <h4 className="mb-3">Studieprogram</h4>
                            <p>Skriv innhold her.</p>
                        </div>
                    )}

                </div>

            </div>
        </div>
    )

}

export default Information