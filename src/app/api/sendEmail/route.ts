import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { name, email, recommendation } = await req.json();

        if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });

        const ZEPTO_KEY = process.env.ZEPTO_API_KEY;
        const FROM_EMAIL = process.env.FROM_EMAIL;

        if (!ZEPTO_KEY || !FROM_EMAIL) {
            console.error("Zepto config missing");
            return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
        }

        const payload = {
            from: { address: FROM_EMAIL, name: "Quiz App" },
            to: [{ email_address: { address: email } }],
            subject: "Your Quiz Result",
            htmlbody:
                `<p>Hi ${name || "there"},</p>` +
                `<p>Thanks for completing the quiz. Your recommendation: <b>${recommendation || "—"}</b></p>` +
                `<p>Best,<br/>Quiz App</p>`
        };

        const res = await fetch("https://api.zeptomail.com/v1.1/email", {
            method: "POST",
            headers: {
                "Authorization": `Zoho-enczapikey ${ZEPTO_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
            // server-side fetch uses default timeout; you can handle errors below
        });

        if (!res.ok) {
            const text = await res.text();
            console.error("Zepto error:", res.status, text);
            return NextResponse.json({ error: "Email failed" }, { status: 502 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("send-email error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
