import { ResponseSentiment } from "./outreach.types";

export interface SentimentAnalysisResult {
  sentiment: ResponseSentiment;
  confidence: number;
  reason: string;
  suggestedAction: "alert_candidate_interview" | "draft_reply" | "provide_info" | "log_rejection" | "close_thread" | "none";
  bookingLink?: string;
}

/**
 * Recruiter Response Sentiment Classifier
 * Fast deterministic regex/NLP rules with high precision, ready for LLM augmentation.
 */
export function analyzeRecruiterResponse(emailText: string): SentimentAnalysisResult {
  if (!emailText || emailText.trim().length === 0) {
    return {
      sentiment: "neutral",
      confidence: 0.5,
      reason: "Empty or unparseable response body.",
      suggestedAction: "none",
    };
  }

  const text = emailText.toLowerCase();

  // Extract any calendar / booking link
  const urlMatch = emailText.match(/https?:\/\/(?:calendly|cal\.com|hubspot|tidycal|meet\.google)[^\s<>"]+/i);
  const bookingLink = urlMatch ? urlMatch[0] : undefined;

  // 1. Interview Opportunity Detection (Highest Priority)
  const interviewKeywords = [
    "schedule a call",
    "schedule an interview",
    "set up a call",
    "jump on a call",
    "introductory call",
    "quick chat",
    "phone screen",
    "technical screen",
    "calendar link",
    "book a time",
    "available for a call",
    "time this week",
    "times that work",
    "calendly",
    "cal.com",
  ];

  const hasInterviewSignal = interviewKeywords.some((kw) => text.includes(kw)) || Boolean(bookingLink);
  if (hasInterviewSignal) {
    return {
      sentiment: "interview_opportunity",
      confidence: 0.95,
      reason: "Recruiter proposed an interview or shared scheduling link.",
      suggestedAction: "alert_candidate_interview",
      bookingLink,
    };
  }

  // 2. Rejection Detection
  const rejectionKeywords = [
    "moved forward with other",
    "move forward with other",
    "moving forward with other",
    "move forward with another",
    "moving forward with another",
    "decided not to proceed",
    "decided to move forward with",
    "not moving forward",
    "position has been filled",
    "role has been filled",
    "not a fit at this time",
    "pursuing other candidates",
    "will keep your resume on file",
    "unfortunately we cannot offer",
    "not selected",
    "at this stage we have decided",
  ];

  if (rejectionKeywords.some((kw) => text.includes(kw))) {
    return {
      sentiment: "rejection",
      confidence: 0.92,
      reason: "Recruiter stated that the candidate is not moving forward.",
      suggestedAction: "log_rejection",
    };
  }

  // 3. Action Required (Missing information / CTC / notice period request)
  const actionKeywords = [
    "share your current ctc",
    "expected ctc",
    "current salary",
    "notice period",
    "work authorization",
    "portfolio link",
    "github link",
    "references",
    "send over your",
    "please provide",
    "fill out this form",
  ];

  if (actionKeywords.some((kw) => text.includes(kw))) {
    return {
      sentiment: "action_required",
      confidence: 0.88,
      reason: "Recruiter requested specific candidate information or compensation details.",
      suggestedAction: "provide_info",
    };
  }

  // 4. Positive Interest (General inquiry)
  const positiveKeywords = [
    "profile looks interesting",
    "impressive background",
    "great experience",
    "would love to learn more",
    "sounds like a strong match",
    "passing this along to the team",
    "sharing with our hiring manager",
    "hiring manager will review",
  ];

  if (positiveKeywords.some((kw) => text.includes(kw))) {
    return {
      sentiment: "positive",
      confidence: 0.85,
      reason: "Recruiter expressed positive interest in candidate profile.",
      suggestedAction: "draft_reply",
    };
  }

  // 5. Negative / Unsubscribe
  const negativeKeywords = [
    "unsubscribe",
    "remove me",
    "do not contact",
    "stop emailing",
    "spam",
  ];

  if (negativeKeywords.some((kw) => text.includes(kw))) {
    return {
      sentiment: "negative",
      confidence: 0.9,
      reason: "Recipient requested no further contact.",
      suggestedAction: "close_thread",
    };
  }

  // Default: Neutral acknowledgement
  return {
    sentiment: "neutral",
    confidence: 0.6,
    reason: "Standard automated acknowledgement or non-committal response.",
    suggestedAction: "none",
  };
}
