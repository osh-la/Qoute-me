import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'

const defaultImages = [
  '/images/bg1.jpg',
  '/images/bg2.jpg',
  '/images/bg3.jpg',
  '/images/bg4.jpg',
]

export default function App() {
  const [image, setImage] = useState(null)
  const [quote, setQuote] = useState('')
  const [author, setAuthor] = useState('')
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
    const canvas = await html2canvas(previewRef.current)
    const link = document.createElement('a')
    link.download = 'quote-me.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Quote Me</h1>

      {/* Inputs */}
      <div className="flex flex-col gap-2 w-full max-w-md">
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        <textarea
          className="p-2 border rounded resize-none"
          rows="3"
          placeholder="Enter the quote..."
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
        />

        <input
          type="text"
          className="p-2 border rounded"
          placeholder="Author's name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>

      {/* Default image options */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {defaultImages.map((src, idx) => (
          <img
            key={idx}
            src={src}
            onClick={() => setImage(src)}
            className="w-32 h-32 object-cover cursor-pointer rounded hover:ring-2 hover:ring-black"
          />
        ))}
      </div>

      {/* Preview */}
      <div
        ref={previewRef}
        className="relative mt-6 w-full max-w-md aspect-[4/5] bg-white overflow-hidden rounded shadow-md"
      >
        {image && (
          <img src={image} alt="Selected" className="absolute w-full h-full object-cover" />
        )}
        {(quote || author) && (
          <div className="absolute inset-0 flex flex-col justify-center items-center p-4 bg-black/40">
            <p className="text-white text-xl font-semibold text-center whitespace-pre-line">{quote}</p>
            {author && (
              <p className="text-white text-sm font-light mt-2 text-center">— {author}</p>
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
  )
}
