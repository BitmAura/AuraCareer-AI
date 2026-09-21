/**
 * Production-Grade ATS-Compliant LaTeX Resume Templates
 * Compatible with Overleaf, TeX Live, and all major ATS parsers (Workday, Greenhouse, Lever, Taleo).
 */

export interface LatexResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  summary: string;
  skills: {
    category: string;
    items: string[];
  }[];
  experience: {
    roleTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    highlights: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    location: string;
    year: string;
    honors?: string;
  }[];
  projects?: {
    name: string;
    technologies: string[];
    description: string;
    link?: string;
  }[];
  certifications?: string[];
}

/**
 * Escapes characters that have special syntactic meaning in LaTeX.
 */
export function sanitizeLatex(text: string): string {
  if (!text) return "";
  return text
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");
}

/**
 * Clean Single-Column Modern ATS LaTeX Template.
 * Fully compatible with Overleaf 1-click import.
 */
export function generateModernAtsLatex(data: LatexResumeData): string {
  const name = sanitizeLatex(data.fullName);
  const email = sanitizeLatex(data.email);
  const phone = sanitizeLatex(data.phone);
  const loc = sanitizeLatex(data.location);

  // Social / Professional Links
  const links: string[] = [];
  if (data.linkedinUrl) {
    links.push(`\\href{${data.linkedinUrl}}{LinkedIn}`);
  }
  if (data.githubUrl) {
    links.push(`\\href{${data.githubUrl}}{GitHub}`);
  }
  if (data.portfolioUrl) {
    links.push(`\\href{${data.portfolioUrl}}{Portfolio}`);
  }
  const linksStr = links.length > 0 ? ` $|$ ` + links.join(" $|$ ") : "";

  // Skills Section
  const skillsLatex = (data.skills || [])
    .map((s) => {
      const items = Array.isArray(s.items)
        ? s.items
        : typeof (s as any).skills === "string"
          ? (s as any).skills.split(/[,|]/).map((x: string) => x.trim())
          : typeof s.items === "string"
            ? (s.items as string).split(/[,|]/).map((x: string) => x.trim())
            : [];
      return `  \\item \\textbf{${sanitizeLatex(s.category)}:} ${items.map(sanitizeLatex).join(", ")}`;
    })
    .join("\n");

  // Experience Section
  const experienceLatex = (data.experience || [])
    .map((exp) => {
      const rawHighlights = Array.isArray(exp.highlights)
        ? exp.highlights
        : Array.isArray((exp as any).bullets)
          ? (exp as any).bullets
          : typeof (exp as any).description === "string"
            ? [(exp as any).description]
            : [];
      const highlights = rawHighlights
        .map((h: unknown) => `    \\item ${sanitizeLatex(String(h))}`)
        .join("\n");
      const startDate = exp.startDate || (exp as any).date || "";
      const endDate = exp.endDate || "";
      const dateRange = startDate && endDate ? `${sanitizeLatex(startDate)} -- ${sanitizeLatex(endDate)}` : sanitizeLatex(startDate || endDate || "Present");
      return `\\resumeSubheading
  {${sanitizeLatex(exp.roleTitle || (exp as any).role || "")}}{${dateRange}}
  {${sanitizeLatex(exp.company)}}{${sanitizeLatex(exp.location || "")}}
  \\resumeItemListStart
${highlights}
  \\resumeItemListEnd`;
    })
    .join("\n\\vspace{4pt}\n");

  // Education Section
  const educationLatex = (data.education || [])
    .map((edu) => {
      const honors = edu.honors || (edu as any).details ? ` $|$ \\textit{${sanitizeLatex(edu.honors || (edu as any).details)}}` : "";
      const year = edu.year || (edu as any).date || "";
      return `\\resumeSubheading
  {${sanitizeLatex(edu.degree)}}{${sanitizeLatex(year)}}
  {${sanitizeLatex(edu.institution)}}{${sanitizeLatex(edu.location || "")}${honors}}`;
    })
    .join("\n\\vspace{4pt}\n");

  // Projects Section (Optional)
  let projectsLatex = "";
  if (data.projects && data.projects.length > 0) {
    const projItems = data.projects
      .map((p) => {
        const linkStr = p.link ? ` $|$ \\href{${p.link}}{Link}` : "";
        const techStr = p.technologies.length > 0
          ? ` $|$ \\textit{${sanitizeLatex(p.technologies.join(", "))}}`
          : "";
        return `  \\item \\textbf{${sanitizeLatex(p.name)}}${techStr}${linkStr}: ${sanitizeLatex(p.description)}`;
      })
      .join("\n");

    projectsLatex = `
%----------- PROJECTS -----------
\\section{Key Projects}
\\resumeItemListStart
${projItems}
\\resumeItemListEnd
`;
  }

  // Certifications Section (Optional)
  let certsLatex = "";
  if (data.certifications && data.certifications.length > 0) {
    const certItems = data.certifications
      .map((c) => `  \\item ${sanitizeLatex(c)}`)
      .join("\n");

    certsLatex = `
%----------- CERTIFICATIONS -----------
\\section{Certifications \\& Training}
\\resumeItemListStart
${certItems}
\\resumeItemListEnd
`;
  }

  return `%-------------------------
% AuraCareer AI (BitmAura) - ATS LaTeX Resume
% Overleaf & ATS Compliant Single-Column Architecture
%-------------------------

\\documentclass[letterpaper,10pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}

\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins for ATS density
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1.0in}
\\addtolength{\\topmargin}{-0.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}[leftmargin=0.15in]}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\begin{document}

%---------- HEADING ----------
\\begin{center}
    \\textbf{\\Huge \\scshape ${name}} \\\\ \\vspace{4pt}
    \\small ${phone} $|$ \\href{mailto:${email}}{${email}} $|$ ${loc}${linksStr}
\\end{center}

%----------- PROFESSIONAL SUMMARY -----------
\\section{Professional Summary}
\\vspace{2pt}
\\small{${sanitizeLatex(data.summary)}}

%----------- TECHNICAL SKILLS -----------
\\section{Technical \\& Domain Competencies}
\\resumeItemListStart
${skillsLatex}
\\resumeItemListEnd

%----------- EXPERIENCE -----------
\\section{Professional Experience}
\\resumeSubHeadingListStart
${experienceLatex}
\\resumeSubHeadingListEnd
${projectsLatex}
%----------- EDUCATION -----------
\\section{Education}
\\resumeSubHeadingListStart
${educationLatex}
\\resumeSubHeadingListEnd
${certsLatex}
\\end{document}
`;
}
