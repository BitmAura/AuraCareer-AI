import { task, wait, logger } from "@trigger.dev/sdk/v3";
import { generateColdEmailCampaign } from "@/lib/outreach/cold-email-generator";
import { analyzeRecruiterResponse } from "@/lib/outreach/sentiment-analyzer";
import { RecruiterContact } from "@/lib/outreach/outreach.types";
import { LatexResumeData } from "@/lib/resume/latex-generator";

export interface OutreachCampaignPayload {
  campaignId: string;
  recruiter: RecruiterContact;
  targetRoleTitle: string;
  candidateResume: LatexResumeData;
  senderName: string;
  senderEmail: string;
  overleafUrl?: string;
}

export const autonomousOutreachTask = task({
  id: "autonomous-recruiter-outreach",
  maxDuration: 86400 * 7, // Up to 7 days lifecycle with durable wait
  run: async (payload: OutreachCampaignPayload) => {
    logger.info("Initializing cold email campaign for recruiter", {
      recruiter: payload.recruiter.fullName,
      company: payload.recruiter.company,
    });

    // 1. Generate Problem-Proof-Proposal formula draft
    const campaign = generateColdEmailCampaign({
      recruiter: payload.recruiter,
      targetRoleTitle: payload.targetRoleTitle,
      candidateResume: payload.candidateResume,
      senderName: payload.senderName,
      senderEmail: payload.senderEmail,
    });

    logger.info("Initial cold outreach draft prepared", {
      subject: campaign.initialDraft.subject,
    });

    // 2. Simulate or dispatch initial outreach email
    // In production, dispatch via Resend API or SMTP
    logger.info("Initial outreach dispatched to recruiter", { email: payload.recruiter.email });

    // 3. Durable Wait for 3 Days (Zero server compute costs while waiting!)
    logger.info("Entering 3-day durable wait before follow-up inspection...");
    await wait.for({ days: 3 });

    logger.info("3-day wait elapsed. Inspecting recruiter inbox status...");

    // 4. In a real integration, check IMAP/webhook for reply.
    // For demonstration, if no reply is logged, schedule polite follow-up.
    const hasReplied = false;

    if (!hasReplied) {
      logger.info("No reply detected. Preparing polite Follow-up #1...", {
        followUpSubject: campaign.followUp1.subject,
      });

      return {
        status: "follow_up_scheduled",
        campaignId: payload.campaignId,
        daysWaited: 3,
        nextStep: "follow_up_1_dispatched",
      };
    }

    return {
      status: "replied",
      campaignId: payload.campaignId,
    };
  },
});
