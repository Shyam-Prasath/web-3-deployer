import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  const { prompt } = await request.json();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(
      `Generate a complete HTML, CSS, and JavaScript website in a single HTML file based on the following description. Do not include any markdown code blocks or explanations, just output the raw HTML code: ${prompt}`
    );

    const generatedCode = result.response.text().trim();

    return new Response(JSON.stringify({ code: generatedCode }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating website:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate website" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
