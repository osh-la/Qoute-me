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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const bgOptions = [
    "bg-white",
    "bg-black",
    "[background-color:#075E54]",
    "[background-color:#FFD580]",
    "[background-color:#E0A96D]",
    "[background-color:#9A7AA0]",
    "[background-color:#A3C1AD]",
    "[background-color:#F4A261]",
    "[background-color:#CDB699]",
    "[background-color:#89CFF0]",
    "[background-color:#E5989B]",
  ];

  const textColors = [
    "white",
    "black",
    "gray",
    "yellow",
    "orange",
    "red",
    "blue",
    "green",
    "purple",
    "pink",
    "brown",
    "teal",
    "indigo",
    "lime",
    "cyan",
    "#A0522D",
    "#FF69B4",
    "#4B0082",
    "#2E8B57",
    "#DAA520",
    "#F5F5DC",
    "#D2691E",
    "#40E0D0",
    "#E6E6FA",
    "#FFD700",
  ];

  const fonts = [
    { name: "Sans Serif", value: "sans-serif" },
    { name: "Serif", value: "serif" },
    { name: "Monospace", value: "monospace" },
    { name: "Cursive", value: "'Dancing Script', cursive" },
    { name: "Elegant Serif", value: "'Playfair Display', serif" },
    { name: "Roboto", value: "'Roboto', sans-serif" },
    { name: "Poppins", value: "'Poppins', sans-serif" },
    { name: "Inter", value: "'Inter', sans-serif" },
    { name: "Montserrat", value: "'Montserrat', sans-serif" },
    { name: "Raleway", value: "'Raleway', sans-serif" },
    { name: "Lora", value: "'Lora', serif" },
    { name: "Merriweather", value: "'Merriweather', serif" },
    { name: "Nunito", value: "'Nunito', sans-serif" },
    { name: "Open Sans", value: "'Open Sans', sans-serif" },
    { name: "Source Sans Pro", value: "'Source Sans Pro', sans-serif" },
    { name: "Manrope", value: "'Manrope', sans-serif" },
    { name: "Josefin Sans", value: "'Josefin Sans', sans-serif" },
    { name: "Quicksand", value: "'Quicksand', sans-serif" },
    { name: "Great Vibes", value: "'Great Vibes', cursive" },
    { name: "Pacifico", value: "'Pacifico', cursive" },
    { name: "Bebas Neue", value: "'Bebas Neue', sans-serif" },
    { name: "Oswald", value: "'Oswald', sans-serif" },
    { name: "Rubik", value: "'Rubik', sans-serif" },
    { name: "Playpen Sans", value: "'Playpen Sans', cursive" },
  ];

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="bg-blue-600 p-6 w-full flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">QuoteMe</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="px-3 py-1 text-sm bg-white text-blue-600 rounded dark:bg-gray-700 dark:text-white transition"
          >
            {isDarkMode ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>

      <div className="min-h-screen flex flex-col md:flex-row dark:bg-gray-900 text-black dark:text-white transition-colors duration-300 relative">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden bg-blue-600 text-white px-3 py-2 rounded shadow fixed top-20 left-0 z-50"
        >
          {isSidebarOpen ? "Close" : "Open"}
        </button>

        <aside
          className={`fixed md:static z-20 top-0 left-0 h-full md:h-auto w-3/4 sm:w-1/2 md:w-1/4 bg-gray-100 dark:bg-gray-800 p-6 border-r dark:border-gray-700 transform transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <div className="flex justify-end">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden mb-4 text-sm bg-blue-600 text-white px-2 py-1 rounded"
            >
              ✕ Close
            </button>
          </div>

          <div>
            <p className="font-semibold mb-1">Background Color:</p>
            <div className="flex flex-wrap gap-2">
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
            <div className="mt-4 font-bold text-center">OR</div>
            <div className="mt-4">
              <p className="font-semibold mb-1">Background Image:</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <div className="mt-4">
            <p className="font-semibold mb-1">Text Color:</p>
            <div className="flex flex-wrap gap-2">
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
              className="p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600"
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

          <div className="mt-4">
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
        </aside>
        <main className="flex-1 flex flex-col items-center justify-start p-6 md:ml-0">
          <div className="flex flex-col gap-2 w-full max-w-lg">
            <textarea
              rows="3"
              className="p-2 border rounded resize-none dark:bg-gray-800 dark:border-gray-600"
              placeholder="Enter quote..."
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
        </main>
      </div>

      <footer className="flex justify-center items-center h-40 bg-blue-500 text-white">
        <p>osh_la</p>
      </footer>
    </div>
  );
}
