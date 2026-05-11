#  Studieplanrevisjon V26

Et moderne system for håndtering, administrasjon og revisjon av studieplaner.

---

## Sammendrag

Studieplanrevisjon V26 er en videreutvikling av et system opprinnelig utviklet som en bacheloroppgave ved Universitetet i Stavanger. Systemet er utviklet for å forenkle og automatisere den årlige studieplanrevisjonen ved UiS, og erstatter en tidkrevende manuell prosess basert på regneark og dokumenter.

Systemet gir administratorer og fagansvarlige et felles verktøy for å administrere emner, studieprogram og studieplaner. Det varsler automatisk berørte parter når endringer i ett studieprogram påvirker andre, og støtter eksport av studieplaner til Word-format.

I denne versjonen er følgende forbedringer og ny funksjonalitet innført:
- FEIDE-innlogging for sikker og sentralisert autentisering
- Docker-basert oppsett for enkel og reproduserbar distribusjon
- Migrering fra SQLite til PostgreSQL
- Støtte for emnepakker og spesialiseringer
- Versjonshistorikk for emner
- Forbedret grensesnitt og navigasjon

---

##  Forutsetninger

- Docker må være installert på systemet før prosjektet kan kjøres.

---

##  Kom i gang

### 1. Klargjør miljøet

- Opprett .env fil i root mappen.  
- Kopier over og fyll inn feltene fra den vedlakte eksempelfilen (env_example.txt). 
- For å gi en bruker administratortilgang ved første innlogging, legg til e-postadressen i `ADMIN_USERS` feltet i `.env` filen. 
    - Administratortilgang kan senere administreres via admin-panelet i applikasjonen.
- Sett `DEBUG=False` i produksjonsmiljø. DEBUG-modus omgår FEIDE-autentisering og oppretter testbrukere, og skal kun brukes under utvikling.
---

### 2. Start prosjektet med Docker

Fra prosjektets rotmappe:

```bash
docker compose build
docker compose up
```

Dette starter:
-  Frontend
-  Backend
-  Database

Førstegangsoppsett tar lengre tid, siden Docker-miljøet skal settes opp og databasen skal seedes med data.
---

##  Administratorfunksjoner

Administratorer har utvidet tilgang til systemet og kan:

-  Se og analysere systemlogger
-  Slette eller promotere brukere til administrator
-  Opprette og administrere valgfagkategorier
-  Administrere database:
    - Ta backups
    - Gjenopprette fra backups

---

## Nyttige kommandoer

| Handling                 | Kommando                 |
|--------------------------|--------------------------|
| Bygg alle tjenester      | `docker compose build`   |
| Start alle tjenester     | `docker compose up`      |
| Stoppe alle tjenester    | `docker compose down`    |
| Slette databasevolum     | `docker compose down -v` |
| Se logger                | `docker compose logs -f` |

Merk: `docker compose down -v` sletter databasen permanent. All data må seedes på nytt etterpå.
---

## Teknologier

- Docker 
- Frontend (React)
- Backend (Flask)
- database (Postgres) 

---


## Prosjektstruktur

```


|   .dockerignore
|   .env
|   .gitignore
|   docker-compose.yml
|   env_example.txt
|   README.md
|   STRUCTURE.txt
|
+---backend
|   |   app.py
|   |   Dockerfile
|   |   requirements.txt
|   |
|   +---app
|   |       config.py
|   |       models.py
|   |       __init__.py
|   |
|   +---migrations
|   |   |   alembic.ini
|   |   |   env.py
|   |   |   script.py.mako
|   |
|   +---routes
|   |       backup_routes.py
|   |       coursepackage_routes.py
|   |       course_routes.py
|   |       exporttodocx_routes.py
|   |       institute_routes.py
|   |       notifications_routes.py
|   |       prerequisites_routes.py
|   |       semestercourses_routes.py
|   |       studyplan_routes.py
|   |       studyprogram_routes.py
|   |       user_routes.py
|   |
|   +---scripts
|   |       backup.py
|   |       generateTestUsers.py
|   |       seed.py
|   |       seed_semesters.py
|   |
|   +---services
|   |       course.py
|   |       coursepackage.py
|   |       notifications.py
|   |       prerequisite.py
|   |       semester.py
|   |       semestercourses.py
|   |       service_factory.py
|   |       studyplan.py
|   |       studyprogram.py
|   |       user.py
|   |       __init__.py
|   |
|   \---static
|           cleaned_prerequisites.xlsx
|           Data.xlsx
|           DataMedEmnerFraTNSVUH.xlsx
|           Emnekombinasjoner_med_id.xlsx
|           StudyprogramCode_Year.xlsx
|           test.xlsx
|
+---frontend
|   |   .gitignore
|   |   Dockerfile
|   |   package-lock.json
|   |   package.json
|   |
|   +---public
|   |       favicon.ico
|   |       index.html
|   |       logo192.png
|   |       logo512.png
|   |       manifest.json
|   |       robots.txt
|   |       uis_logo.jpg
|   |
|   \---src
|       |   api.js
|       |   App.js
|       |   index.js
|       |   reportWebVitals.js
|       |
|       +---components
|       |       addprerequisites.js
|       |       admindatabase.js
|       |       adminlogpage.js
|       |       adminoverload.js
|       |       adminprogrampage.js
|       |       adminuserlist.js
|       |       conflictsummary.js
|       |       createcourseform.js
|       |       createfollowupform.js
|       |       createstudyprogramform.js
|       |       DraggableCourse.js
|       |       DroppableSemester.js
|       |       filtercourse.js
|       |       handledragdrop.js
|       |       inbox.js
|       |       navbar.js
|       |       notifications.js
|       |       programoverview.js
|       |       protectedroute.js
|       |       searchCourses.js
|       |       semesterDisplay.js
|       |       valgemne.js
|       |       valgemnekategoriform.js
|       |       validateuser.js
|       |
|       +---hooks
|       |       studyplanData.js
|       |
|       +---pages
|       |       admin.js
|       |       coursedetails.js
|       |       courses.js
|       |       createsp.js
|       |       editcourse.js
|       |       editstudyprogram.js
|       |       generatestudyplan.js
|       |       home.js
|       |       login.js
|       |       studyprogramdetail.js
|       |
|       +---styles
|       |       App.css
|       |       dragdrop.css
|       |       index.css
|       |       notifications.css
|       |
|       \---utils
|               categoryHelpers.js
|               checkforconflicts.js
|               courseHelpers.js
|               CoursesContext.js
|               fetchHelpers.js
|               helpers.js
|               payloadHelpers.js
|               programContext.js
|
\---instance
    \---backups
            backup_20260423_022635.sql
            backup_20260423_132205.sql
            backup_20260423_172527.sql

```
