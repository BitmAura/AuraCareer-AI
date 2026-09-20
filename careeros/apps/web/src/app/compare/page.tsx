import { MarketingShell } from "@/components/marketing/marketing-shell";
import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata({
  title: "AuraCareer AI vs Naukri, LinkedIn bots & resume builders",
  description:
    "Naukri wins portal listings. LinkedIn bots win spam. Resume builders win PDFs. AuraCareer AI wins the autonomous sovereign career hunt.",
  path: "/compare",
});

export default function ComparePage() {
  return (
    <MarketingShell>
      <h1 className="font-heading text-4xl font-bold">AuraCareer AI vs Naukri</h1>
      <p className="mt-4 text-[#3d4654]">
        Use Naukri for inventory. Use AuraCareer AI for autonomous intelligence: multi-portal scraping, LaTeX ATS packets, recruiter outreach, and closed-loop learning.
      </p>
      <ul className="mt-8 list-disc space-y-3 pl-5 text-[#3d4654]">
        <li>AuraCareer AI: 13-portal scraping, Grade A–F, single-column LaTeX Overleaf sync, verified recruiter outreach.</li>
        <li>Naukri: large India portal inventory, but no autonomous tailoring or proactive outreach.</li>
        <li>LinkedIn Easy Apply bots: spam volume without a packet. AuraCareer AI keeps you in sovereign control.</li>
        <li>Resume builders: static PDF with no live job matching or closed-loop conversion learning.</li>
      </ul>
    </MarketingShell>
  );
}
