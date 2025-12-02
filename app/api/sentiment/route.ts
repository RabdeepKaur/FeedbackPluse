import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const prompt = `You are a sentiment analyzer. Respond with only one word: POSITIVE, NEGATIVE, or NEUTRAL.

Analyze the sentiment of the following message: "${message}"

Sentiment:`;

    const result = await client.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
    });

    const sentiment = result.text?.trim().toUpperCase() || 'NEUTRAL';

    // Validate response is one of the expected values
    const validSentiments = ['POSITIVE', 'NEGATIVE', 'NEUTRAL'];
    const finalSentiment = validSentiments.includes(sentiment) 
      ? sentiment 
      : 'NEUTRAL';

    return NextResponse.json({ sentiment: finalSentiment });
  } catch (err) {
    console.error('Sentiment analysis error:', err);
    return NextResponse.json(
      { sentiment: "NEUTRAL", error: "Failed to analyze sentiment" },
      { status: 200 } // Return 200 with default sentiment instead of error
    );
  }
}