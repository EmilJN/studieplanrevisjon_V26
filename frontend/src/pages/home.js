import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <h1 className="text-primary fw-semibold mb-3">Velkommen</h1>
        <p className="text-muted">
          Her kan du administrere emner og studieprogrammer ved UiS. <br />
          Bruk menyen øverst for å opprette eller redigere studieprogrammer, <br />
          se oversikt over emner, eller administrere studieplaner.
        </p>
      </div>
    </div>
  );
};
export default Home;

