import Programoverview from "../components/programoverview";
import { useAuth } from "../components/validateuser";
import Inbox from "../components/inbox";

const Home = () => {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <div className="container py-4">
      
      {/* Header / Welcome */}
      <div className="mb-4">
        <h1 className="fw-semibold text-primary">
          Velkommen{currentUser?.name ? `, ${currentUser.name}` : ""}
        </h1>
        <p className="text-muted mb-0">
          Administrer emner, studieprogrammer og studieplaner fra ett sted.
        </p>
      </div>

      {/* Layout */}
      <div className="row g-4">
        
        {/* Main content */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">Dine studieprogrammer</h5>
              <Programoverview userId={currentUser.feide_id} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <Inbox userId={currentUser.feide_id} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;