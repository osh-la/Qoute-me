import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'

export default function App() {
  const [image, setImage] = useState(null)
  const [bgColor, setBgColor] = useState('white')
  const [textColor, setTextColor] = useState('white')
  const [quote, setQuote] = useState('')
  const [author, setAuthor] = useState('')
  const [fontFamily, setFontFamily] = useState('sans-serif')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const previewRef = useRef()

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setImage(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const downloadImage = async () => {
    if (!previewRef.current) return
    const canvas = await html2canvas(previewRef.current, { scale: 2 })
    const link = document.createElement('a')
    link.download = 'quote-me.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  const bgOptions = [
    { name: 'White', value: 'bg-white' },
    { name: 'Light Gray', value: 'bg-gray-200' },
    { name: 'Dark Gray', value: 'bg-gray-700' },
    { name: 'Black', value: 'bg-black' },
  ]

  const textColors = [
    { name: 'White', value: 'white' },
    { name: 'Black', value: 'black' },
    { name: 'Gray', value: 'gray' },
    { name: 'Yellow', value: 'yellow' },
  ]

  const fonts = [
    { name: 'Sans Serif', value: 'sans-serif' },
    { name: 'Serif', value: 'serif' },
    { name: 'Monospace', value: 'monospace' },
    { name: 'Cursive', value: "'Dancing Script', cursive" },
    { name: 'Elegant Serif', value: "'Playfair Display', serif" },
    { name: 'Roboto', value: "'Roboto', sans-serif" },
  ]

  return (
    <div className={`${isDarkMode ? 'dark' : ''} w-full`}>
      <div className="min-h-screen bg-gray-200 dark:bg-gray-900 p-4 flex flex-col items-center text-black dark:text-white transition-colors duration-300">
        <div className="w-full flex justify-between items-center max-w-md mb-4">
          <h1 className="text-4xl font-bold">Quote Me</h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="px-2 py-1 text-sm border rounded dark:border-gray-500"
          >
            {isDarkMode ? '☀ Light' : '🌙 Dark'}
          </button>
        </div>

        <div className="flex flex-col gap-2 w-full max-w-md">
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          <textarea
            className="p-2 border rounded resize-none dark:bg-gray-800 dark:border-gray-600"
            rows="3"
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

        <div className="mt-4">
          <p className="font-semibold mb-1">Choose Background Color:</p>
          <div className="flex gap-2">
            {bgOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  if (image) setImage(null)
                  setBgColor(opt.value)
                }}
                className={`${opt.value} w-8 h-8 rounded-full border-2 border-gray-300`}
              />
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="font-semibold mb-1">Choose Text Color:</p>
          <div className="flex gap-2">
            {textColors.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTextColor(opt.value)}
                className="w-8 h-8 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: opt.value }}
              />
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="font-semibold mb-1">Choose Font Style:</p>
          <select
            onChange={(e) => setFontFamily(e.target.value)}
            className="p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
          >
            {fonts.map((font) => (
              <option
                key={font.value}
                value={font.value}
                style={{ fontFamily: font.value }}
              >
                {font.name}
              </option>
            ))}
          </select>
        </div>

        <div
          ref={previewRef}
          className={`relative mt-6 w-full max-w-md aspect-[4/5] overflow-hidden shadow-md rounded ${!image ? bgColor : ''}`}
        >
          {image && (
            <img src={image} alt="Selected" className="absolute w-full h-full object-cover" />
          )}
          {(quote || author) && (
            <div className="absolute inset-0 flex flex-col justify-center p-4 bg-black/30">
              <p
                className="text-xl font-semibold text-center whitespace-pre-line"
                style={{ color: textColor, fontFamily }}
              >
                {quote}
              </p>
              {author && (
                <p
                  className="text-sm font-light text-end italic mt-2"
                  style={{ color: textColor, fontFamily }}
                >
                  — {author}
                </p>
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
      </div>
    </div>
  )
}
