import axios from "axios";

export const translateText = async (text, targetLanguage) => {
  try {
    const apiKey = "AIzaSyARi94taMPUOMUWQiQVjvosqJpMO8rontE";
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        q: text,
        target: targetLanguage,
      }
    );

    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error("Error translating text:", error);
    return text;
  }
};
