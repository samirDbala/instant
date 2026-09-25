import { useRef } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";

function Home() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [heroIndex, setHeroIndex] = useState(() => {
    const savedIndex = sessionStorage.getItem("heroIndex");

    return savedIndex !== null ? Number(savedIndex) : 0;
  });

  const heroImages = [
    "/instant-hero.jpg",
    "/instant-hero1.jpg",
    "/instant-hero2.jpg",
  ];

  useEffect(() => {
    sessionStorage.setItem("heroIndex", heroIndex);
  }, [heroIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroImages.length);
    }, 6500);

    return () => clearInterval(interval);
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      navigate("/editor", {
        state: {
          uploadedImage: reader.result,
        },
      });
    };

    reader.readAsDataURL(file);
  };

  return (
    <main className="home-page">
      <div className="home-content">
        <div className="home-hero-image-wrapper">
          {heroImages.map((image, index) => (
            <img
              key={image}
              src={image}
              alt="Instant photo"
              className={`home-hero-image ${
                index === heroIndex ? "is-active" : ""
              }`}
            />
          ))}
        </div>

        <h1>Make it instant</h1>

        <p>Upload a photo and turn it into a square instant print.</p>

        <button
          type="button"
          className="upload-button"
          onClick={handleUploadClick}
        >
          <span>UPLOAD PHOTO</span>

          <Upload className="upload-icon" size={18} strokeWidth={2} />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="editor-file-input"
          onChange={handleFileChange}
        />
      </div>
    </main>
  );
}

export default Home;
