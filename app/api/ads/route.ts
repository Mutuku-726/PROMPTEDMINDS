import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const business = body.business;
    const product = body.product;
    const audience = body.audience;
    const goal = body.goal;

    if (!business || !product || !audience || !goal) {
      return Response.json(
        { error: "Please provide all campaign details." },
        { status: 400 }
      );
    }

    const prompt = `
You are an expert digital marketing strategist.

Create a complete advertising campaign strategy for the business below.

BUSINESS:
${business}

PRODUCT OR SERVICE:
${product}

TARGET AUDIENCE:
${audience}

CAMPAIGN GOAL:
${goal}

Create a practical campaign strategy containing:

1. Campaign Big Idea
2. Customer Pain Point
3. Core Marketing Message
4. Three Strong Ad Angles
5. Three Ad Hooks
6. Primary Ad Copy
7. Call To Action
8. Creative Concept
9. Targeting Suggestions
10. Success Metrics
11. Testing Ideas

Make the strategy specific to the business and audience.

Avoid generic marketing advice.
Write in clear, professional language.
Focus on generating real business results.
`;

    const response = await openai.responses.create({
      model: "gpt-5.5",
      instructions:
        "You are a senior performance marketing strategist helping businesses create practical advertising campaigns.",
      input: prompt,
    });

    return Response.json({
      campaign: response.output_text,
    });
  } catch (error) {
    console.error("Ads API error:", error);

    return Response.json(
      { error: "Failed to generate AI campaign." },
      { status: 500 }
    );
  }
}