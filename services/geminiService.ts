import { GoogleGenAI } from "@google/genai";
import { MediaItem } from "../types";

// API key is expected to be in process.env.API_KEY
const ai = new GoogleGenAI({apiKey: process.env.API_KEY!});

// Helper to convert File to a Gemini-compatible format
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}


export const generateDescriptionSuggestion = async (title: string, media: MediaItem[]): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    let parts: any[] = [{ 
      text: `Based on the title "${title}" and the provided image, write a short, evocative, and personal-sounding message for a time capsule. Write it from the perspective of someone leaving a message for their future self. Focus on the feeling and memory captured.` 
    }];

    const imageFile = media.find(m => m.type === 'image' && m.file)?.file;

    if (imageFile) {
        const imagePart = await fileToGenerativePart(imageFile);
        parts.push(imagePart);
    } else {
        // Fallback to text-only if no image
        parts[0].text = `Based on the title "${title}", write a short, evocative, and personal-sounding message for a time capsule. Write it from the perspective of someone leaving a message for their future self.`
    }

    // FIX: For multi-modal input, `contents` should be an object with a `parts` array.
    const response = await ai.models.generateContent({
        model,
        contents: { parts },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating suggestion from Gemini:", error);
    return "Could not generate a suggestion at this time. Please write your own message.";
  }
};
