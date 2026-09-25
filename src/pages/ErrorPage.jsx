import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function ErrorPage() {
  const navigate = useNavigate();

  const handleBackHome = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <main className="error-page">
      {/* Background sky */}
      <div className="error-sky">
        <div className="error-moon" />

        <span className="error-star error-star-1" />
        <span className="error-star error-star-2" />
        <span className="error-star error-star-3" />
        <span className="error-star error-star-4" />
        <span className="error-star error-star-5" />
        <span className="error-star error-star-6" />

        <span className="error-bird error-bird-1" />
        <span className="error-bird error-bird-2" />
        <span className="error-bird error-bird-3" />

        <div className="error-cloud error-cloud-1" />
        <div className="error-cloud error-cloud-2" />

        <div className="error-horizon" />
      </div>

      {/* Error message */}
      <div className="error-content">
        <span className="error-eyebrow">PAGE NOT FOUND</span>

        <h1>404</h1>

        <p>
          Looks like this little corner of instant
          <br />
          doesn't exist.
        </p>

        <button
          type="button"
          className="error-home-button"
          onClick={handleBackHome}
        >
          <ArrowLeft size={16} strokeWidth={1.8} />
          <span>BACK TO HOME</span>
        </button>
      </div>
    </main>
  );
}

export default ErrorPage;
