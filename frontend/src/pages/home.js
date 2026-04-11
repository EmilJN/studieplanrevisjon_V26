import { Link } from "react-router-dom";

const Home = () => {
  const links = [
    {
      to: "createcourse",
      title: "Lag et nytt emne eller valgemne kategori",
      info: "",
    },
    { to: "createstudyprogram", title: "Lag et nytt studieprogram", info: "" },
    {
      to: "editstudyprogram",
      title: "Rediger et studieprogram",
      info: "Rediger informasjon til studieprogram",
    },
    {
      to: "courses",
      title: "Oversikt over emner",
      info: "Se og endre informasjon til emner",
    },
    {
      to: "studyprogram",
      title: "Studieplaner",
      info: "Se studieplaner til studieprogram",
    },
  ];

  return (
    <div className="container mt-4">
      <div className="row g-4">
        {links.map((link) => (
          <div className="col-sm-6 col-lg-4" key={link.to}>
            <Link to={link.to} className="text-decoration-none">
              <div className="card h-100 shadow-sm border-primary">
                <div className="card-body">
                  <h5 className="card-title text-primary">{link.title}</h5>
                  {link.info && (
                    <p className="card-text text-muted">{link.info}</p>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
