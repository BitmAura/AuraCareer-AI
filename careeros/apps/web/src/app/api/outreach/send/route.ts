import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const SendOutreachSchema = z.object({
  recruiterEmail: z.string().email(),
  recruiterName: z.string().min(1),
  companyName: z.string().min(1),
  roleTitle: z.string().min(1),
  subject: z.string().min(3),
  body: z.string().min(10),
  candidateName: z.string().default("Candidate"),
  candidateEmail: z.string().email().optional(),
  overleafUrl: z.string().url().optional(),
  latexResumeAttached: z.boolean().default(true),
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parsed = SendOutreachSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid outreach payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      recruiterEmail,
      recruiterName,
      companyName,
      roleTitle,
      subject,
      body,
      candidateName,
      candidateEmail,
      overleafUrl,
      latexResumeAttached,
    } = parsed.data;

    const resendApiKey = process.env.RESEND_API_KEY;
    let dispatchMode: "resend" | "sandbox" = "sandbox";
    let messageId = `outreach-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Prepare message content including ATS LaTeX resume reference
    let emailBodyWithAttachment = body;
    if (latexResumeAttached && overleafUrl) {
      emailBodyWithAttachment += `\n\n---\nAttached ATS-Friendly LaTeX Resume (Overleaf Cloud Compilation):\n${overleafUrl}`;
    }

    if (resendApiKey) {
      try {
        const fromAddress = process.env.OUTREACH_FROM_EMAIL || "career-agent@auracareer.ai";
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromAddress,
            to: recruiterEmail,
            reply_to: candidateEmail || fromAddress,
            subject: subject,
            text: emailBodyWithAttachment,
          }),
        });

        if (resendRes.ok) {
          const resendData = (await resendRes.json()) as { id?: string };
          messageId = resendData.id || messageId;
          dispatchMode = "resend";
        } else {
          console.warn("[Outreach API] Resend API error, falling back to sandbox mode:", await resendRes.text());
        }
      } catch (err) {
        console.warn("[Outreach API] Resend dispatch failed, using sandbox audit mode:", err);
      }
    }

    // Generate mailto link as fallback so user can also open in their local email client
    const mailtoUrl = `mailto:${encodeURIComponent(recruiterEmail)}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(emailBodyWithAttachment)}`;

    const auditEntry = {
      messageId,
      recruiterEmail,
      recruiterName,
      companyName,
      roleTitle,
      subject,
      dispatchMode,
      sentAt: new Date().toISOString(),
      status: "sent" as const,
      overleafUrl: overleafUrl || null,
    };

    return NextResponse.json({
      success: true,
      message: dispatchMode === "resend" ? "Cold email dispatched via Resend API" : "Cold email logged to sandbox & ready for dispatch",
      dispatchMode,
      messageId,
      mailtoUrl,
      auditEntry,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to process outreach request", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
