import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { topic, platform } = await request.json();

    if (!topic || !platform) {
      return NextResponse.json(
        { error: "Topic and platform are required." },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",
      input: `Create one engaging social media caption for ${platform} about: ${topic}.

Adapt the caption specifically for ${platform}.
Make it natural, professional, engaging, and appropriate for the platform.
Use a strong hook, clear value, and a relevant call to action when appropriate.
Do not sound robotic or generic.
Return only the caption.`,
    });

    return NextResponse.json({
      caption: response.output_text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to generate caption." },
      { status: 500 }
    );
  }
}