import { GoogleGenAI, Type } from "@google/genai";
import type { Question, Language } from "../types";

// FIX: Initialize the GoogleGenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// FIX: Define the schema for a single quiz question to ensure structured JSON output.
const quizQuestionSchema = {
  type: Type.OBJECT,
  properties: {
    question: {
      type: Type.STRING,
      description: "The quiz question.",
    },
    options: {
      type: Type.ARRAY,
      description: "A list of multiple-choice options.",
      items: { type: Type.STRING },
    },
    answer: {
      type: Type.ARRAY,
      description: "An array containing the correct answer(s) from the provided options. This should always be an array, even if there is only one correct answer.",
      items: {
        type: Type.STRING
      }
    },
    explanation: {
        type: Type.STRING,
        description: "A brief explanation of why the answer is correct.",
    }
  },
  required: ["question", "options", "answer", "explanation"],
};

export const generateQuizFromText = async (text: string, language: Language): Promise<Question[]> => {
  // FIX: Use the more powerful 'gemini-2.5-pro' model to improve reliability for complex JSON generation and avoid server errors.
  const model = "gemini-2.5-pro";

  // FIX: Separate instructions into a systemInstruction for clarity and robustness.
  const systemInstruction = language === 'zh'
    ? `你是一个测验生成助手。根据用户提供的文本，创建一系列多项选择题。
- 根据源文本判断问题是单选还是多选。
- 对于每个问题，提供一个选项列表、正确答案和简要解释。
- JSON输出中的'answer'字段必须始终是一个字符串数组，即使对于单选题也是如此。
- 所有的问题、选项和解释都必须是中文。`
    : `You are a quiz generation assistant. Based on the text provided by the user, create a series of multiple-choice quiz questions.
- Identify if a question has single or multiple correct answers based on the source text.
- For each question, provide a list of options, the correct answer(s), and a brief explanation.
- The 'answer' field in the JSON output MUST ALWAYS be an array of strings, even for single-answer questions.`;

  try {
    // FIX: Call the Gemini API using generateContent with a systemInstruction and the user's text as content.
    const response = await ai.models.generateContent({
      model,
      contents: text,
      config: {
        systemInstruction,
        temperature: 0.3,
        topP: 0.95,
        topK: 64,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              description: "An array of quiz questions.",
              items: quizQuestionSchema,
            },
          },
          required: ["questions"],
        },
      },
    });

    // FIX: Parse the JSON response from the model.
    const jsonResponse = response.text.trim();
    const parsedResponse = JSON.parse(jsonResponse);
    
    if (parsedResponse && Array.isArray(parsedResponse.questions)) {
      // Post-validation to ensure answers are always arrays
      return parsedResponse.questions.map((q: any) => ({
        ...q,
        answer: Array.isArray(q.answer) ? q.answer : [q.answer]
      }));
    } else {
      console.error("Unexpected response structure:", parsedResponse);
      throw new Error("Could not parse quiz questions from the response.");
    }
  } catch (error) {
    console.error("Error generating quiz with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`AI model failed to generate quiz: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the quiz.");
  }
};