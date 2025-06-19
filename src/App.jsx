import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";

export default function App() {
  const [image, setImage] = useState(null);
  const [bgColor, setBgColor] = useState("white");
  const [textColor, setTextColor] = useState("white");
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [fontFamily, setFontFamily] = useState("sans-serif");
  const [fontSize, setFontSize] = useState(20);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const previewRef = useRef();
  const textRef = useRef();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const downloadImage = async () => {
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current, { scale: 2 });
    const link = document.createElement("a");
    link.download = "quote-me.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const startDrag = (clientX, clientY) => {
    if (!textRef.current) return;
    const rect = textRef.current.getBoundingClientRect();
    setOffset({ x: clientX - rect.left, y: clientY - rect.top });
    setIsDragging(true);
  };

  const moveDrag = (clientX, clientY) => {
    if (!isDragging || !previewRef.current) return;
    const containerRect = previewRef.current.getBoundingClientRect();
    const x = clientX - containerRect.left - offset.x;
    const y = clientY - containerRect.top - offset.y;
    setPosition({ x, y });
  };

  const handleMouseDown = (e) => startDrag(e.clientX, e.clientY);
  const handleMouseMove = (e) => moveDrag(e.clientX, e.clientY);
  const handleTouchStart = (e) =>
    startDrag(e.touches[0].clientX, e.touches[0].clientY);
  const handleTouchMove = (e) => {
    e.preventDefault();
    moveDrag(e.touches[0].clientX, e.touches[0].clientY);
  };

  const stopDrag = () => setIsDragging(false);

  useEffect(() => {
    const options = { passive: false };
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", stopDrag);
      window.addEventListener("touchmove", handleTouchMove, options);
      window.addEventListener("touchend", stopDrag);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchmove", handleTouchMove, options);
      window.removeEventListener("touchend", stopDrag);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchmove", handleTouchMove, options);
      window.removeEventListener("touchend", stopDrag);
    };
  }, [isDragging]);

  const bgOptions = ["bg-white", "bg-gray-200", "bg-gray-700", "bg-black"];
  const textColors = ["white", "black", "gray", "yellow"];
  const fonts = [
    { name: "Sans Serif", value: "sans-serif" },
    { name: "Serif", value: "serif" },
    { name: "Monospace", value: "monospace" },
    { name: "Cursive", value: "'Dancing Script', cursive" },
    { name: "Elegant Serif", value: "'Playfair Display', serif" },
    { name: "Roboto", value: "'Roboto', sans-serif" },
  ];

  return (
    <div className={`${isDarkMode ? "dark" : ""} w-full`}>
      <div className="min-h-screen white dark:bg-gray-900 p-4 flex flex-col items-center text-black dark:text-white transition-colors duration-300">
        <div className="w-full flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold">Quote Me</h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="px-2 py-1 text-sm border rounded dark:border-gray-500"
          >
            {isDarkMode ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>

        <div className="flex flex-col gap-2 w-3/4">
          <textarea
            rows="3"
            className="p-2 border rounded resize-none dark:bg-gray-800 dark:border-gray-600"
            placeholder="Enter the quote..."
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
          />
          <input
            type="text"
            className="p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
            placeholder="Author's name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>

        <div className="mt-4 w-2/4">
          <p className="font-semibold mb-1">Background Color:</p>
          <div className="flex gap-2">
            {bgOptions.map((bg) => (
              <button
                key={bg}
                onClick={() => {
                  if (image) setImage(null);
                  setBgColor(bg);
                }}
                className={`${bg} w-8 h-8 rounded-full border-2 border-gray-300`}
              />
            ))}
          </div>
          <div className="mt-4 font-bold">
            OR
          </div>
          <div className="mt-4 ">
          <p className="font-semibold mb-1">Background Image:</p>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              </div>
        </div>

        <div className="mt-4 w-2/4">
          <p className="font-semibold mb-1">Text Color:</p>
          <div className="flex gap-2">
            {textColors.map((color) => (
              <button
                key={color}
                onClick={() => setTextColor(color)}
                style={{ backgroundColor: color }}
                className="w-8 h-8 rounded-full border-2 border-gray-300"
              />
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="font-semibold mb-1">Font Style:</p>
          <select
            onChange={(e) => setFontFamily(e.target.value)}
            className="p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
          >
            {fonts.map((f) => (
              <option
                key={f.value}
                value={f.value}
                style={{ fontFamily: f.value }}
              >
                {f.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 w-2/4 ">
          <p className="font-semibold mb-1">Font Size: {fontSize}px</p>
          <input
            type="range"
            min="12"
            max="48"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div
          ref={previewRef}
          className={`relative mt-6 w-full max-w-md aspect-[4/5] overflow-hidden shadow-md text-center ${
            !image ? bgColor : ""
          }`}
        >
          {image && (
            <img
              src={image}
              alt="Selected"
              className="absolute w-full h-full object-cover"
            />
          )}
          {(quote || author) && (
            <div
              ref={textRef}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              className="absolute cursor-move p-4"
              style={{
                left: position.x,
                top: position.y,
                color: textColor,
                fontFamily,
                fontSize: `${fontSize}px`,
                maxWidth: "100%",
              }}
            >
              <p className="whitespace-pre-line font-semibold">{quote}</p>
              {author && (
                <p className="text-sm font-light italic mt-2">— {author}</p>
              )}
            </div>
          )}
        </div>

        <button
          onClick={downloadImage}
          className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Download Quote Image
        </button>
        <p>osh_la</p>
      </div>
     
    </div>
  );
}
