import type { GenerateAiImage } from 'wasp/server/operations'
import { HttpError } from 'wasp/server'
import Replicate from 'replicate'
import OpenAI from 'openai'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY!,
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export const generateAiImage: GenerateAiImage<{ prompt: string; style: string }, { imageUrl: string }> = async (
  { prompt, style },
  context
) => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized')
  }

  try {
    // Translate Vietnamese prompt to English
    const translation = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Translate the following Vietnamese text to English. Keep the meaning same, but make it descriptive and suitable for AI image generation.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    const englishPrompt = translation.choices[0].message.content || ''

    // Generate image using Replicate
    const output = await replicate.run(
      'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
      {
        input: {
          prompt: englishPrompt,
          scheduler: style === 'line-art' ? 'K_EULER' : 'DPMSolverMultistep',
          num_outputs: 1,
          guidance_scale: style === 'line-art' ? 9 : 7,
          negative_prompt: style === 'line-art' 
            ? 'color, painting, detailed background'
            : 'text, watermark, low quality',
        }
      }
    )

    return {
      imageUrl: (output as any)[0],
    }
  } catch (error: any) {
    console.error('AI Image generation error:', error)
    throw new HttpError(
      500,
      error.message || 'Không thể tạo ảnh, vui lòng thử lại'
    )
  }
}