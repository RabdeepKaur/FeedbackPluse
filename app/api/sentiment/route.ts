import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

export async function POST(message:string, req: Request) {
  try {
    const { message } = await req.json();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a sentiment analyzer. Respond with only one word: POSITIVE, NEGATIVE, or NEUTRAL. Analyze the sentiment of the feedback message.",
        },
        {
          role: "user",
          content: `Analyze the sentiment of the following message: "${message}"`,
        },
      ],
      max_tokens: 2,
    });

    const sentiment = completion.choices[0].message.content
      ?.trim()
      .toLowerCase();

    return NextResponse.json({ sentiment });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ sentiment: "POSITIVE" });
  }
}
