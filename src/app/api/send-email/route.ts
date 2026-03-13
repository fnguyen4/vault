import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { to, subject, body } = await req.json();

  if (!to || !subject || !body) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const from = process.env.RESEND_FROM_EMAIL ?? "Vault <noreply@resend.dev>";

  const { error } = await resend.emails.send({
    from,
    to,
    subject,
    text: body,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
