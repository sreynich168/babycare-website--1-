'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Camera, Upload, ScanLine, Baby, Download, RefreshCw, Sparkles, ImageIcon, X, FlipHorizontal } from 'lucide-react'

export default function BabyScanPage() {
  const [mode, setMode] = useState<'idle' | 'camera' | 'scanning' | 'result'>('idle')
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<string>('')
  const [measurements, setMeasurements] = useState<any>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user')
  const [savedPhotos, setSavedPhotos] = useState<string[]>([])
  const [showGallery, setShowGallery] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Load saved photos from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('babycare_scan_photos')
    if (saved) {
      try { setSavedPhotos(JSON.parse(saved)) } catch (e) {}
    }
  }, [])

  // Start webcam
  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraFacing, width: { ideal: 1280 }, height: { ideal: 720 } }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setMode('camera')
    } catch (err) {
      alert('Could not access camera. Please allow camera permissions.')
    }
  }, [cameraFacing])

  // Stop webcam
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }, [])

  // Capture photo from webcam
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
    setCapturedImage(dataUrl)
    stopCamera()
    setMode('idle')
  }, [stopCamera])

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setCapturedImage(reader.result as string)
      setMode('idle')
    }
    reader.readAsDataURL(file)
  }

  // Scan the image via backend
  const scanImage = async () => {
    if (!capturedImage) return
    setIsScanning(true)
    setMode('scanning')
    setScanProgress(0)

    // Fake progress animation
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 90) { clearInterval(progressInterval); return 90 }
        return prev + Math.random() * 15
      })
    }, 300)

    try {
      const res = await fetch('http://localhost:8000/api/scan/baby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_base64: capturedImage })
      })

      if (!res.ok) throw new Error('Scan failed')
      const data = await res.json()

      clearInterval(progressInterval)
      setScanProgress(100)

      setProcessedImage(data.processed_image)
      setAiAnalysis(data.ai_analysis)
      setMeasurements(data.measurements)
      setMode('result')
    } catch (err: any) {
      clearInterval(progressInterval)
      alert('Scan failed: ' + (err.message || 'Server error. Make sure the backend is running on port 8000.'))
      setMode('idle')
    } finally {
      setIsScanning(false)
    }
  }

  // Save photo to gallery
  const savePhoto = (imageUrl: string) => {
    const updated = [imageUrl, ...savedPhotos].slice(0, 20) // Keep max 20
    setSavedPhotos(updated)
    localStorage.setItem('babycare_scan_photos', JSON.stringify(updated))
  }

  // Download image
  const downloadImage = (imageUrl: string, name: string) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `${name}-${Date.now()}.png`
    link.click()
  }

  // Flip camera
  const flipCamera = () => {
    setCameraFacing(prev => prev === 'user' ? 'environment' : 'user')
    startCamera()
  }

  // Reset
  const reset = () => {
    setCapturedImage(null)
    setProcessedImage(null)
    setAiAnalysis('')
    setMeasurements(null)
    setMode('idle')
    setScanProgress(0)
    stopCamera()
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => { stopCamera() }
  }, [stopCamera])

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-violet-200 animate-pulse">
          <Baby className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Baby <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600">Bump Scanner</span>
        </h1>
        <p className="text-gray-500 font-medium max-w-lg mx-auto">
          Scan your belly or upload an ultrasound photo. Our AI will analyze and estimate your baby&apos;s size! 📸
        </p>
      </div>

      {/* Gallery toggle */}
      {savedPhotos.length > 0 && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            className="rounded-full border-violet-200 text-violet-600 hover:bg-violet-50"
            onClick={() => setShowGallery(!showGallery)}
          >
            <ImageIcon className="w-4 h-4 mr-2" /> My Photos ({savedPhotos.length})
          </Button>
        </div>
      )}

      {/* Gallery */}
      {showGallery && savedPhotos.length > 0 && (
        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden animate-in slide-in-from-top-4 duration-300">
          <CardHeader className="bg-gradient-to-r from-violet-50 to-pink-50 border-b">
            <CardTitle className="text-lg flex items-center justify-between">
              <div className="flex items-center"><ImageIcon className="w-5 h-5 mr-2 text-violet-500" /> Saved Scan Photos</div>
              <Button size="sm" variant="ghost" onClick={() => setShowGallery(false)}><X className="w-4 h-4" /></Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {savedPhotos.map((photo, i) => (
                <div key={i} className="relative group cursor-pointer rounded-xl overflow-hidden aspect-square border-2 border-transparent hover:border-violet-300 transition-all">
                  <img src={photo} alt={`Scan ${i + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="sm" variant="ghost" className="text-white" onClick={() => downloadImage(photo, `scan-${i}`)}>
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Scanner Area */}
      <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-gradient-to-b from-gray-900 to-gray-950">
        <CardContent className="p-0">
          {/* Camera View */}
          {mode === 'camera' && (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full aspect-video object-cover"
              />
              {/* Scan overlay grid */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-full border-[3px] border-dashed border-cyan-400/30 rounded-lg" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-cyan-400/50 rounded-full animate-pulse" />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-cyan-300 text-sm font-bold bg-black/50 px-4 py-2 rounded-full">
                  Position your belly in the circle
                </div>
              </div>
              {/* Camera controls */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
                <Button
                  size="icon"
                  className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
                  onClick={flipCamera}
                >
                  <FlipHorizontal className="w-5 h-5" />
                </Button>
                <Button
                  size="icon"
                  className="w-20 h-20 rounded-full bg-white shadow-2xl shadow-white/20 hover:scale-105 transition-transform text-pink-600"
                  onClick={capturePhoto}
                >
                  <Camera className="w-8 h-8" />
                </Button>
                <Button
                  size="icon"
                  className="w-12 h-12 rounded-full bg-red-500/80 backdrop-blur-sm hover:bg-red-600 text-white"
                  onClick={() => { stopCamera(); setMode('idle') }}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Scanning Animation */}
          {mode === 'scanning' && (
            <div className="flex flex-col items-center justify-center py-20 px-6 space-y-8">
              <div className="relative w-64 h-64">
                {capturedImage && (
                  <img src={capturedImage} alt="Scanning" className="w-full h-full object-cover rounded-3xl opacity-60" />
                )}
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                  <div
                    className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-bounce"
                    style={{
                      position: 'absolute',
                      top: `${scanProgress}%`,
                      boxShadow: '0 0 20px 5px rgba(0, 255, 255, 0.3)'
                    }}
                  />
                </div>
                <div className="absolute inset-0 border-4 border-cyan-400/40 rounded-3xl animate-pulse" />
              </div>
              <div className="text-center space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-lg">
                  <ScanLine className="w-5 h-5 animate-pulse" />
                  Scanning with OpenCV + AI...
                </div>
                <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <p className="text-gray-500 text-sm">{Math.round(scanProgress)}% — Detecting contours & analyzing...</p>
              </div>
            </div>
          )}

          {/* Idle / Preview */}
          {(mode === 'idle' && !capturedImage) && (
            <div className="flex flex-col items-center justify-center py-20 px-8 space-y-8">
              <div className="w-40 h-40 bg-gradient-to-br from-violet-500/20 to-pink-500/20 rounded-full flex items-center justify-center border-2 border-dashed border-violet-400/30">
                <ScanLine className="w-16 h-16 text-violet-400" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-white">Ready to Scan</h3>
                <p className="text-gray-400 max-w-sm">Use your camera to capture your belly, or upload an ultrasound image for AI analysis.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="h-14 px-8 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white font-bold shadow-lg shadow-violet-500/25 text-lg"
                  onClick={startCamera}
                >
                  <Camera className="w-5 h-5 mr-2" /> Open Camera
                </Button>
                <Button
                  variant="outline"
                  className="h-14 px-8 rounded-2xl border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-bold text-lg"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-5 h-5 mr-2" /> Upload Image
                </Button>
              </div>
            </div>
          )}

          {/* Captured Image Preview */}
          {(mode === 'idle' && capturedImage) && (
            <div className="p-6 space-y-6">
              <div className="relative max-w-md mx-auto">
                <img src={capturedImage} alt="Captured" className="w-full rounded-2xl border-4 border-violet-500/30 shadow-xl" />
                <div className="absolute top-3 right-3">
                  <Button size="icon" variant="ghost" className="bg-black/50 text-white hover:bg-black/70 rounded-full" onClick={reset}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-center gap-4">
                <Button
                  className="h-14 px-10 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700 text-white font-bold shadow-lg text-lg"
                  onClick={scanImage}
                  disabled={isScanning}
                >
                  <Sparkles className="w-5 h-5 mr-2" /> Scan with AI
                </Button>
                <Button variant="outline" className="h-14 rounded-2xl border-gray-700 text-gray-300 hover:bg-gray-800" onClick={reset}>
                  <RefreshCw className="w-5 h-5 mr-2" /> Retake
                </Button>
              </div>
            </div>
          )}

          {/* Results */}
          {mode === 'result' && (
            <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Processed Image Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {capturedImage && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Original</h4>
                    <img src={capturedImage} alt="Original" className="w-full rounded-2xl border border-gray-700" />
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white" onClick={() => savePhoto(capturedImage)}>
                        <Download className="w-3 h-3 mr-1" /> Save
                      </Button>
                    </div>
                  </div>
                )}
                {processedImage && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center">
                      <ScanLine className="w-4 h-4 mr-1" /> OpenCV Analysis
                    </h4>
                    <img src={processedImage} alt="Processed" className="w-full rounded-2xl border border-cyan-500/30 shadow-lg shadow-cyan-500/10" />
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white" onClick={() => savePhoto(processedImage)}>
                        <Download className="w-3 h-3 mr-1" /> Save
                      </Button>
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white" onClick={() => downloadImage(processedImage, 'scan-result')}>
                        <Download className="w-3 h-3 mr-1" /> Download
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Measurements */}
              {measurements && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-4 text-center">
                    <p className="text-3xl font-extrabold text-violet-400">{measurements.contours_found}</p>
                    <p className="text-xs text-gray-400 font-bold uppercase mt-1">Shapes Found</p>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-4 text-center">
                    <p className="text-3xl font-extrabold text-cyan-400">{measurements.largest_contour_area_pct}%</p>
                    <p className="text-xs text-gray-400 font-bold uppercase mt-1">Area Coverage</p>
                  </div>
                  <div className="bg-pink-500/10 border border-pink-500/20 rounded-2xl p-4 text-center">
                    <p className="text-3xl font-extrabold text-pink-400">{measurements.estimated_diameter_px}px</p>
                    <p className="text-xs text-gray-400 font-bold uppercase mt-1">Est. Diameter</p>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-center">
                    <p className="text-3xl font-extrabold text-emerald-400">{measurements.image_width}x{measurements.image_height}</p>
                    <p className="text-xs text-gray-400 font-bold uppercase mt-1">Resolution</p>
                  </div>
                </div>
              )}

              {/* AI Analysis */}
              {aiAnalysis && (
                <div className="bg-gradient-to-br from-violet-500/10 to-pink-500/10 border border-violet-500/20 rounded-3xl p-6">
                  <h3 className="text-xl font-extrabold text-white flex items-center mb-4">
                    <Sparkles className="w-6 h-6 mr-2 text-violet-400" /> AI Baby Analysis
                  </h3>
                  <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {aiAnalysis}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 pt-4">
                <Button
                  className="h-12 px-6 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold"
                  onClick={reset}
                >
                  <RefreshCw className="w-4 h-4 mr-2" /> New Scan
                </Button>
                {processedImage && (
                  <Button
                    variant="outline"
                    className="h-12 px-6 rounded-2xl border-gray-700 text-gray-300"
                    onClick={() => { if (processedImage) downloadImage(processedImage, 'baby-scan') }}
                  >
                    <Download className="w-4 h-4 mr-2" /> Download Result
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hidden elements */}
      <canvas ref={canvasRef} className="hidden" />
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg rounded-2xl bg-gradient-to-br from-violet-50 to-white hover:shadow-xl transition-shadow">
          <CardContent className="p-6 text-center space-y-3">
            <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto">
              <Camera className="w-7 h-7 text-violet-600" />
            </div>
            <h3 className="font-bold text-gray-900">Capture</h3>
            <p className="text-sm text-gray-500">Use your camera to take a photo of your belly or upload an ultrasound image.</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg rounded-2xl bg-gradient-to-br from-cyan-50 to-white hover:shadow-xl transition-shadow">
          <CardContent className="p-6 text-center space-y-3">
            <div className="w-14 h-14 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto">
              <ScanLine className="w-7 h-7 text-cyan-600" />
            </div>
            <h3 className="font-bold text-gray-900">OpenCV Scan</h3>
            <p className="text-sm text-gray-500">Advanced contour detection and shape analysis using computer vision.</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg rounded-2xl bg-gradient-to-br from-pink-50 to-white hover:shadow-xl transition-shadow">
          <CardContent className="p-6 text-center space-y-3">
            <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7 text-pink-600" />
            </div>
            <h3 className="font-bold text-gray-900">AI Analysis</h3>
            <p className="text-sm text-gray-500">Gemini AI provides baby size estimates, week predictions, and caring health tips.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
