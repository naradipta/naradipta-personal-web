// Satu-satunya sumber data pribadi (nama, kontak, skills, dll).
// Komponen dan halaman WAJIB mengambil data dari sini, bukan hardcode
// (lihat CLAUDE.md, prinsip #1). Skills & ringkasan pengalaman diambil dari
// resume pemilik; tidak memuat detail internal perusahaan (lihat "Aturan
// Konten" di CLAUDE.md).

export interface ContactInfo {
  email: string;
  /** Link wa.me siap-klik, bukan nomor mentah. */
  whatsapp: string;
  linkedin: string;
  github: string;
}

export type SkillCategory =
  | "Languages"
  | "Testing Tools"
  | "Frameworks"
  | "AI-Assisted QA"
  | "Testing Types"
  | "Project & Monitoring Tools"
  | "Methodologies"
  | "Soft Skills";

export interface SkillGroup {
  category: SkillCategory;
  skills: string[];
}

export interface ExperienceEntry {
  role: string;
  company: string;
  period: string;
  location: string;
  highlights: string[];
}

export type WhatIDoIcon = "bug" | "gear" | "cloud" | "mobile" | "shield" | "sparkle" | "doc" | "checklist";

export interface WhatIDoItem {
  icon: WhatIDoIcon;
  title: string;
  description: string;
}

export interface Availability {
  location: string;
  timezone: string;
  statusLine: string;
}

export interface SiteConfig {
  name: string;
  role: string;
  /** Path ke foto profil, mis. "/profile/avatar.jpg" (taruh file di public/). Opsional. */
  avatar?: string;
  /** Path ke file resume/CV PDF, mis. "/resume.pdf" (taruh file di public/). Opsional. */
  resumeUrl?: string;
  tagline: string;
  valueProposition: string;
  whatIDo: WhatIDoItem[];
  availability: Availability;
  contact: ContactInfo;
  experience: ExperienceEntry[];
  skills: SkillGroup[];
}

