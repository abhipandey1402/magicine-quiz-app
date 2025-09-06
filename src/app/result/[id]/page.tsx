import getClient from "@/app/lib/db";
import { ObjectId } from "mongodb";

type Props = { params: { id: string } };

export default async function Page({ params }: Props) {
    const { id } = await params;
    console.log(id);
    let doc: any = null;

    try {
        const client = await getClient();
        const db = client.db(process.env.MONGODB_DB || "quiz_app");
        doc = await db.collection("submissions").findOne({ _id: new ObjectId(id) });
    } catch (err) {
        console.error("result page error:", err);
    }

    return (
        <main className="min-h-screen flex items-center justify-center p-6">
            <div className="max-w-2xl w-full bg-white p-8 rounded-2xl shadow-lg text-center">
                <h1 className="text-2xl font-bold text-orange-600 mb-4">Your Personalized Recommendation</h1>
                <p className="text-lg text-gray-700 mb-6">
                    <strong>{doc?.name ?? "User"}</strong>, here is the recommendation based on your quiz:
                </p>

                <div className="bg-indigo-50 border rounded-lg p-6 mb-6">
                    <p className="text-md text-orange-700">{doc?.recommendation ?? "—"}</p>
                    <p className="mt-3 text-sm text-gray-500">Score: {doc?.score ?? "—"} / 5</p>
                </div>

                <a href="/" className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg">Take Quiz Again</a>
            </div>
        </main>
    );
}
