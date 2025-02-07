import type { GenerateAiImage } from 'wasp/server/operations'
import { HttpError } from 'wasp/server'
import Replicate from 'replicate'
import { GoogleGenerativeAI } from "@google/generative-ai"

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY!,
})

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-pro" })

export const generateAiImage: GenerateAiImage<{ prompt: string; style: string }, { imageUrl: string }> = async (
  { prompt, style },
  context
) => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized')
  }

  try {
    // Translate Vietnamese prompt to English using Gemini
    const result = await model.generateContent([
      `Translate the following Vietnamese text to English and create a prompt for ${style === 'line-art' ? 'a simple black and white line art drawing' : 'a simple illustration'} style: ${prompt}`
    ])
    const englishPrompt = result.response.text();
    console.log('English prompt: ', englishPrompt);

    // Generate image using Replicate with Flux
    // just change something
    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      { 
        input: {
          prompt: englishPrompt,
          go_fast: true,
          megapixels: "1",
          num_outputs: 1,
          aspect_ratio: "1:1",
          output_format: "webp",
          output_quality: 80,
          num_inference_steps: 4,
          negative_prompt: "text, watermark, low quality",
        }
      }
    )

    if (!output) {
      throw new Error('No image was generated')
    }

    console.log('Output: ' , output);

    const imageUrls: string[] = []
    for (const [_, item] of Object.entries(output)) {
      imageUrls.push(item as string)
    }

    if (!imageUrls.length) {
      throw new Error('No image was generated')
    }

    console.log('Generated image URL:', imageUrls[0])
    return {
      imageUrl: imageUrls[0],
    }
  } catch (error: any) {
    console.error('AI Image generation error:', error)
    throw new HttpError(
      500,
      error.message || 'Không thể tạo ảnh, vui lòng thử lại'
    )
  }
}