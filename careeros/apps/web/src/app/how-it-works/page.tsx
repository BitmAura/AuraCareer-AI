import { MarketingShell } from "@/components/marketing/marketing-shell";
import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata({
  title: "How AuraCareer AI works",
  description:
    "AuraCareer AI daily loop: targets, resume, multi-portal discovery, packet, and confirmed applications with recruiter outreach.",
  path: "/how-it-works",
});

const steps = [
  ["Account + targets", "Role, experience, target locations, CTC, notice period, and industry stack."],
  ["Resume ready", "ATS scorecard + Overleaf/LaTeX builder so packets start from a verified base resume."],
  ["Daily graded seats", "Up to 3 searches/day. Multi-portal scraping with grade A–F, why, and gaps — not 200 junk links."],
  ["Packet + Confirm", "AuraCareer AI surfaces the exact careers website. You download the LaTeX/PDF packet, apply on THAT site, then tap I submitted."],
  ["Track pipeline", "Applied → interview → offer. Interviews prove the OS, not vanity queue counts."],
];

export default function HowItWorksPage() {
  return (
    <MarketingShell>
      <h1 className="font-heading text-4xl font-bold">How it works</h1>
      <p className="mt-4 text-[#3d4654]">
        One system for the hunt. Built for India manufacturing professionals who still Confirm every apply.
      </p>
      <ol className="mt-10 space-y-6">
        {steps.map(([title, body], i) => (
          <li key={title}>
            <p className="text-sm font-semibold text-[#c45c26]">0{i + 1}</p>
            <h2 className="mt-1 text-xl font-semibold">{title}</h2>
            <p className="mt-1 text-[#3d4654]">{body}</p>
          </li>
        ))}
      </ol>
    </MarketingShell>
  );
}
