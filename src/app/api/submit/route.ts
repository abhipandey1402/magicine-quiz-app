import { NextResponse } from "next/server";
import getClient from "@/app/lib/db";
import { computeScore, getRecommendation } from "@/app/lib/recommend";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, answers } = body as { name: string; email: string; answers: string[] };

        if (!name || !email || !Array.isArray(answers)) {
            return NextResponse.json({ error: "Invalid payload. name,email,answers[5] required" }, { status: 400 });
        }

        const score = computeScore(answers);
        const recommendation = getRecommendation(score);

        const client = await getClient();
        const db = client.db(process.env.MONGODB_DB || "quiz_app");
        const collection = db.collection("submissions");

        const result = await collection.insertOne({
            name,
            email,
            answers,
            score,
            recommendation,
            createdAt: new Date()
        });

        // Return inserted ID and recommendation (string)
        return NextResponse.json({ success: true, id: result.insertedId.toString(), recommendation });
    } catch (err) {
        console.error("submit error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
