import { describe, it, expect } from "vitest";
import {
  inferRoleFamilyFromText,
  inferRoleFamily,
  packKeywordsForTargets,
  RoleFamily,
} from "../product/targets";
import {
  PORTAL_BOARDS,
  boardsForRoleFamily,
} from "./portal-boards";

describe("Multi-Domain Career OS - Role Inference & Keyword Packing", () => {
  it("accurately categorizes diverse career roles into correct role families", () => {
    // Doctors & Clinical
    expect(inferRoleFamilyFromText("General Physician (MBBS)")).toBe("healthcare");
    expect(inferRoleFamilyFromText("Emergency Room Doctor / MD")).toBe("healthcare");
    expect(inferRoleFamilyFromText("Staff Nurse / Registered Nurse (RN)")).toBe("healthcare");
    expect(inferRoleFamilyFromText("Clinical Care Specialist")).toBe("healthcare");

    // Software & Technology
    expect(inferRoleFamilyFromText("Senior Software Engineer")).toBe("software_eng");
    expect(inferRoleFamilyFromText("Full Stack React & Node Developer")).toBe("software_eng");
    expect(inferRoleFamilyFromText("Backend Architect (Go / Python)")).toBe("software_eng");
    expect(inferRoleFamilyFromText("Data Scientist / AI Engineer")).toBe("software_eng");

    // Finance & Accounting
    expect(inferRoleFamilyFromText("Chartered Accountant (CA / CPA)")).toBe("finance_accounting");
    expect(inferRoleFamilyFromText("Senior Financial Analyst")).toBe("finance_accounting");
    expect(inferRoleFamilyFromText("Taxation Manager & Controller")).toBe("finance_accounting");
    expect(inferRoleFamilyFromText("Accountant / Bookkeeper")).toBe("finance_accounting");

    // Digital Marketing & Growth
    expect(inferRoleFamilyFromText("Digital Marketing Specialist")).toBe("marketing");
    expect(inferRoleFamilyFromText("SEO & Content Growth Manager")).toBe("marketing");
    expect(inferRoleFamilyFromText("Performance Marketing Lead")).toBe("marketing");
    expect(inferRoleFamilyFromText("Social Media Manager")).toBe("marketing");

    // Operations / SCM
    expect(inferRoleFamilyFromText("Procurement & Vendor Manager")).toBe("procurement");
    expect(inferRoleFamilyFromText("Plant Operations Manager")).toBe("plant_ops");
  });

  it("generates tailored keyword packs for each specific domain", () => {
    const doctorKeywords = packKeywordsForTargets({
      targetRole: "Doctor / General Physician",
      industryPack: "healthcare",
      yearsExperience: 5,
      cities: ["Bengaluru", "Mumbai"],
    });
    expect(/physician|doctor|clinical|patient/i.test(doctorKeywords)).toBe(true);

    const devKeywords = packKeywordsForTargets({
      targetRole: "Software Engineer",
      industryPack: "software_tech",
      yearsExperience: 4,
      cities: ["Remote", "Bengaluru"],
    });
    expect(/software|developer|backend|frontend/i.test(devKeywords)).toBe(true);

    const caKeywords = packKeywordsForTargets({
      targetRole: "Chartered Accountant",
      industryPack: "finance_accounting",
      yearsExperience: 6,
      cities: ["Delhi", "Mumbai"],
    });
    expect(/accountant|audit|finance|tax/i.test(caKeywords)).toBe(true);

    const mktgKeywords = packKeywordsForTargets({
      targetRole: "Digital Marketing Manager",
      industryPack: "marketing_growth",
      yearsExperience: 3,
      cities: ["Hyderabad"],
    });
    expect(/marketing|seo|growth|campaigns/i.test(mktgKeywords)).toBe(true);
  });
});

describe("Multi-Domain Scrapers - Board Prioritization", () => {
  it("prioritizes healthcare ATS boards when candidate is a doctor or nurse", () => {
    const boards = boardsForRoleFamily("healthcare");
    const boardTokens = boards.map((b) => b.token);
    expect(boardTokens).toContain("oscar");
    expect(boardTokens).toContain("zocdoc");
    expect(boardTokens).toContain("doximity");
  });

  it("prioritizes tech ATS boards when candidate is a software engineer", () => {
    const boards = boardsForRoleFamily("software_eng");
    const boardTokens = boards.map((b) => b.token);
    expect(boardTokens).toContain("canonical");
    expect(boardTokens).toContain("inmobi");
  });

  it("prioritizes finance ATS boards when candidate is an accountant or financial analyst", () => {
    const boards = boardsForRoleFamily("finance_accounting");
    const boardTokens = boards.map((b) => b.token);
    expect(boardTokens).toContain("stripe");
    expect(boardTokens).toContain("block");
  });

  it("prioritizes marketing ATS boards when candidate is a digital marketing specialist", () => {
    const boards = boardsForRoleFamily("marketing");
    const boardTokens = boards.map((b) => b.token);
    expect(boardTokens).toContain("reddit");
    expect(boardTokens).toContain("affirm");
  });
});
