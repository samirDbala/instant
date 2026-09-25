import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function Gallery() {
  const navigate = useNavigate();

  return (
    <main className="gallery-page">
      {/* Night sky illustration */}
      <div className="gallery-sky" aria-hidden="true">
        <span className="gallery-star star-1" />
        <span className="gallery-star star-2" />
        <span className="gallery-star star-3" />
        <span className="gallery-star star-4" />
        <span className="gallery-star star-5" />
        <span className="gallery-star star-6" />

        <span className="gallery-moon" />

        <span className="gallery-bird bird-1" />
        <span className="gallery-bird bird-2" />
        <span className="gallery-bird bird-3" />

        <span className="gallery-cloud cloud-1" />
        <span className="gallery-cloud cloud-2" />
        <span className="gallery-horizon" />
      </div>

      {/* Main message */}
      <section className="gallery-message">
        <span className="gallery-eyebrow">YOUR COLLECTION</span>

        <h1>
          Some things
          <br />
          take a little time.
        </h1>

        <p>
          Your gallery is still being built.
          <br />
          Come back soon — your memories will
          <br />
          have a place to stay.
        </p>

        <button
          type="button"
          className="gallery-home-button"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={16} strokeWidth={1.8} />
          BACK HOME
        </button>
      </section>
    </main>
  );
}

export default Gallery;
