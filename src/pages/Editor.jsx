import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { Download, RotateCcw, Pencil, ChevronDown } from "lucide-react";
import html2canvas from "@html2canvas/html2canvas";

function Editor() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const printRef = useRef(null);

  const savedEditor = JSON.parse(
    sessionStorage.getItem("instantEditor") || "null",
  );

  const hasEditorSession = savedEditor?.image || location.state?.uploadedImage;
  if (!hasEditorSession) {
    return <Navigate to="/" replace />;
  }

  const [image, setImage] = useState(
    location.state?.uploadedImage || savedEditor?.image || null,
  );

  const [note, setNote] = useState(
    savedEditor?.note !== undefined ? savedEditor.note : "out in the darkness",
  );

  const [zoom, setZoom] = useState(savedEditor?.zoom || 1);

  const [font, setFont] = useState(savedEditor?.font || "Patrick Hand");

  const [fontOpen, setFontOpen] = useState(false);

  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".font-picker")) {
        setFontOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const [imagePosition, setImagePosition] = useState(
    savedEditor?.imagePosition || {
      x: 50,
      y: 50,
    },
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      sessionStorage.setItem(
        "instantEditor",
        JSON.stringify({
          image,
          note,
          zoom,
          font,
          imagePosition,
        }),
      );
    }, 150);

    return () => clearTimeout(timeout);
  }, [image, note, zoom, font, imagePosition]);

  const dragStartRef = useRef(null);

  // Home page image from the public folder
  const homeImage = "/instant-hero.jpg";

  // Uploaded image, otherwise home image
  const displayImage = image || homeImage;

  // Open file picker
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Start dragging
  const handleImagePointerDown = (event) => {
    event.preventDefault();

    event.currentTarget.setPointerCapture(event.pointerId);

    dragStartRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startPositionX: imagePosition.x,
      startPositionY: imagePosition.y,
    };
  };

  // Move image while dragging
  const handleImagePointerMove = (event) => {
    if (!dragStartRef.current) return;

    const photo = event.currentTarget;
    const rect = photo.getBoundingClientRect();

    const deltaX = event.clientX - dragStartRef.current.startX;
    const deltaY = event.clientY - dragStartRef.current.startY;

    const movementX = (deltaX / rect.width) * 100;
    const movementY = (deltaY / rect.height) * 100;

    const newX = Math.max(
      0,
      Math.min(100, dragStartRef.current.startPositionX - movementX),
    );

    const newY = Math.max(
      0,
      Math.min(100, dragStartRef.current.startPositionY - movementY),
    );

    setImagePosition({
      x: newX,
      y: newY,
    });
  };

  // Stop dragging
  const handleImagePointerUp = (event) => {
    if (dragStartRef.current) {
      try {
        event.currentTarget.releasePointerCapture(
          dragStartRef.current.pointerId,
        );
      } catch {
        // Pointer capture may already be released.
      }
    }

    dragStartRef.current = null;
  };

  // Upload image
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
      setNote("out in the darkness");
      setZoom(1);
      setFont("Patrick Hand");
      setImagePosition({
        x: 50,
        y: 50,
      });

      navigate("/editor", {
        state: {
          uploadedImage: reader.result,
        },
      });
    };

    reader.readAsDataURL(file);
  };

  // Reset everything
  const handleReset = () => {
    setNote("out in the darkness");
    setZoom(1);
    setFont("Patrick Hand");
    setFontOpen(false);

    setImagePosition({
      x: 50,
      y: 50,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Download
  const handleDownload = async () => {
    if (isDownloading || !printRef.current) return;

    setIsDownloading(true);

    try {
      const canvas = await html2canvas(printRef.current, {
        backgroundColor: "#ffffff",
        scale: 3,
        useCORS: true,
        logging: false,
      });

      canvas.toBlob((blob) => {
        if (!blob) {
          setIsDownloading(false);
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `instant-${Date.now()}.png`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
        setIsDownloading(false);
      }, "image/png");
    } catch (error) {
      console.error("Could not download print:", error);
      setIsDownloading(false);
    }
  };

  return (
    <main className="editor-page">
      <div className="editor-layout">
        {/* Instant Preview */}
        <section className="editor-preview-section">
          <div ref={printRef} className="instant-frame">
            <div
              className="instant-photo"
              onPointerDown={handleImagePointerDown}
              onPointerMove={handleImagePointerMove}
              onPointerUp={handleImagePointerUp}
              onPointerCancel={handleImagePointerUp}
              onPointerLeave={() => {
                // Do not cancel the drag here.
                // Pointer capture keeps dragging active.
              }}
            >
              <img
                src={displayImage}
                alt="Instant print preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: `${imagePosition.x}% ${imagePosition.y}%`,
                }}
                draggable={false}
              />
            </div>

            <div className="instant-caption">
              <span
                className="instant-caption-text"
                style={{
                  transform: `scale(${zoom})`,
                  fontFamily: `"${font}", cursive`,
                }}
              >
                {note}
              </span>
            </div>
          </div>
        </section>

        {/* Editor Panel */}
        <section className="editor-panel">
          {/* Heading */}
          <div className="editor-heading">
            <span className="editor-eyebrow">PHOTO UPLOADED SUCCESSFULLY</span>

            <h1>
              Your instant print is
              <br />
              ready
            </h1>
          </div>

          {/* Editor Options */}
          <div className="editor-options">
            {/* Note */}
            <label className="editor-label" htmlFor="note-input">
              ADD HANDWRITTEN NOTE
            </label>

            <div className="note-input-wrapper">
              <input
                id="note-input"
                type="text"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Write something..."
                maxLength={34}
              />

              <span className="note-pencil">
                <Pencil size={17} strokeWidth={1.8} />
              </span>
            </div>

            <div className="font-picker">
              <button
                type="button"
                className="font-picker-trigger"
                onClick={() => setFontOpen((open) => !open)}
                aria-expanded={fontOpen}
              >
                <span className="font-picker-label">FONT</span>

                <span className="font-picker-value">
                  {font}

                  <ChevronDown
                    size={14}
                    strokeWidth={1.6}
                    className={
                      fontOpen ? "font-chevron is-open" : "font-chevron"
                    }
                  />
                </span>
              </button>

              {fontOpen && (
                <div className="font-picker-menu">
                  {[
                    "Patrick Hand",
                    "Caveat",
                    "Kalam",
                    "Handlee",
                    "Indie Flower",
                    "Shadows Into Light",
                    "Covered By Your Grace",
                    "Homemade Apple",
                    "Nothing You Could Do",
                    "Reenie Beanie",
                    "Sacramento",
                    "Zeyada",
                  ].map((fontOption) => (
                    <button
                      key={fontOption}
                      type="button"
                      className={
                        font === fontOption
                          ? "font-option is-selected"
                          : "font-option"
                      }
                      onClick={() => {
                        setFont(fontOption);
                        setFontOpen(false);
                      }}
                      style={{ fontFamily: `"${fontOption}", cursive` }}
                    >
                      {fontOption}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Text Zoom */}
            <label className="editor-label zoom-label">ZOOM</label>

            <input
              type="range"
              className="zoom-slider"
              min="1"
              max="1.4"
              step="0.01"
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              style={{
                background: `linear-gradient(
                  to right,
                  #1a1a1a 0%,
                  #1a1a1a ${((zoom - 1) / (1.4 - 1)) * 100}%,
                  #eeeeeb ${((zoom - 1) / (1.4 - 1)) * 100}%,
                  #eeeeeb 100%
                )`,
              }}
              aria-label="Adjust handwritten note size"
            />

            <p className="editor-help-text">
              This note will be printed on the bottom of your photo in a
              realistic ink style.
            </p>
          </div>

          {/* Actions */}
          <div className="editor-actions">
            <button
              type="button"
              className="editor-download-button"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              <Download size={17} strokeWidth={1.8} />
              {isDownloading ? "DOWNLOADING..." : "DOWNLOAD PRINT"}
            </button>

            <button
              type="button"
              className="editor-secondary-button"
              onClick={handleReset}
            >
              <RotateCcw size={16} strokeWidth={1.8} />
              START OVER
            </button>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="editor-file-input"
            onChange={handleFileChange}
          />
        </section>
      </div>
    </main>
  );
}

export default Editor;
