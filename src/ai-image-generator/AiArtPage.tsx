import { useState } from 'react'
import { generateAiImage } from 'wasp/client/operations'
import { CgSpinner } from 'react-icons/cg'
import { cn } from '../client/cn'

const artStyles = [
  { id: 'line-art', name: 'Simple Black and White Hand Drawing', model: 'line-art' },
  { id: 'illustration', name: 'Cover Illustrator Style', model: 'illustration' }
]

export default function AiArtPage() {
  const [selectedStyle, setSelectedStyle] = useState(artStyles[0].id)
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    setError(null)
    
    try {
      const result = await generateAiImage({ 
        prompt, 
        style: selectedStyle 
      })
      setGeneratedImage(result.imageUrl)
    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className='min-h-screen py-16 bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-4xl text-center'>
          <h2 className='mt-2 text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent sm:text-5xl'>
            AI Art Generator
          </h2>
          <p className='mt-4 text-lg text-gray-600 dark:text-gray-300'>
            Transform your ideas into stunning artwork with AI
          </p>
        </div>
        
        <div className='mt-12 backdrop-blur-xl bg-white/50 dark:bg-gray-800/50 border rounded-3xl border-gray-200 dark:border-gray-700 shadow-xl'>
          <div className='sm:w-[90%] md:w-[70%] lg:w-[50%] py-10 px-6 mx-auto space-y-10'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
              <div className='space-y-4'>
                <label className='block text-lg font-semibold text-gray-800 dark:text-gray-200'>
                  Choose Style
                </label>
                <div className='grid grid-cols-2 gap-4'>
                  {artStyles.map((style) => (
                    <button
                      key={style.id}
                      type='button'
                      onClick={() => setSelectedStyle(style.id)}
                      className={cn(
                        'rounded-xl p-6 border-2 transition-all duration-300 hover:scale-105',
                        'shadow-lg hover:shadow-xl',
                        selectedStyle === style.id 
                          ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30' 
                          : 'border-gray-200 hover:border-purple-300 dark:border-gray-700'
                      )}
                    >
                      <span className='text-base font-medium bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent'>
                        {style.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className='space-y-4'>
                <label className='block text-lg font-semibold text-gray-800 dark:text-gray-200'>
                  Your Description (Vietnamese)
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className='block w-full rounded-xl border border-gray-200 bg-white/70 dark:bg-gray-800/70 shadow-inner
                    focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200
                    dark:border-gray-700 dark:text-gray-200 dark:placeholder-gray-400'
                  placeholder='Ví dụ: Một con rồng đang bay trên thành phố cổ...'
                />
              </div>

              <button
                type='submit'
                disabled={!prompt || isGenerating}
                className={cn(
                  'group relative flex items-center justify-center gap-2 px-8 py-4 text-white font-medium',
                  'bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl',
                  'shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]',
                  'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
                )}
              >
                {isGenerating ? (
                  <>
                    <CgSpinner className='animate-spin-2 text-xl' />
                    <span>Creating Magic...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Artwork</span>
                    <span className='group-hover:translate-x-1 transition-transform duration-200'>→</span>
                  </>
                )}
              </button>

              {error && (
                <div className='p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center'>
                  {error}
                </div>
              )}
            </form>

            {generatedImage && (
              <div className='mt-12 animate-fade-in'>
                <h3 className='text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200'>Your Masterpiece</h3>
                <div className='rounded-2xl overflow-hidden border-2 border-purple-200 dark:border-purple-800 shadow-2xl 
                  transition-transform duration-300 hover:scale-[1.02]'>
                  <img 
                    src={generatedImage} 
                    alt="Generated artwork" 
                    className='w-full h-auto object-cover'
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}