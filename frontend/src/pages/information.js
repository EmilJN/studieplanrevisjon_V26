import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Information = () => {
    const [activePage, setActivePage] = useState("overview");
    const navigate = useNavigate();

    return (
        <div className="container py-4">
            <div className="row">
                <div className="col-12 col-md-3">
                    <h1 className="mb-3 text-center">Brukerveiledning</h1>
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
                            className={`btn ${activePage === 'studyPrograms' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                            onClick={() => setActivePage('studyPrograms')}>
                            Studieprogram</button>
                        <button
                            className={`btn ${activePage === 'studyPlan' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                            onClick={() => setActivePage('studyPlan')}>
                            Studieplan</button>
                    </div>
                </div>

                <div className="col-12 col-md-9">

                    {activePage === 'overview' && (
                        <div>
                            <h4 className="mb-3">Oversikt</h4>
                            <p className="text-muted mb-4">
                                Denne applikasjonen brukes til å administrere emner, studieprogram og studieplaner.
                                Bruk menyen til venstre for å navigere mellom de ulike delene av veiledningen.
                            </p>

                            <h5 className="fw-semibold">Hva kan du gjøre i applikasjonen?</h5>
                            <ul>
                                <li><strong>Emner</strong> - Se, søk og rediger emner. Legg til nye emner og administrer forkunnskaper og relasjoner.</li>
                                <li><strong>Studieprogram</strong> - Opprett og rediger studieprogram med navn, kode, nivå og tilhørende institutt.</li>
                                <li><strong>Studieplan</strong> - Bygg og rediger studieplaner semester for semester. Bruk dra og slipp for å flytte emner, og organiser dem i pakker.</li>
                            </ul>
                        </div>
                    )}

                    {activePage === 'courses' && (
                        <div>
                            <h3 className="mb-1">Emner</h3>
                            <p className="text-muted mb-4">
                                På <strong>Emner</strong> finner du oversikten over alle emner i systemet. Herfra kan du søke,
                                filtrere, legge til nye emner eller klikke deg inn på enkeltemner for å se detaljer eller redigere.
                            </p>

                            <h5 className="fw-semibold">Søk og filtrer</h5>
                            <p>
                                Søk etter emner på navn eller emnekode. Bruk filterfeltet for å snevre inn resultatene
                                på semester, nivå, versjon eller studiepoeng.
                            </p>

                            <h5 className="fw-semibold">Legge til nytt emne</h5>
                            <p>
                                Klikk <span className="badge bg-primary">Legg til nytt emne</span> for å opprette et nytt emne.
                                Fyll inn emnekode, emnenavn, semester (høst eller vår), studiepoeng og nivå (bachelor eller master),
                                og klikk <span className="badge bg-success">Lagre</span>.
                            </p>

                            <h5 className="fw-semibold">Rediger emne</h5>
                            <p>
                                Åpne et enkeltemne og klikk <span className="badge bg-primary">Rediger emne</span> for å endre detaljene.
                                Du kan velge om du vil lagre endringene direkte på det gjeldende emnet, eller <strong>lagre det som en ny variant</strong> slik
                                at den gamle versjonen fortsatt er tilgjengelig. Versjonshistorikken er synlig under
                                <span className="badge bg-secondary">Tidligere versjoner</span>
                                og <span className="badge bg-secondary">Nyere versjoner</span>
                                på emnesiden.
                            </p>

                            <h5 className="fw-semibold">Forkunnskaper</h5>
                            <p>
                                Inne på et enkeltemne kan du registrere hvilke emner som eventuelt kreves som forkunnskaper.
                                Dette hjelper med å kartlegge avhengigheter på tvers av studieplanene.
                            </p>

                            <h5 className="fw-semibold">Relasjoner</h5>
                            <p>
                                Under hvert emne ser du hvilke studieprogram emnet inngår i,
                                <span className="badge bg-secondary">Blir brukt i</span>, og hvilke andre emner det overlapper
                                innholdsmessig med, <span className="badge bg-secondary">Overlapper med</span>.
                            </p>

                            <button className="btn btn-outline-secondary btn-sm mt-2" onClick={() => navigate('/courses')}>
                                Gå til Emner →
                            </button>
                        </div>
                    )}

                    {activePage === 'studyPrograms' && (
                        <div>
                            <h3 className="mb-1">Studieprogram</h3>
                            <p className="text-muted mb-4">
                                På <strong>Studieprogram</strong> finner du oversikten over alle studieprogrammene i systemet.
                                Herfra kan du søke, filtrere, legge til nye studieprogrammer og se eller endre detaljer.
                            </p>

                            <h5 className="fw-semibold">Søk og filtrer</h5>
                            <p>
                                Søk etter navn på studieprogram, eller bruk filterfeltet for å snevre inn resultatene
                                på nivå, institutt, antall semester og om noen er ansvarlig.
                            </p>

                            <h5 className="fw-semibold">Legge til nytt studieprogram</h5>
                            <p>
                                Klikk <span className="badge bg-primary">Legg til nytt studieprogram</span> for å opprette et nytt program.
                                Fyll inn programkode, navn, nivå (bachelor eller master), hvilket institutt det tilhører og antall semestre.
                            </p>
                            <p>
                                Deretter blir du tatt med videre til å initialisere den første studieplanen. Velg rett årstall og klikk
                                <span className="badge bg-primary">Initialiser studieplan</span>. Les mer om studieplaner
                                <button className="btn btn-link p-0 align-baseline" style={{ fontSize: "inherit" }} onClick={() => setActivePage('studyPlan')}>her</button>.
                            </p>

                            <h5 className="fw-semibold">Rediger studieprogram</h5>
                            <p>
                                Utvid et studieprogram for å se detaljene. Klikk
                                <span className="badge bg-primary">Rediger studieprogram</span> for å endre
                                navn, programkode, nivå og institutt og klikk <span className="badge bg-success">Lagre</span>.
                            </p>

                            <h5 className="fw-semibold">Se studieplaner</h5>
                            <p>
                                Utvid et studieprogram og klikk <span className="badge bg-primary">Rediger studieplaner</span> for å gå
                                til studieplansoversikten. Her ser du programmets emner fordelt på semesterne. Les mer om studieplaner
                                <button className="btn btn-link p-0 align-baseline" style={{ fontSize: "inherit" }} onClick={() => setActivePage('studyPlan')}>her</button>.
                            </p>

                            <button className="btn btn-outline-secondary btn-sm mt-2" onClick={() => navigate('/editstudyprogram')}>
                                Gå til Studieprogram →
                            </button>
                        </div>
                    )}

                    {activePage === 'studyPlan' && (
                        <div>
                            <h3 className="mb-1">Studieplan</h3>
                            <p className="text-muted mb-4">
                                Studieplaner gir en detaljert oversikt over emnene i et studieprogram, fordelt per semester.
                                Du finner studieplanene til et studieprogram ved å klikke <span className="badge bg-primary">Rediger studieplaner</span>.
                            </p>

                            <h5 className="fw-semibold">Årsversjoner</h5>
                            <p>
                                I venstre panel kan du bytte mellom versjoner av studieplanen fra tidligere år.
                            </p>

                            <h5 className="fw-semibold">Rediger studieplan</h5>
                            <p>
                                Klikk <span className="badge bg-primary">Rediger</span> for å gå inn i redigeringsmodus. Her
                                kan du søke etter emner og legge dem til i et semester, eller fjerne eksisterende emner. Slå på
                                <span className="badge bg-secondary">Vis eldre versjoner</span> for å inkludere utdaterte emner i
                                visningen. Du kan også <strong>flytte emner mellom semestrene ved å dra og slippe</strong>. Hvert
                                emne kan også legges til i en pakke via nedtrekksmenyen på emnekortet.
                            </p>

                            <h5 className="fw-semibold">Valgemner</h5>
                            <p>
                                Hvert semester kan ha valgemner i tillegg til faste emner. I redigeringsmodus kan du klikke
                                <span className="badge bg-secondary">Legg til valgemne</span> eller
                                <span className="badge bg-secondary">Administrer valgemne</span> for å åpne dialogen.
                                Her velger du kategori, søker etter emner og legger dem til.
                            </p>
                            <p>Det finnes tre kategorier:</p>
                            <ul>
                                <li><strong>Velg ett emne</strong> - Brukes for emner studenten er pålagt å velge minst ett av.</li>
                                <li><strong>Anbefalte valgemner</strong> - Forslag som passer godt inn i programmet for dette semesteret.</li>
                                <li><strong>Andre valgemner</strong> - Tilleggsalternativer som kan ha forbehold, for eksempel mulige kollisjoner i time- eller eksamensplan.</li>
                            </ul>
                            <p>
                                Utenfor redigeringsmodus kan du bruke <span className="badge bg-primary">Vis valgemner</span> for å
                                se tilgjengelige valgemner per semester.
                            </p>

                            <h5 className="fw-semibold">Pakker</h5>
                            <p>
                                I venstre panel kan du opprette pakker for å organisere emner i studieplanen. Det finnes to pakketyper:
                            </p>
                            <ul>
                                <li><strong>Spesialisering</strong> - En faglig retning innenfor programmet.</li>
                                <li><strong>Emnepakke</strong> - En gruppering av relaterte emner.</li>
                            </ul>
                            <p className="text-muted small">Systemteknisk fungerer disse likt — forskjellen er hvilken etikett som passer best.</p>

                            <h5 className="fw-semibold">Eksporter til Word</h5>
                            <p>
                                Studieplanen kan eksporteres til Word via
                                <span className="badge bg-secondary">Eksporter til word</span>-knappen.
                                Word-dokumentet lastes ned med en gang i nettleseren.
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Information;
