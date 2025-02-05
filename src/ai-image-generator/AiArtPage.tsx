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
    <div className='py-10 lg:mt-10'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-4xl text-center'>
          <h2 className='mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white'>
            <span className='text-purple-600'>AI</span> Art Generator
          </h2>
        </div>
        
        <div className='my-8 border rounded-3xl border-gray-900/10 dark:border-gray-100/10'>
          <div className='sm:w-[90%] md:w-[70%] lg:w-[50%] py-10 px-6 mx-auto my-8 space-y-10'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
              <div className='space-y-4'>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Chọn phong cách
                </label>
                <div className='grid grid-cols-2 gap-4'>
                  {artStyles.map((style) => (
                    <button
                      key={style.id}
                      type='button'
                      onClick={() => setSelectedStyle(style.id)}
                      className={cn(
                        'rounded-lg p-4 border-2 transition-all duration-200',
                        selectedStyle === style.id 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:border-purple-300'
                      )}
                    >
                      <span className='text-sm font-medium text-gray-900 dark:text-white'>
                        {style.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className='space-y-4'>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Mô tả của bạn (tiếng Việt)
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  className='block w-full rounded-md border border-gray-200 bg-[#f5f0ff] shadow-md focus:ring-purple-500 focus:border-purple-500 transition-all duration-200'
                  placeholder='Ví dụ: Một con rồng đang bay trên thành phố cổ...'
                />
              </div>

              <button
                type='submit'
                disabled={!prompt || isGenerating}
                className={cn(
                  'flex items-center justify-center gap-2 px-6 py-3 text-white font-medium bg-purple-600 rounded-md hover:bg-purple-700 transition-all',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {isGenerating ? (
                  <>
                    <CgSpinner className='animate-spin' />
                    Đang tạo ảnh...
                  </>
                ) : (
                  'Tạo ảnh ngay'
                )}
              </button>

              {error && (
                <div className='text-red-500 text-sm text-center'>{error}</div>
              )}
            </form>

            {generatedImage && (
              <div className='mt-8'>
                <h3 className='text-lg font-semibold mb-4'>Tác phẩm của bạn</h3>
                <div className='rounded-xl overflow-hidden border-2 border-purple-100'>
                  <img 
                    src={generatedImage} 
                    alt="Generated artwork" 
                    className='w-full h-auto object-cover'
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