export const siteConfig: SiteConfig = {
  name: "Muhammad Arrafi",
  role: "QA Engineer & SDET",
  avatar: "/profile/avatar.jpg",
  resumeUrl: "/Muhammad_Arrafi_Resume.pdf",
  tagline: "QA Engineer & SDET with 5+ years testing Web, Android, iOS, and API platforms in fast-paced Agile teams. I build scalable test automation frameworks, drive testing for large-scale service migrations while safeguarding tracker data integrity, and use AI/LLM to move faster without cutting corners on release quality.",
  valueProposition: "I treat quality as a shared responsibility, not a gate at the end of a sprint — I get involved from PRD review onward so ambiguous requirements get caught before they become bugs. When something breaks, I care more about the root cause than closing the ticket fast, and I default to automating anything I'd otherwise repeat by hand. I also lean on AI/LLM tools deliberately: to move faster through the repetitive parts of QA, never as a substitute for actually understanding what I'm testing.",

  availability: {
    location: "Jakarta, Indonesia",
    timezone: "GMT+7",
    statusLine: "Open to remote roles and relocation.",
  },

  whatIDo: [
    {
      icon: "checklist",
      title: "Requirements & Test Planning",
      description: "I analyze PRDs and technical docs to define test scenarios and acceptance criteria upfront, catching ambiguous or missing requirements before development starts — so testing shapes the release, not just checks it at the end.",
    },
    {
      icon: "bug",
      title: "Functional Testing",
      description: "I write test cases spanning unit, functional, integration, regression, tracker, and stress testing, combining structured test design with exploratory techniques to catch issues before release.",
    },
    {
      icon: "gear",
      title: "Test Automation",
      description: "I design and build test automation frameworks using Java, TestNG, and Selenium, wiring them into CI/CD pipelines so regressions are caught automatically instead of relying on manual runs.",
    },
    {
      icon: "cloud",
      title: "API Testing",
      description: "I validate REST API contracts and tracker event payloads using Postman and Proxyman, covering functional correctness and analytics event schemas so integrations stay reliable across releases.",
    },
    {
      icon: "mobile",
      title: "Mobile Testing",
      description: "I test Android and iOS apps alongside Web and API layers using Appium and Flipper, catching platform-specific bugs across devices before they reach users.",
    },
    {
      icon: "shield",
      title: "Tracker & Data Validation",
      description: "I safeguard analytics integrity by validating event tracker schemas during large-scale platform migrations, building data-driven validation frameworks that scale as new events are added.",
    },
    {
      icon: "sparkle",
      title: "AI-Assisted QA",
      description: "I use AI/LLM tools to speed up PRD analysis, generate and refine test cases, scaffold automation scripts, and produce structured QA documentation without cutting corners on release quality.",
    },
    {
      icon: "doc",
      title: "Quality Bug Reports",
      description: "I write clear, reproducible bug reports — title, severity, environment, steps to reproduce, and supporting screenshots or logs — so developers can triage and fix fast, and stakeholders can prioritize with confidence.",
    },
  ],

  contact: {
    email: "arrafi11.muhammad@gmail.com",
    whatsapp: "https://wa.me/6287784606677",
    linkedin: "https://www.linkedin.com/in/muhammad-arrafi-its/",
    github: "https://github.com/naradipta",
  },

  experience: [
    {
      role: "QA Engineer",
      company: "Tokopedia (ByteDance)",
      period: "Feb 2024 — Present",
      location: "Jakarta, Indonesia",
      highlights: [
        "Performed end-to-end manual and automated testing across core platform surfaces on Web, Android, iOS, and API, ensuring release quality within Agile sprint cycles.",
        "Drove testing for a large-scale cloud infrastructure migration of core platform services — designed and executed regression and integration test plans, and collaborated cross-functionally to validate system stability pre- and post-migration.",
        "Validated event tracker implementation and maintained data integrity throughout the migration, safeguarding analytics accuracy, a seamless user experience, and uninterrupted business operations.",
        "Contributed to the quality of newly launched product features by verifying UI consistency, functional behavior, and event tracker accuracy, ensuring a stable and reliable initial release.",
        "Analyzed Product Requirement Documents (PRDs) to define comprehensive test scenarios and acceptance criteria, proactively identifying ambiguous or missing requirements before development to prevent defects early in the cycle.",
        "Identified, documented, and tracked defects through resolution, partnering with developers and data analysts to minimize escaped defects in production.",
        "Leveraged AI/LLM tools to accelerate onboarding on new domains, analyze product and technical documentation, generate and refine test cases, develop automation scripts, and produce structured QA documentation — significantly improving testing efficiency and coverage.",
      ],
    },
    {
      role: "Software Development Engineer in Test (SDET)",
      company: "Tokopedia",
      period: "Aug 2021 — Feb 2024",
      location: "Jakarta, Indonesia",
      highlights: [
        "Promoted within the first year in recognition of consistent delivery and ownership of high-impact testing projects.",
        "Ensured functionality and performance of the platform's highest-traffic surfaces — including the home feed and content discovery pages — through front-end and back-end automated testing.",
        "Designed, developed, and maintained test automation frameworks, tools, and scripts following industry best practices, improving test coverage and reducing manual regression effort.",
        "Authored comprehensive test cases spanning unit, functional, integration, regression, tracker, and stress testing.",
        "Led and managed multiple concurrent testing projects, delivering QA sign-off across platforms within agreed timelines.",
        "Coordinated with development and operations teams to align testing standards and integrate automated tests into the CI/CD pipeline.",
        "Executed manual and automated testing across multiple product surfaces spanning Web, Mobile Web, Android, iOS, and API layers.",
      ],
    },
  ],

  skills: [
    {
      category: "Languages",
      skills: ["Java", "C++", "Golang", "Python", "SQL", "HTML", "CSS"],
    },
    {
      category: "Testing Tools",
      skills: ["Selenium", "Appium", "Katalon Studio", "Postman", "Proxyman", "Flipper","Locust"],
    },
    {
      category: "Frameworks",
      skills: ["JUnit", "TestNG", "Unittest", "Maven"]
    },
    {
      category: "AI-Assisted QA",
      skills: [
        "PRD/Tech Doc Analysis",
        "Test Case Generation & Refinement",
        "Automation Scripting",
        "QA Documentation",
        "Domain Onboarding Acceleration",
      ],
    },
    {
      category: "Testing Types",
      skills: [
        "Manual",
        "Automation",
        "API",
        "Smoke",
        "Sanity",
        "Integration",
        "Regression",
        "Exploratory",
        "End-to-End",
        "Stress"
      ],
    },
    {
      category: "Project & Monitoring Tools",
      skills: ["JIRA", "Confluence"],
    },
    {
      category: "Methodologies",
      skills: ["Agile", "Scrum"],
    },
    {
      category: "Soft Skills",
      skills: [
        "Cross-functional Collaboration",
        "Stakeholder Communication",
        "Defect Triage & Root Cause Analysis",
        "Technical Documentation",
        "Team Leadership",
        "Mentoring",
      ],
    },
  ],
};
