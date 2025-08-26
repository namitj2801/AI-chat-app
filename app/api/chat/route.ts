import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { message } = await request.json();

    // ✅ Get the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // ✅ Call generateContent with the prompt directly
    const result = await model.generateContent(message);

    // ✅ Extract the response text
    const response = result.response.text();

    return Response.json({ response });
  } catch (error) {
    console.error("Gemini API error:", error);
    return Response.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
