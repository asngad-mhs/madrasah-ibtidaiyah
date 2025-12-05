
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this example, we'll throw an error if the key is missing.
  console.warn("API key is missing. AI Tutor functionality will not work. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const askAiTutor = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
    return "Maaf, fitur AI sedang tidak tersedia. Kunci API tidak ditemukan.";
  }
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Kamu adalah 'Ustadz AI', seorang guru yang ramah, sabar, dan cerdas untuk siswa Madrasah Ibtidaiyah (sekolah dasar Islam). Jawablah pertanyaan dengan cara yang mudah dipahami anak-anak, gunakan bahasa Indonesia yang baik dan sopan. Jika relevan, sertakan nilai-nilai atau contoh-contoh Islami yang sederhana. Jaga agar jawabanmu tetap singkat dan jelas.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Maaf, terjadi kesalahan saat mencoba menghubungi Ustadz AI. Coba lagi nanti ya.";
  }
};
