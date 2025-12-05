
import { GoogleGenAI } from "@google/genai";

export const askAiTutor = async (prompt: string): Promise<string> => {
  // Safely access the API key inside the function to prevent app crash on load.
  // This makes the app resilient if the environment variable is not set.
  const API_KEY = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;

  if (!API_KEY) {
    console.warn("API key is missing. AI Tutor functionality will not work. Please set the API_KEY environment variable.");
    return "Maaf, fitur AI sedang tidak tersedia karena masalah konfigurasi. Kunci API tidak ditemukan.";
  }

  // Initialize the GoogleGenAI client only when the function is called.
  const ai = new GoogleGenAI({ apiKey: API_KEY });

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