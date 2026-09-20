import { ColdEmailDraft, RecruiterContact } from "./outreach.types";
import { LatexResumeData } from "../resume/latex-templates";

export interface GenerateEmailOptions {
  recruiter: RecruiterContact;
  targetRoleTitle: string;
  candidateResume: LatexResumeData;
  companyContext?: string;
  senderName: string;
  senderEmail: string;
}

export interface GeneratedEmailCampaign {
  initialDraft: ColdEmailDraft;
  followUp1: {
    scheduledAfterDays: number;
    subject: string;
    body: string;
  };
  followUp2: {
    scheduledAfterDays: number;
    subject: string;
    body: string;
  };
}

/**
 * Human-Grade Cold Email Generator
 * Produces crisp, non-robotic outreach emails referencing verified achievements.
 */
export function generateColdEmailCampaign(options: GenerateEmailOptions): GeneratedEmailCampaign {
  const { recruiter, targetRoleTitle, candidateResume, companyContext, senderName } = options;

  const recruiterFirstName = recruiter.fullName.split(" ")[0] || "there";
  const company = recruiter.company;

  // Extract top 2 quantifiable highlights from candidate experience
  const allHighlights = candidateResume.experience.flatMap((exp) => exp.highlights);
  const metricHighlights = allHighlights.filter((h) => /\d+%|\$\d+|\d+x|\d+M/i.test(h));
  const topBullets = (metricHighlights.length >= 2 ? metricHighlights : allHighlights).slice(0, 2);

  const bulletsFormatted = topBullets.map((b) => `• ${b}`).join("\n");

  // Subject line generation
  const subject = `Regarding ${targetRoleTitle} role at ${company} — ${senderName}`;

  const body = `Hi ${recruiterFirstName},

I noticed ${company} is currently looking for a ${targetRoleTitle}${companyContext ? ` (${companyContext})` : ""}, and given my background in this space, I wanted to reach out directly.

Over the past ${candidateResume.experience.length * 2}+ years, a couple of relevant initiatives I have led:
${bulletsFormatted}

I have attached my tailored ATS resume for your review. I would welcome the opportunity to connect for a brief 10-minute conversation to see how my experience aligns with your team's technical roadmap.

Would you be open to a quick call sometime this week?

Best regards,
${senderName}
${candidateResume.phone} | ${candidateResume.linkedinUrl || ""}`;

  // Follow-up 1 (3-4 business days later)
  const followUp1 = {
    scheduledAfterDays: 3,
    subject: `Re: ${subject}`,
    body: `Hi ${recruiterFirstName},

Following up on my note from earlier this week regarding the ${targetRoleTitle} opening at ${company}.

I know candidate pipelines move quickly—just wanted to reaffirm my interest in contributing to your team. Please let me know if you'd like to review my resume or schedule a brief intro chat.

Best,
${senderName}`,
  };

  // Follow-up 2 (final touchpoint, 4 days after follow-up 1)
  const followUp2 = {
    scheduledAfterDays: 7,
    subject: `Re: ${subject}`,
    body: `Hi ${recruiterFirstName},

I realize you're likely heads down with hiring and company priorities, so I will pause here. 

If this position or another senior opportunity opens up down the road where my background in ${candidateResume.skills[0]?.items.slice(0, 3).join(", ") || "distributed systems"} might be valuable, feel free to keep my details on file.

Wishing you and the ${company} team continued success!

Best regards,
${senderName}`,
  };

  const initialDraft: ColdEmailDraft = {
    id: `outreach-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    candidateName: senderName,
    recruiter,
    targetRoleTitle,
    subject,
    body,
    latexResumeAttached: true,
    status: "draft",
    followUpCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    initialDraft,
    followUp1,
    followUp2,
  };
}
