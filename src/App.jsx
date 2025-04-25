import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'

export default function App() {
  const [image, setImage] = useState(null)
  const [quote, setQuote] = useState('')
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

      <div className="flex flex-col gap-2 w-full max-w-md">
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <textarea
          className="p-2 border rounded resize-none"
          rows="3"
          placeholder="Enter your quote..."
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
        />
      </div>

      {/* Preview */}
      <div
        ref={previewRef}
        className="relative mt-6 w-full max-w-md aspect-[4/5] bg-white overflow-hidden rounded shadow-md"
      >
        {image && (
          <img src={image} alt="Uploaded" className="absolute w-full h-full object-cover" />
        )}
        {quote && (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <p className="text-white text-xl font-semibold text-center drop-shadow-md">
              {quote}
            </p>
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
