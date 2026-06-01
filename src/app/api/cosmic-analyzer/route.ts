import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const payload = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error("API Error: GEMINI_API_KEY is completely missing from process.env");
            return NextResponse.json({ error: "Missing API Key configuration." }, { status: 500 });
        }

        const systemInstruction =
                "You are a helpful Earth science teacher. Explain the consequence of this teleportation in exactly 3 sentences. " +
                "Use a serious but accessible educational tone, focusing on gravity, tides, and physical stability. " +
                "Do not sound like a science fiction writer; sound like a teacher explaining the mechanics to a student. " +
                "Example: If the Moon moved much closer to Earth, its gravity would create much stronger tides, causing severe coastal flooding and powerful ocean currents. The stronger pull could also trigger more earthquakes and volcanic activity. Over time, Earth’s rotation and climate could be disrupted, making conditions much harsher for life.";

        const promptText = `${systemInstruction}\n\nTeleportation Log:\nMoved Object: ${payload.movedObjectId}\nPlaced Directly Next To: ${payload.targetObjectId}`;

        // Updated to use standard stable production parameters
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: promptText }]
                }]
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            console.error("Google API Server Rejection:", errData);
            return NextResponse.json({ error: "API connection rejected." }, { status: response.status });
        }

        const data = await response.json();
        const aiMessage = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiMessage) {
            throw new Error("Empty response parts payload.");
        }

        return NextResponse.json({ summary: aiMessage });
    } catch (error) {
        console.error("Internal Route Failure:", error);
        return NextResponse.json({ error: "Internal server processing failure." }, { status: 500 });
    }
}