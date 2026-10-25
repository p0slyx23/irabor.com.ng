import { getContentDateSortValue } from "../core/dateFormatting.js";
import excacoCoverImage from "../assets/images/projects/excaco-cover.webp";
import lgscElectionCoverImage from "../assets/images/projects/lgscelection-cover.webp";
import lugspaceCoverImage from "../assets/images/projects/lugspace-cover.webp";
import payshipCoverImage from "../assets/images/projects/payship-cover.webp";
import placeholderCoverImage from "../assets/images/projects/placeholder-cover.webp";
import primewaveCleaningCoverImage from "../assets/images/projects/primewave-cleaning-cover.webp";
import primewaveCoverImage from "../assets/images/projects/primewave-cover.webp";
import travelBookingCoverImage from "../assets/images/projects/travebooking-cover.webp";
import resumeUrl from "../assets/files/resume.pdf";
// import fullStackResumeUrl from "../assets/files/irabor_joseph_ehis_fullstack.pdf";

export const siteBrand = {
  cycle: "Product Design + Mobile",
  name: "irabor",
  footerLabel: "irabor 2026",
  tagline: "Frontend Developer",
  location: "Lagos, Nigeria",
  email: "irabor.art@gmail.com",
  phone: "+2349163866675",
  resumes: [
    { label: "View résumé", url: resumeUrl },
    // { label: "View full-stack CV", url: fullStackResumeUrl },
  ],
  profileImage: {
    src: "",
    alt: "",
  },
};

export const siteNavigation = [
  { path: "/about", label: "About" },
  { path: "/blog", label: "Posts" },
  { path: "/projects", label: "Projects" },
  { path: "/resources", label: "Resources" },
  { path: "/snippets", label: "Snippets" },
];

export const socialLinks = [
  // {
  //   label: "LinkedIn",
  //   href: "https://www.linkedin.com/joseph-irabor",
  //   icon: "linkedin",
  // },
  {
    label: "GitHub",
    href: "https://github.com/p0slyx23",
    icon: "github",
  },
  {
    label: "Email",
    href: "mailto:irabor.art@gmail.com",
    icon: "mail",
  },
];

export const aboutPage = {
  eyebrow: "About",
  title: "About me",
  lede: "I design and build digital products across product design, frontend engineering, and mobile development with an emphasis on maintainable, production-ready execution.",
  paragraphs: [
    "My work sits between product design and implementation, which means I care as much about how an interface behaves in code as how it looks in a mockup.",
    "Across fintech, travel, civic, real-estate, and service platforms, I focus on building systems that stay readable, maintainable, and trustworthy as products grow.",
    "I am most useful on teams that need product thinking, frontend execution, mobile delivery, and design decisions that can survive real-world constraints.",
  ],
  capabilities: [
    "UI/UX design for product interfaces and flows",
    "Design systems and reusable component thinking",
    "Flutter-based mobile interface implementation",
    "React frontend architecture and product UI delivery",
    "Accessibility-minded interaction and content structure",
  ],
  principles: [
    "Typography and structure before ornament",
    "Reusable systems over one-off screens",
    "Interfaces that stay clear under pressure",
    "Design decisions that hold up in implementation",
  ],
  availability:
    "Open to product design, mobile, and frontend collaborations where systems thinking and execution quality matter.",
};

export const experienceSection = {
  title: "Experience",
  entries: [
    {
      id: "prime-wave-inc",
      period: "Mar 2025 — Present",
      title: "Engineer → Senior Engineer → Lead Engineer",
      company: "Prime Wave Inc",
      companyUrl: "",
      summary:
        "Build and ship websites, design systems, mobile apps, and cross-platform digital experiences. Lead technical architecture for CMS tools, REST APIs, continuous integration, accessibility initiatives, and developer experience.",
      technologies: ["JavaScript", "TypeScript", "React", "WordPress", "Contentful", "Accessibility"],
      isDemo: false,
    },
    {
      id: "zoan-technology",
      period: "Jul 2024 — Feb 2026",
      title: "UI Engineer → Lead Engineer",
      company: "Zoan Technology",
      companyUrl: "",
      summary:
        "Developed interactive web applications with Ember and SCSS, translated Figma prototypes into responsive interfaces, and built cross-platform Flutter applications with REST API and state-management integrations.",
      technologies: ["Ember", "SCSS", "Flutter", "Dart", "REST APIs", "Figma"],
      isDemo: false,
    },
    {
      id: "semantic",
      period: "Nov 2021 — Jun 2022",
      title: "Junior Engineer",
      company: "Semantic",
      companyUrl: "",
      summary:
        "Conducted unit, integration, and performance testing; deployed and maintained web applications on AWS, Azure, and on-premises infrastructure with a focus on reliability and performance.",
      technologies: ["AWS", "Azure", "Testing", "Web Applications"],
      isDemo: false,
    },
  ],
};

export function getProjectPath(slug) {
  return `/projects/${slug}`;
}

export function getProjectSlugFromPath(pathname = "") {
  return pathname.replace(/^\/(?:projects|series)\//, "");
}

export function getBlogPath(slug) {
  return `/blog/${slug}`;
}

export function getBlogSlugFromPath(pathname = "") {
  return pathname.replace(/^\/blog\//, "");
}

export function getArticlePath(slug) {
  return getProjectPath(slug);
}

export function getArticleSlugFromPath(pathname = "") {
  return getProjectSlugFromPath(pathname);
}

const payshipProjectStack = [
  {
    id: "flutter",
    badge: "flutter",
    badgeTone: "purple",
    title: "flutter",
    description:
      "Native iOS and Android product delivery from a single mobile codebase.",
  },
  {
    id: "firebase",
    badge: "firebase",
    badgeTone: "pink",
    title: "firebase",
    description:
      "Notification tooling supporting user alerts and mobile messaging touchpoints.",
  },
  {
    id: "figma",
    badge: "fg",
    badgeTone: "darksky",
    title: "figma",
    description:
      "Design handoff reference used to translate approved mobile flows into Flutter UI.",
  },
  {
    id: "dart",
    badge: "dart",
    badgeTone: "ice",
    title: "dart",
    description:
      "Typed application logic supporting consistent mobile feature implementation.",
  },
  {
    id: "custom-icons",
    badge: "icons",
    badgeTone: "slate",
    title: "custom icon system",
    description:
      "Integrated custom icons across onboarding, payments, and transaction touchpoints.",
  },
  {
    id: "mobile-design-system",
    badge: "system",
    badgeTone: "neutral",
    title: "mobile design system",
    description:
      "Implemented shared mobile components and patterns for a more consistent app experience.",
  },
];

const travelBookingPlatformProjectStack = [
  {
    id: "php",
    badge: "php",
    badgeTone: "sky",
    title: "php",
    description:
      "Used to build the custom application layer for routing, controllers, services, and domain workflows.",
  },
  {
    id: "mysql",
    badge: "sql",
    badgeTone: "neutral",
    title: "mysql",
    description:
      "Used for persistence across users, destinations, bookings, payments, passport plans, and notifications.",
  },
  {
    id: "paystack",
    badge: "pay",
    badgeTone: "lime",
    title: "paystack",
    description:
      "Used for payment initialization and server-side transaction verification.",
  },
  {
    id: "cloudinary",
    badge: "cdn",
    badgeTone: "purple",
    title: "cloudinary",
    description:
      "Used for signed image uploads and mirrored asset storage for homepage and destination media.",
  },
  {
    id: "zeptomail",
    badge: "mail",
    badgeTone: "pink",
    title: "zeptomail",
    description:
      "Used for transactional email delivery tied to account, booking, and passport events.",
  },
];

const primewaveProjectStack = [
  {
    id: "primewave-react",
    badge: "react",
    badgeTone: "ice",
    title: "react frontend",
    description:
      "Component-driven frontend delivery for a multi-service business platform.",
  },
  {
    id: "primewave-php",
    badge: "php",
    badgeTone: "purple",
    title: "php api backend",
    description:
      "Backend services powering content delivery, inquiry handling, and operational workflows.",
  },
  {
    id: "primewave-services",
    badge: "svc",
    badgeTone: "sky",
    title: "service discovery",
    description:
      "Information architecture built to support multiple business service categories clearly.",
  },
  {
    id: "primewave-content",
    badge: "cms",
    badgeTone: "neutral",
    title: "content workflows",
    description:
      "Dynamic content structures for consulting, training, HR, and career service content.",
  },
  {
    id: "primewave-leads",
    badge: "lead",
    badgeTone: "pink",
    title: "lead generation",
    description:
      "Inquiry and conversion pathways designed to support service discovery and contact flows.",
  },
  {
    id: "primewave-performance",
    badge: "perf",
    badgeTone: "slate",
    title: "performance",
    description:
      "Performance-minded implementation for a content-heavy business platform.",
  },
];

const atlanticStayProjectStack = [
  {
    id: "atlantic-react",
    badge: "react",
    badgeTone: "ice",
    title: "react frontend",
    description:
      "Frontend implementation for listing discovery, exploration, and booking-related flows.",
  },
  {
    id: "atlantic-php",
    badge: "php",
    badgeTone: "purple",
    title: "php api backend",
    description:
      "API services supporting listing content, operational workflows, and marketplace behavior.",
  },
  {
    id: "atlantic-listings",
    badge: "prop",
    badgeTone: "neutral",
    title: "property listings",
    description:
      "Structured listing presentation for short-term rental inventory and property detail pages.",
  },
  {
    id: "atlantic-search",
    badge: "find",
    badgeTone: "sky",
    title: "search & discovery",
    description:
      "Browse and comparison flows designed for fast property discovery with low friction.",
  },
  {
    id: "atlantic-content",
    badge: "cms",
    badgeTone: "pink",
    title: "content workflows",
    description:
      "Backend-managed listing and marketing content designed for future inventory growth.",
  },
  {
    id: "atlantic-scale",
    badge: "scale",
    badgeTone: "slate",
    title: "marketplace scale",
    description:
      "A flexible architecture intended to support additional listings and platform expansion.",
  },
];

const lugspaceProjectStack = [
  {
    id: "lugspace-react",
    badge: "react",
    badgeTone: "ice",
    title: "react frontend",
    description:
      "Frontend delivery for a centralized student community and resource platform.",
  },
  {
    id: "lugspace-php",
    badge: "php",
    badgeTone: "purple",
    title: "php api backend",
    description:
      "Backend services for community workflows, access management, and content delivery.",
  },
  {
    id: "lugspace-auth",
    badge: "auth",
    badgeTone: "slate",
    title: "authentication",
    description:
      "Access management designed for secure student-facing community experiences.",
  },
  {
    id: "lugspace-content",
    badge: "hub",
    badgeTone: "neutral",
    title: "community resources",
    description:
      "Platform structures for centralized resource access and community engagement touchpoints.",
  },
  {
    id: "lugspace-integrations",
    badge: "api",
    badgeTone: "sky",
    title: "platform integrations",
    description:
      "Integration-aware application architecture built for future student platform growth.",
  },
  {
    id: "lugspace-performance",
    badge: "perf",
    badgeTone: "pink",
    title: "performance",
    description:
      "Maintainable delivery choices supporting usability as community usage grows.",
  },
];

const excacoProjectStack = [
  {
    id: "excaco-react",
    badge: "react",
    badgeTone: "ice",
    title: "react frontend",
    description:
      "Premium property presentation interfaces built for modern residential showcase experiences.",
  },
  {
    id: "excaco-php",
    badge: "php",
    badgeTone: "purple",
    title: "php api backend",
    description:
      "Backend services supporting property content, inquiry routing, and operational workflows.",
  },
  {
    id: "excaco-showcase",
    badge: "show",
    badgeTone: "neutral",
    title: "property showcase",
    description:
      "Media-rich layouts structured around residential developments and investment storytelling.",
  },
  {
    id: "excaco-inquiry",
    badge: "lead",
    badgeTone: "sky",
    title: "inquiry workflows",
    description:
      "Lead capture and contact pathways designed around real-estate interest and conversion.",
  },
  {
    id: "excaco-seo",
    badge: "seo",
    badgeTone: "pink",
    title: "seo structure",
    description:
      "Search-friendly implementation supporting long-term visibility for property content.",
  },
  {
    id: "excaco-scale",
    badge: "scale",
    badgeTone: "slate",
    title: "platform scale",
    description:
      "Scalable content architecture designed for multiple developments and future expansion.",
  },
];

const lgscProjectStack = [
  {
    id: "lgsc-react",
    badge: "react",
    badgeTone: "ice",
    title: "react frontend",
    description:
      "Responsive dashboard interfaces built for election information and results visibility.",
  },
  {
    id: "lgsc-php",
    badge: "php",
    badgeTone: "purple",
    title: "php api backend",
    description:
      "Backend processing and delivery for election result data and operational workflows.",
  },
  {
    id: "lgsc-data",
    badge: "data",
    badgeTone: "neutral",
    title: "data presentation",
    description:
      "Structured result displays for standings, percentages, and voting progress information.",
  },
  {
    id: "lgsc-dashboard",
    badge: "dash",
    badgeTone: "sky",
    title: "dashboard ux",
    description:
      "Clear information presentation tuned for desktop and mobile election result viewing.",
  },
  {
    id: "lgsc-access",
    badge: "a11y",
    badgeTone: "pink",
    title: "accessibility",
    description:
      "Interface decisions focused on readability, clarity, and reliable information access.",
  },
  {
    id: "lgsc-performance",
    badge: "perf",
    badgeTone: "slate",
    title: "performance",
    description:
      "Delivery choices intended to remain reliable during high-traffic update windows.",
  },
];

const primewaveCleaningProjectStack = [
  {
    id: "primewave-cleaning-react",
    badge: "react",
    badgeTone: "sky",
    title: "react frontend",
    description:
      "Responsive role-based workspaces for customers, cleaners, and operations teams.",
  },
  {
    id: "primewave-cleaning-php",
    badge: "php",
    badgeTone: "purple",
    title: "php api workflows",
    description:
      "Authentication, booking, assignment, notification, and internal workflow actions.",
  },
  {
    id: "primewave-cleaning-mysql",
    badge: "sql",
    badgeTone: "neutral",
    title: "mysql data model",
    description:
      "Booking, cleaner, assignment, payment, and audit data managed in one system.",
  },
  {
    id: "primewave-cleaning-mapbox",
    badge: "map",
    badgeTone: "green",
    title: "mapbox location flows",
    description:
      "Address search and map-based location workflows through a provider-neutral adapter.",
  },
];

const projectStacks = {
  "atlanticstay-booking-platform": atlanticStayProjectStack,
  "excaco-real-estate-platform": excacoProjectStack,
  "lgsc-election-results-platform": lgscProjectStack,
  "lugspace-student-community-platform": lugspaceProjectStack,
  "payship-fintech-platform": payshipProjectStack,
  "primewave-cleaning-services": primewaveCleaningProjectStack,
  "primewave-digital-services-platform": primewaveProjectStack,
  "travel-booking-platform-backend": travelBookingPlatformProjectStack,
};

export function getProjectStack(slug) {
  return projectStacks[slug] ?? [];
}

export const projectCategories = ["All", "Case Studies"];

export const projectPosts = [
  {
    slug: "primewave-cleaning-services",
    title: "Primewave Cleaning Services",
    category: "Case Studies",
    date: "",
    sortDate: "",
    readTime: "",
    excerpt:
      "A role-based platform for managing cleaning requests, cleaner work, and internal operations.",
    tags: ["react", "php", "operations"],
    featured: true,
    image: {
      src: primewaveCleaningCoverImage,
      alt: "Primewave Cleaning Services interface",
    },
  },
  {
    slug: "primewave-digital-services-platform",
    title: "PrimeWave Digital Services Platform",
    category: "Case Studies",
    date: "Jul 2025",
    readTime: "8 min",
    excerpt:
      "A multi-service digital platform built to connect businesses and professionals with technology consulting, HR services, career development resources, training programs, and business support solutions.",
    tags: ["react", "php", "business-platform", "hr-tech", "consulting"],
    featured: false,
    image: {
      src: primewaveCoverImage,
      alt: "PrimeWave digital services platform",
    },
  },
  {
    slug: "atlanticstay-booking-platform",
    title: "Atlantic Stay",
    category: "Case Studies",
    date: "",
    sortDate: "Aug 2025",
    readTime: "8 min",
    excerpt:
      "A vacation rental and property discovery platform designed to simplify accommodation search, property management, and booking experiences across multiple listings.",
    tags: ["react", "php", "travel-tech", "booking-platform", "marketplace"],
    featured: false,
    image: {
      src: placeholderCoverImage,
      alt: "Atlantic Stay booking platform",
    },
  },
  {
    slug: "lugspace-student-community-platform",
    title: "LugSpace",
    category: "Case Studies",
    date: "Nov 2025",
    readTime: "8 min",
    excerpt:
      "A digital community platform created to support student engagement, communication, and access to campus-related resources within a centralized online environment.",
    tags: ["react", "php", "community-platform", "education", "student-portal"],
    featured: false,
    image: {
      src: lugspaceCoverImage,
      alt: "LugSpace student platform",
    },
  },
  {
    slug: "excaco-real-estate-platform",
    title: "ExcaCo",
    category: "Case Studies",
    date: "Jan 2026",
    readTime: "8 min",
    excerpt:
      "A modern real estate and property showcase platform built to present residential developments, property listings, and investment opportunities through a premium digital experience.",
    tags: [
      "react",
      "php",
      "real-estate",
      "property-tech",
      "investment-platform",
    ],
    featured: false,
    image: {
      src: excacoCoverImage,
      alt: "ExcaCo real estate platform",
    },
  },
  {
    slug: "lgsc-election-results-platform",
    title: "LGSC Election Results Platform",
    category: "Case Studies",
    date: "May 2026",
    readTime: "8 min",
    excerpt:
      "A real-time election results platform designed to provide transparent access to candidate standings, vote percentages, and election updates through a responsive digital dashboard.",
    tags: ["react", "php", "civic-tech", "elections", "real-time-data"],
    featured: false,
    image: {
      src: lgscElectionCoverImage,
      alt: "LGSC election results platform",
    },
  },
  {
    slug: "payship-fintech-platform",
    title: "PayShip",
    category: "Case Studies",
    date: "Mar 2025",
    readTime: "5 min",
    excerpt:
      "Frontend development for a native fintech mobile product spanning payments, virtual cards, digital asset transactions, and international payment flows across iOS and Android.",
    tags: ["fintech", "mobile", "flutter", "dart", "notifications"],
    featured: true,
    image: {
      src: payshipCoverImage,
      alt: "PayShip native mobile fintech experience",
    },
  },
  {
    slug: "travel-booking-platform-backend",
    title: "Travel Booking Platform Backend",
    category: "Case Studies",
    date: "Feb 2026",
    readTime: "",
    excerpt:
      "Backend architecture and API workflows for a travel booking platform covering auth, bookings, payments, media handling, and admin operations.",
    tags: ["backend", "php", "payments", "cloudinary"],
    featured: true,
    image: {
      src: travelBookingCoverImage,
      alt: "Travel booking platform backend",
    },
  },
].sort(
  (left, right) =>
    Number(Boolean(right.featured)) - Number(Boolean(left.featured)) ||
    getContentDateSortValue(right.sortDate ?? right.date) -
      getContentDateSortValue(left.sortDate ?? left.date),
);

export const homeRecentProjects = projectPosts.slice(0, 3);

export const projectEntries = {
  "primewave-cleaning-services": {
    slug: "primewave-cleaning-services",
    eyebrow: "case study",
    title: "Primewave Cleaning Services",
    lede: "A connected service workflow for customers, cleaners, and operations teams.",
    meta: ["Product Design", "Full-Stack Development", "Completed"],
    tags: ["react", "php", "mysql", "mapbox"],
    coverImage: {
      src: primewaveCleaningCoverImage,
      alt: "Primewave Cleaning Services interface",
    },
    links: [
      {
        label: "Visit live platform",
        href: "https://cleaning-service.primewaveinc.ca/",
      },
    ],
    screenshots: [],
    evidence: [
      {
        label: "Platform",
        value: "Web application",
        detail: "Built with a React frontend and PHP API layer.",
      },
      {
        label: "Workflow",
        value: "Role-based operations",
        detail:
          "Supports separate customer, cleaner, and operations workspaces.",
      },
    ],
    stack: primewaveCleaningProjectStack,
    toc: [
      { id: "overview", label: "Overview" },
      { id: "challenge", label: "Challenge" },
      { id: "role", label: "My Role" },
      { id: "solution", label: "Solution" },
      { id: "outcome", label: "Outcome" },
    ],
    sections: [
      {
        id: "overview",
        heading: "Project Overview",
        paragraphs: [
          "Primewave Cleaning Services is a role-based platform for managing cleaning requests from booking through assignment, service delivery, and follow-up.",
          "The product brings customer booking, cleaner onboarding, availability, assignments, timesheets, notifications, and operations workflows into one system.",
        ],
      },
      {
        id: "challenge",
        heading: "Challenge",
        paragraphs: [
          "Cleaning operations require different workflows for customers, cleaners, and internal teams.",
          "The system needed to keep scheduling, eligibility, assignments, payments, and audit activity connected without exposing the wrong actions to the wrong role.",
        ],
      },
      {
        id: "role",
        heading: "My Role",
        paragraphs: [
          "I worked across product design and full-stack implementation for the platform.",
        ],
        list: [
          "Designed role-based customer, cleaner, and operations flows",
          "Built React interfaces and PHP API workflows",
          "Implemented scheduling, assignment, notification, and audit patterns",
        ],
      },
      {
        id: "solution",
        heading: "Solution",
        paragraphs: [
          "The platform uses role-aware workspaces to separate booking, cleaner work, and internal operations.",
          "Operations confirms service windows before assignment, while cleaner eligibility and availability support more controlled scheduling.",
        ],
      },
      {
        id: "outcome",
        heading: "Outcome",
        paragraphs: [
          "The project delivers a connected workflow for booking, cleaner onboarding, availability, scheduling, assignments, and operations review.",
          "It demonstrates product thinking across service operations, role-based access, responsive frontend work, and backend workflow design.",
        ],
      },
    ],
    related: [],
  },
  "payship-fintech-platform": {
    slug: "payship-fintech-platform",
    eyebrow: "case study",
    title: "PayShip",
    lede: "PayShip is a native mobile fintech product for iOS and Android that brings payments, virtual card services, digital asset transactions, and international payment experiences into one streamlined app.",
    meta: [
      "mobile fintech",
      "Flutter Frontend Development",
      "Firebase Notifications",
      "Completed",
      "Completed Mar 2025",
    ],
    tags: ["fintech", "mobile", "flutter", "dart", "notifications"],
    coverImage: {
      src: payshipCoverImage,
      alt: "PayShip native mobile product screens",
    },
    links: [
      {
        label: "View on App Store",
        href: "https://apps.apple.com/app/payship-by-zoan/id6746713737",
      },
      {
        label: "View on Google Play",
        href: "https://play.google.com/store/apps/details?id=com.payship.app",
      },
    ],
    stack: payshipProjectStack,
    toc: [
      {
        id: "overview",
        label: "Overview",
      },
      {
        id: "role",
        label: "My Role",
      },
      {
        id: "approach",
        label: "Approach",
      },
      {
        id: "outcome",
        label: "Outcome",
      },
    ],
    sections: [
      {
        id: "overview",
        heading: "Project Overview",
        paragraphs: [
          "PayShip is a native mobile fintech application for iOS and Android that brings multiple digital financial services into a single product experience.",
          "The app supports payments, financial transactions, virtual card services, digital asset transactions, and international payment flows through a clear and focused mobile interface.",
        ],
      },
      {
        id: "role",
        heading: "My Role",
        paragraphs: [
          "I worked on PayShip as the frontend developer for the native mobile product, building the Flutter interface layer for iOS and Android.",
          "My focus was translating approved product and design direction into production-ready mobile UI, implementing reusable screens and components, integrating notification workflows with Firebase, and refining onboarding and transaction experiences.",
        ],
      },
      {
        id: "approach",
        heading: "Design and Development Approach",
        paragraphs: [
          "The implementation goal was to make high-trust financial tasks feel clear, reliable, and efficient within a native mobile interface.",
          "That meant building from a strong Flutter component foundation, staying close to the design handoff in Figma, integrating a custom icon system cleanly, and keeping onboarding and transaction flows consistent across iOS and Android.",
        ],
        list: [
          "Flutter frontend implementation",
          "Native mobile UI development",
          "Figma-based design handoff implementation",
          "Mobile design system implementation",
          "Custom icon system integration",
          "Firebase notification integration",
          "Onboarding flow implementation",
          "Transaction flow refinement",
        ],
      },
      {
        id: "outcome",
        heading: "Outcome",
        paragraphs: [
          "PayShip resulted in a polished native mobile product experience that brings multiple financial services into a cohesive and user-focused journey.",
          "The project demonstrates my ability to take product direction and turn it into production-ready Flutter interfaces for high-trust mobile financial products.",
        ],
      },
    ],
    related: ["travel-booking-platform-backend"],
  },
  "travel-booking-platform-backend": {
    slug: "travel-booking-platform-backend",
    eyebrow: "case study",
    title: "Travel Booking Platform Backend",
    lede: "A custom PHP backend that powers public booking flows and a separate admin API for content, user, and operational management.",
    meta: [
      "Backend API Design",
      "Authentication & Authorization",
      "Payment Verification",
      "Media Upload Workflow",
      "Completed",
      "Completed Feb 2026",
    ],
    tags: ["php", "mysql", "paystack", "cloudinary", "zeptomail"],
    coverImage: {
      src: travelBookingCoverImage,
      alt: "Travel booking platform backend",
    },
    links: [
      {
        label: "Visit live platform",
        href: "https://touroduduwaonline.com/",
      },
    ],
    stack: travelBookingPlatformProjectStack,
    toc: [
      {
        id: "overview",
        label: "Overview",
      },
      {
        id: "architecture",
        label: "Architecture",
      },
      {
        id: "auth",
        label: "Auth & Access",
      },
      {
        id: "payments",
        label: "Payments",
      },
      {
        id: "admin-media",
        label: "Admin & Media",
      },
    ],
    sections: [
      {
        id: "overview",
        heading: "Project Overview",
        paragraphs: [
          "I worked on the backend layer of a travel booking platform, focusing on the server-side flows that support user accounts, destination discovery, bookings, payments, and admin operations.",
          "The backend exposes separate JSON APIs for public and admin use, which keeps customer-facing flows distinct from internal management actions.",
        ],
      },
      {
        id: "architecture",
        heading: "Architecture",
        paragraphs: [
          "The server is a custom PHP application with its own bootstrap process, router, middleware layer, controllers, services, and PDO-based database access.",
          "The codebase uses UUIDs for API-facing identifiers and keeps response contracts consistent across public and admin endpoints.",
        ],
        list: [
          "Public API for customer flows",
          "Admin API for content and operational management",
          "Service layer for pricing, payments, notifications, passport activation, and media handling",
        ],
      },
      {
        id: "auth",
        heading: "Auth & Access Control",
        paragraphs: [
          "Authentication is token-based, with hashed bearer tokens stored server-side and role-aware middleware protecting customer and admin routes.",
          "The backend also supports managed account creation, password resets, and super-admin-only controls for higher-risk account actions.",
        ],
        list: [
          "Bearer-token authentication",
          "Role checks for admin and super admin access",
          "Protected flows for profile, booking, notification, and admin management endpoints",
        ],
      },
      {
        id: "payments",
        heading: "Payments And Business Rules",
        paragraphs: [
          "I implemented payment preparation and verification flows that connect bookings and passport purchases to provider references and local payment records.",
          "Pricing logic is handled on the server, including passport-aware discounts and access restrictions for passport-only inventory.",
          "Successful payment verification updates the related booking or passport purchase and triggers follow-up notification flows.",
        ],
        list: [
          "Pending payment creation tied to a payable record",
          "Server-side verification against the payment provider",
          "Passport activation with calculated start and expiry dates",
        ],
      },
      {
        id: "admin-media",
        heading: "Admin Operations And Media Workflow",
        paragraphs: [
          "The admin API supports destination management, homepage content updates, user management, booking oversight, passport plan management, and dashboard summaries.",
          "For media, the backend generates signed Cloudinary upload payloads and can mirror approved image URLs into structured Cloudinary folders for homepage and destination assets.",
          "The notification system writes in-app notifications and sends transactional emails for events like welcome flows, booking updates, managed account creation, password resets, and passport activation.",
        ],
        list: [
          "Destination create, update, delete workflows",
          "Homepage hero and featured destination management",
          "Signed image upload support with Cloudinary",
          "Transactional notification fan-out across email and in-app records",
        ],
      },
    ],
    related: [],
  },
  "primewave-digital-services-platform": {
    slug: "primewave-digital-services-platform",
    eyebrow: "case study",
    title: "PrimeWave Digital Services Platform",
    lede: "A multi-service digital platform built to connect businesses and professionals with technology consulting, HR services, career development resources, training programs, and business support solutions.",
    meta: [
      "React Frontend",
      "PHP API Backend",
      "Completed",
      "Completed Jul 2025",
    ],
    tags: ["react", "php", "business-platform", "hr-tech", "consulting"],
    coverImage: {
      src: primewaveCoverImage,
      alt: "PrimeWave digital services platform",
    },
    links: [
      {
        label: "Visit live platform",
        href: "https://primewaveinc.ca/",
      },
    ],
    stack: primewaveProjectStack,
    toc: [
      {
        id: "overview",
        label: "Overview",
      },
      {
        id: "challenge",
        label: "Challenge",
      },
      {
        id: "role",
        label: "My Role",
      },
      {
        id: "solution",
        label: "Solution",
      },
      {
        id: "outcome",
        label: "Outcome",
      },
    ],
    sections: [
      {
        id: "overview",
        heading: "Project Overview",
        paragraphs: [
          "PrimeWave is a business services platform designed to bring technology consulting, HR solutions, workforce development, career coaching, training programs, and business support services into a single digital experience.",
          "The platform serves as a central destination where businesses and professionals can explore services, discover learning opportunities, access career resources, and engage with consulting offerings.",
          "The project required a scalable architecture capable of supporting multiple service categories, dynamic content, lead generation workflows, training resources, and future service expansion.",
        ],
      },
      {
        id: "challenge",
        heading: "The Challenge",
        paragraphs: [
          "The platform needed to communicate multiple service offerings while maintaining a clear user journey for different audience segments.",
          "Business owners, job seekers, professionals, and organizations all required different entry points and content experiences.",
          "The challenge was creating a flexible architecture that could support content growth, marketing initiatives, service discovery, and conversion-focused user flows without increasing complexity.",
        ],
      },
      {
        id: "role",
        heading: "My Role",
        paragraphs: [
          "I was responsible for both frontend and backend development.",
          "The frontend was built using React while the backend services were developed using PHP APIs.",
          "My responsibilities included application architecture, API design, frontend implementation, content management workflows, service discovery experiences, performance optimization, and system integration.",
        ],
      },
      {
        id: "solution",
        heading: "Solution",
        paragraphs: [
          "The platform was built as a modern React application powered by a PHP API layer responsible for content delivery, service management, inquiry processing, and business workflows.",
          "The architecture was designed to support future expansion across consulting, training, HR, career services, and digital business operations.",
          "Special attention was given to scalability, maintainability, SEO-friendly content structures, responsive design, and user conversion pathways.",
        ],
        list: [
          "React frontend architecture",
          "PHP API development",
          "Service discovery workflows",
          "Dynamic content delivery",
          "Lead generation systems",
          "Training and resource management",
          "Responsive user experience",
          "Performance optimization",
          "SEO-focused content structure",
          "Scalable platform architecture",
        ],
      },
      {
        id: "outcome",
        heading: "Outcome",
        paragraphs: [
          "The result was a scalable digital platform capable of supporting multiple business service lines from a single ecosystem.",
          "The project demonstrates my ability to architect and develop full-stack platforms that combine content management, service discovery, and business operations into a unified user experience.",
        ],
      },
    ],
    related: ["atlanticstay-booking-platform", "excaco-real-estate-platform"],
  },
  "atlanticstay-booking-platform": {
    slug: "atlanticstay-booking-platform",
    eyebrow: "case study",
    title: "Atlantic Stay",
    lede: "A vacation rental and property discovery platform designed to simplify accommodation search, property management, and booking experiences across multiple listings.",
    meta: ["React Frontend", "PHP API Backend", "In Development"],
    tags: ["react", "php", "travel-tech", "booking-platform", "marketplace"],
    coverImage: {
      src: placeholderCoverImage,
      alt: "Atlantic Stay booking platform",
    },
    links: [],
    stack: atlanticStayProjectStack,
    toc: [
      {
        id: "overview",
        label: "Overview",
      },
      {
        id: "challenge",
        label: "Challenge",
      },
      {
        id: "role",
        label: "My Role",
      },
      {
        id: "solution",
        label: "Solution",
      },
      {
        id: "outcome",
        label: "Outcome",
      },
    ],
    sections: [
      {
        id: "overview",
        heading: "Project Overview",
        paragraphs: [
          "Atlantic Stay is a travel and accommodation platform focused on helping guests discover and explore short-term rental properties through a streamlined digital experience.",
          "The platform was designed to simplify property discovery, listing exploration, availability browsing, and booking-related interactions.",
          "The project required marketplace-style architecture capable of supporting property data, search experiences, listing management, and guest engagement workflows.",
        ],
      },
      {
        id: "challenge",
        heading: "The Challenge",
        paragraphs: [
          "Travel and accommodation platforms require intuitive navigation, efficient search experiences, and scalable property management systems.",
          "The challenge was creating a platform capable of supporting growing inventory while maintaining performance and usability.",
          "Users needed a simple way to browse properties, compare options, and access listing information without unnecessary friction.",
        ],
      },
      {
        id: "role",
        heading: "My Role",
        paragraphs: [
          "I handled both frontend and backend development.",
          "The frontend experience was developed using React while backend services were delivered through PHP APIs.",
          "I was responsible for application architecture, property data management, API integrations, user experience implementation, and platform scalability.",
        ],
      },
      {
        id: "solution",
        heading: "Solution",
        paragraphs: [
          "The platform was built using a component-driven React architecture supported by a PHP backend responsible for property management, content delivery, search functionality, and operational workflows.",
          "The system was structured to support future growth while maintaining flexibility for listing expansion and additional platform features.",
          "Special emphasis was placed on responsive design, user engagement, performance, and maintainable backend services.",
        ],
        list: [
          "React application architecture",
          "PHP API services",
          "Property listing management",
          "Search and discovery workflows",
          "Responsive user interface",
          "Content management systems",
          "Data-driven property experiences",
          "Scalable backend infrastructure",
          "Platform performance optimization",
          "Marketplace-ready architecture",
        ],
      },
      {
        id: "outcome",
        heading: "Outcome",
        paragraphs: [
          "The result was a modern property discovery platform capable of supporting accommodation listings and guest interactions within a scalable architecture.",
          "The project highlights my experience building marketplace-style applications that combine user-focused experiences with robust backend systems.",
        ],
      },
    ],
    related: [
      "excaco-real-estate-platform",
      "primewave-digital-services-platform",
    ],
  },
  "lugspace-student-community-platform": {
    slug: "lugspace-student-community-platform",
    eyebrow: "case study",
    title: "LugSpace",
    lede: "A digital community platform created to support student engagement, communication, and access to campus-related resources within a centralized online environment.",
    meta: [
      "React Frontend",
      "PHP API Backend",
      "Completed",
      "Completed Nov 2025",
    ],
    tags: ["react", "php", "community-platform", "education", "student-portal"],
    coverImage: {
      src: lugspaceCoverImage,
      alt: "LugSpace student platform",
    },
    links: [
      {
        label: "Visit live platform",
        href: "https://lugspace.org/",
      },
    ],
    stack: lugspaceProjectStack,
    toc: [
      {
        id: "overview",
        label: "Overview",
      },
      {
        id: "challenge",
        label: "Challenge",
      },
      {
        id: "role",
        label: "My Role",
      },
      {
        id: "solution",
        label: "Solution",
      },
      {
        id: "outcome",
        label: "Outcome",
      },
    ],
    sections: [
      {
        id: "overview",
        heading: "Project Overview",
        paragraphs: [
          "LugSpace is a digital platform developed to serve as an online community hub for students.",
          "The platform provides a centralized environment where members can access resources, engage with community services, and participate in digital campus experiences.",
          "The project focused on creating a secure, scalable, and user-friendly platform capable of supporting community growth and evolving student needs.",
        ],
      },
      {
        id: "challenge",
        heading: "The Challenge",
        paragraphs: [
          "Student communities often rely on fragmented communication channels and disconnected resource systems.",
          "The challenge was creating a unified platform that could provide a streamlined experience while remaining flexible enough to support future community initiatives.",
          "The solution required balancing usability, scalability, access management, and maintainability.",
        ],
      },
      {
        id: "role",
        heading: "My Role",
        paragraphs: [
          "I worked as a full-stack developer responsible for the React frontend and PHP API backend.",
          "My responsibilities included application architecture, API development, authentication workflows, frontend implementation, system integration, and performance optimization.",
          "I focused on building maintainable systems capable of supporting future platform growth.",
        ],
      },
      {
        id: "solution",
        heading: "Solution",
        paragraphs: [
          "The platform was developed using React for the user interface and PHP-powered APIs for backend services and data management.",
          "The architecture was designed around modular components, secure authentication workflows, and scalable content delivery systems.",
          "The system supports community engagement while maintaining a simple and accessible user experience.",
        ],
        list: [
          "React frontend development",
          "PHP API architecture",
          "Authentication workflows",
          "User access management",
          "Community resource management",
          "Scalable content delivery",
          "Platform integrations",
          "Responsive interface design",
          "Performance optimization",
          "Maintainable system architecture",
        ],
      },
      {
        id: "outcome",
        heading: "Outcome",
        paragraphs: [
          "The project delivered a centralized digital environment designed to support student engagement and community interaction.",
          "The work demonstrates my ability to build scalable full-stack applications that combine modern frontend experiences with reliable backend systems.",
        ],
      },
    ],
    related: [
      "lgsc-election-results-platform",
      "primewave-digital-services-platform",
    ],
  },
  "excaco-real-estate-platform": {
    slug: "excaco-real-estate-platform",
    eyebrow: "case study",
    title: "ExcaCo",
    lede: "A modern real estate and property showcase platform built to present residential developments, property listings, and investment opportunities through a premium digital experience.",
    meta: [
      "React Frontend",
      "PHP API Backend",
      "Completed",
      "Completed Jan 2026",
    ],
    tags: [
      "react",
      "php",
      "real-estate",
      "property-tech",
      "investment-platform",
    ],
    coverImage: {
      src: excacoCoverImage,
      alt: "ExcaCo real estate platform",
    },
    links: [
      {
        label: "Visit live platform",
        href: "https://excaco.com/",
      },
    ],
    stack: excacoProjectStack,
    toc: [
      {
        id: "overview",
        label: "Overview",
      },
      {
        id: "challenge",
        label: "Challenge",
      },
      {
        id: "role",
        label: "My Role",
      },
      {
        id: "solution",
        label: "Solution",
      },
      {
        id: "outcome",
        label: "Outcome",
      },
    ],
    sections: [
      {
        id: "overview",
        heading: "Project Overview",
        paragraphs: [
          "ExcaCo is a digital real estate platform designed to showcase residential developments, premium properties, and investment opportunities through a modern online experience.",
          "The platform enables prospective buyers and investors to explore developments, review property information, discover project updates, and engage with the brand through a streamlined user journey.",
          "The project required a scalable architecture capable of supporting property presentations, media-rich content, inquiry workflows, and future portfolio expansion.",
        ],
      },
      {
        id: "challenge",
        heading: "The Challenge",
        paragraphs: [
          "Real estate platforms must balance visual storytelling with performance, usability, and trust.",
          "The challenge was creating a premium digital experience that could effectively showcase developments while maintaining fast loading times and intuitive navigation.",
          "The solution needed to support evolving property inventories, marketing campaigns, and lead generation workflows without sacrificing maintainability.",
        ],
      },
      {
        id: "role",
        heading: "My Role",
        paragraphs: [
          "I worked as a full-stack developer responsible for both the React frontend and PHP API backend.",
          "My responsibilities included application architecture, API development, content management workflows, frontend implementation, data integration, and performance optimization.",
          "I focused on creating a scalable foundation capable of supporting future growth across multiple property developments.",
        ],
      },
      {
        id: "solution",
        heading: "Solution",
        paragraphs: [
          "The platform was built using React for the frontend experience and PHP-powered APIs for content delivery and operational workflows.",
          "The architecture was designed around modular components, scalable content structures, and maintainable backend services.",
          "Special attention was given to responsive layouts, property presentation experiences, inquiry management, and long-term platform flexibility.",
        ],
        list: [
          "React frontend architecture",
          "PHP API development",
          "Property showcase experiences",
          "Dynamic content management",
          "Lead inquiry workflows",
          "Media-rich presentation systems",
          "Responsive user experience",
          "Performance optimization",
          "Scalable platform architecture",
          "SEO-focused implementation",
        ],
      },
      {
        id: "outcome",
        heading: "Outcome",
        paragraphs: [
          "The result was a modern digital platform capable of supporting property marketing, development showcases, and customer engagement workflows.",
          "The project demonstrates my ability to build scalable full-stack solutions that combine premium user experiences with maintainable backend systems.",
        ],
      },
    ],
    related: [
      "atlanticstay-booking-platform",
      "primewave-digital-services-platform",
    ],
  },
  "lgsc-election-results-platform": {
    slug: "lgsc-election-results-platform",
    eyebrow: "case study",
    title: "LGSC Election Results Platform",
    lede: "A real-time election results platform designed to provide transparent access to candidate standings, vote percentages, and election updates through a responsive digital dashboard.",
    meta: [
      "React Frontend",
      "PHP API Backend",
      "Completed",
      "Completed May 2026",
    ],
    tags: ["react", "php", "civic-tech", "elections", "real-time-data"],
    coverImage: {
      src: lgscElectionCoverImage,
      alt: "LGSC election results platform",
    },
    links: [
      {
        label: "Visit live platform",
        href: "https://lgscelectionresults.com/",
      },
    ],
    stack: lgscProjectStack,
    toc: [
      {
        id: "overview",
        label: "Overview",
      },
      {
        id: "challenge",
        label: "Challenge",
      },
      {
        id: "role",
        label: "My Role",
      },
      {
        id: "solution",
        label: "Solution",
      },
      {
        id: "outcome",
        label: "Outcome",
      },
    ],
    sections: [
      {
        id: "overview",
        heading: "Project Overview",
        paragraphs: [
          "The LGSC Election Results Platform was developed to provide a centralized location for viewing election outcomes, candidate standings, and voting progress through an accessible digital interface.",
          "The platform focuses on presenting election information in a clear and transparent manner while supporting users across desktop and mobile devices.",
          "The project required a reliable architecture capable of handling result updates, data presentation, and user access during high-traffic periods.",
        ],
      },
      {
        id: "challenge",
        heading: "The Challenge",
        paragraphs: [
          "Election-related platforms require accuracy, reliability, and clarity in how information is presented.",
          "The challenge was designing a system capable of displaying changing election data while maintaining usability and performance.",
          "The solution also needed to support responsive viewing experiences and efficient data management workflows.",
        ],
      },
      {
        id: "role",
        heading: "My Role",
        paragraphs: [
          "I served as a full-stack developer responsible for both frontend and backend implementation.",
          "The frontend was built using React while backend services were powered by PHP APIs.",
          "My responsibilities included application architecture, API design, data management workflows, frontend development, and performance optimization.",
        ],
      },
      {
        id: "solution",
        heading: "Solution",
        paragraphs: [
          "The platform was developed using React for responsive user interfaces and PHP APIs for backend processing and data delivery.",
          "The architecture prioritized maintainability, scalability, and efficient information presentation.",
          "Special focus was placed on real-time data visibility, user accessibility, and reliable platform performance.",
        ],
        list: [
          "React frontend development",
          "PHP API architecture",
          "Election results presentation",
          "Data management workflows",
          "Responsive dashboard experiences",
          "Information visualization",
          "Scalable backend services",
          "Performance optimization",
          "Cross-device accessibility",
          "Maintainable platform architecture",
        ],
      },
      {
        id: "outcome",
        heading: "Outcome",
        paragraphs: [
          "The result was a responsive election information platform capable of presenting voting outcomes and candidate standings through a user-friendly interface.",
          "The project highlights my experience building data-driven applications that combine modern frontend experiences with reliable backend systems.",
        ],
      },
    ],
    related: [
      "lugspace-student-community-platform",
      "primewave-digital-services-platform",
    ],
  },
};

export const blogCategories = ["All", "Engineering", "Product", "Notes"];

export const blogPosts = [
  {
    slug: "designing-role-based-cleaning-operations",
    title: "Designing role-based cleaning operations",
    category: "Product",
    date: "",
    readTime: "",
    excerpt:
      "What it takes to connect customer bookings, cleaner work, and operations oversight without blurring responsibilities.",
    tags: ["product-design", "operations", "react", "php"],
    featured: true,
    image: {
      src: primewaveCleaningCoverImage,
      alt: "Primewave Cleaning Services platform shown across desktop and mobile",
    },
  },
  {
    slug: "making-election-results-easier-to-read",
    title: "Making election results easier to read",
    category: "Product",
    date: "",
    readTime: "",
    excerpt:
      "Notes from building a responsive platform for presenting changing election information with clarity.",
    tags: ["civic-tech", "information-design", "react", "php"],
    featured: false,
    image: {
      src: lgscElectionCoverImage,
      alt: "LGSC election results platform",
    },
  },
  {
    slug: "turning-mobile-product-direction-into-flutter-ui",
    title: "Turning mobile product direction into Flutter UI",
    category: "Engineering",
    date: "",
    readTime: "",
    excerpt:
      "How product direction, reusable interface patterns, and native delivery came together for PayShip.",
    tags: ["flutter", "mobile", "frontend", "fintech"],
    featured: false,
    image: {
      src: payshipCoverImage,
      alt: "PayShip native mobile product screens",
    },
  },
];

export const blogEntries = {
  "designing-role-based-cleaning-operations": {
    slug: "designing-role-based-cleaning-operations",
    eyebrow: "Product notes",
    title: "Designing role-based cleaning operations",
    lede: "A service platform has to make the next action clear for customers, cleaners, and the team running operations.",
    meta: ["Product", "Primewave Cleaning Services"],
    tags: ["product-design", "operations", "react", "php"],
    coverImage: {
      src: primewaveCleaningCoverImage,
      alt: "Primewave Cleaning Services platform shown across desktop and mobile",
    },
    toc: [
      { id: "context", label: "Context" },
      { id: "roles", label: "Different roles, different work" },
      { id: "workflow", label: "One connected workflow" },
    ],
    sections: [
      {
        id: "context",
        heading: "A service request is more than a booking",
        paragraphs: [
          "Primewave Cleaning Services brings cleaning requests from booking through assignment, service delivery, and follow-up into one connected platform.",
          "The work includes customer booking, cleaner onboarding, availability, assignments, timesheets, notifications, and operations workflows.",
        ],
      },
      {
        id: "roles",
        heading: "Different roles need different decisions",
        paragraphs: [
          "Customers need a straightforward path to request a service. Cleaners need to understand availability and assigned work. Operations teams need a dependable view of service windows, eligibility, assignments, payments, and audit activity.",
          "Treating those roles as one generic dashboard would expose the wrong actions and make the workflow harder to trust.",
        ],
      },
      {
        id: "workflow",
        heading: "One connected workflow, not one shared screen",
        paragraphs: [
          "The platform separates booking, cleaner work, and internal operations into role-aware workspaces while keeping the underlying workflow connected.",
          "That approach lets operations confirm service windows before assignment and use cleaner eligibility and availability to support more controlled scheduling.",
        ],
      },
    ],
    related: ["making-election-results-easier-to-read"],
  },
  "making-election-results-easier-to-read": {
    slug: "making-election-results-easier-to-read",
    eyebrow: "Product notes",
    title: "Making election results easier to read",
    lede: "Clarity and reliability matter when a platform is responsible for presenting changing election information.",
    meta: ["Product", "LGSC Election Results Platform"],
    tags: ["civic-tech", "information-design", "react", "php"],
    coverImage: { src: lgscElectionCoverImage, alt: "LGSC election results platform" },
    toc: [
      { id: "context", label: "Context" },
      { id: "clarity", label: "Clarity under change" },
      { id: "delivery", label: "The delivery model" },
    ],
    sections: [
      {
        id: "context",
        heading: "Information people can find and understand",
        paragraphs: [
          "The LGSC Election Results Platform was built as a centralized location for viewing election outcomes, candidate standings, and voting progress.",
          "The product needed to make that information accessible across desktop and mobile devices while supporting result updates and user access during high-traffic periods.",
        ],
      },
      {
        id: "clarity",
        heading: "Clarity under change",
        paragraphs: [
          "Election platforms need accuracy, reliability, and a clear way to present information that changes over time.",
          "The design focus was on readable standings, vote percentages, and progress information rather than asking visitors to interpret an overloaded dashboard.",
        ],
      },
      {
        id: "delivery",
        heading: "The delivery model",
        paragraphs: [
          "React supports the responsive interface, while PHP APIs handle backend processing and data delivery.",
          "The architecture prioritizes maintainability, scalable information presentation, and reliable platform performance.",
        ],
      },
    ],
    related: ["designing-role-based-cleaning-operations"],
  },
  "turning-mobile-product-direction-into-flutter-ui": {
    slug: "turning-mobile-product-direction-into-flutter-ui",
    eyebrow: "Engineering notes",
    title: "Turning mobile product direction into Flutter UI",
    lede: "Product direction only becomes useful when it can be carried into a coherent, production-ready mobile interface.",
    meta: ["Engineering", "PayShip"],
    tags: ["flutter", "mobile", "frontend", "fintech"],
    coverImage: { src: payshipCoverImage, alt: "PayShip native mobile product screens" },
    toc: [
      { id: "context", label: "Context" },
      { id: "translation", label: "From direction to interface" },
      { id: "delivery", label: "Native delivery" },
    ],
    sections: [
      {
        id: "context",
        heading: "A mobile product with connected financial flows",
        paragraphs: [
          "PayShip brings payments, virtual card services, digital asset transactions, and international payment experiences into one native mobile product for iOS and Android.",
          "The interface work had to support a cohesive journey across multiple financial services rather than treating each flow as an isolated screen.",
        ],
      },
      {
        id: "translation",
        heading: "From direction to interface",
        paragraphs: [
          "The work focused on translating product direction into Flutter interfaces that are clear, consistent, and ready for implementation.",
          "Reusable patterns and careful structure matter because high-trust financial products ask people to complete important actions with confidence.",
        ],
      },
      {
        id: "delivery",
        heading: "Native delivery",
        paragraphs: [
          "Flutter provided a single mobile codebase for iOS and Android delivery, while Firebase tooling supported notification touchpoints.",
          "The resulting work demonstrates frontend implementation for a production-ready mobile product experience.",
        ],
      },
    ],
    related: ["making-election-results-easier-to-read"],
  },
};

export function getProjectBySlug(slug) {
  return projectEntries[slug] ?? null;
}

export function getBlogPostBySlug(slug) {
  return blogEntries[slug] ?? null;
}

export const articleEntries = projectEntries;

export function getArticleBySlug(slug) {
  return getProjectBySlug(slug);
}

export const resourceCategories = [
  "All",
  "Mobile",
  "Frontend",
  "Backend",
  "Design",
  "Tooling",
];

export const resources = [
  {
    id: "flutter",
    title: "flutter",
    category: "Mobile",
    logoText: "flutter",
    logoTone: "sky",
    description:
      "Primary mobile framework used to ship native-feeling iOS and Android product interfaces from one codebase.",
  },
  {
    id: "react",
    title: "react",
    category: "Frontend",
    logoText: "react",
    logoTone: "ice",
    description:
      "Component-driven frontend delivery for dashboards, listings, marketing pages, and product flows.",
  },
  {
    id: "php",
    title: "php",
    category: "Backend",
    logoText: "php",
    logoTone: "purple",
    description:
      "API and platform logic used for content delivery, integrations, and operational workflows.",
  },
  {
    id: "mysql",
    title: "mysql",
    category: "Backend",
    logoText: "sql",
    logoTone: "neutral",
    description:
      "Relational data storage used for users, bookings, payments, destination content, passport plans, and notification records.",
  },
  {
    id: "paystack",
    title: "paystack",
    category: "Tooling",
    logoText: "pay",
    logoTone: "lime",
    description:
      "Payment provider integration used for checkout initialization, server-side verification, and transaction reconciliation.",
  },
  {
    id: "cloudinary",
    title: "cloudinary",
    category: "Tooling",
    logoText: "cdn",
    logoTone: "purple",
    description:
      "Media delivery workflow used for signed uploads, structured asset folders, and normalized image management.",
  },
  {
    id: "zeptomail",
    title: "zeptomail",
    category: "Tooling",
    logoText: "mail",
    logoTone: "pink",
    description:
      "Transactional email service used for welcome flows, booking updates, password resets, and account lifecycle messaging.",
  },
  {
    id: "figma",
    title: "figma",
    category: "Design",
    logoText: "fg",
    logoTone: "purple",
    description:
      "High-fidelity product design, flow definition, and implementation handoff across mobile and web interfaces.",
  },
  {
    id: "dart",
    title: "dart",
    category: "Mobile",
    logoText: "dart",
    logoTone: "ice",
    description:
      "Typed application logic used alongside Flutter for maintainable mobile feature delivery.",
  },
  {
    id: "firebase",
    title: "firebase",
    category: "Tooling",
    logoText: "fb",
    logoTone: "pink",
    description:
      "Notification and supporting mobile service integration used around product messaging touchpoints.",
  },
  {
    id: "design-systems",
    title: "design systems",
    category: "Design",
    logoText: "ds",
    logoTone: "neutral",
    description:
      "Shared component thinking, tokens, and UI rules used to keep interfaces consistent across products.",
  },
  {
    id: "api-workflows",
    title: "api workflows",
    category: "Backend",
    logoText: "api",
    logoTone: "slate",
    description:
      "Endpoint planning, payload shaping, and integration patterns used across platform and dashboard builds.",
  },
  {
    id: "custom-icons",
    title: "custom icon systems",
    category: "Design",
    logoText: "icons",
    logoTone: "neutral",
    description:
      "Purpose-built iconography used to support product clarity across finance and platform experiences.",
  },
];

export const projectsPage = {
  eyebrow: "Case Studies",
  title: "Projects",
  lede: "A broader archive of completed work and ongoing product builds across mobile, frontend, and backend delivery.",
};

export const snippetCategories = [
  "All",
  "Flutter",
  "React",
  "PHP",
  "Accessibility",
  "Utilities",
];

export const snippets = [
  {
    id: "hashed-bearer-token-auth",
    title: "Hashed bearer token authentication",
    description:
      "A lightweight token auth flow with server-side hashing, expiry checks, and role-aware middleware.",
    category: "PHP",
    projectSlug: "travel-booking-platform-backend",
    projectTitle: "Travel Booking Platform Backend",
    stack: ["PHP", "MySQL"],
    highlighted: true,
    updatedAt: "2026-06-15",
  },
  {
    id: "paystack-payment-verification",
    title: "Payment verification pipeline",
    description:
      "Server-side payment verification that reconciles provider status with local booking and passport purchase records.",
    category: "PHP",
    projectSlug: "travel-booking-platform-backend",
    projectTitle: "Travel Booking Platform Backend",
    stack: ["PHP", "Paystack"],
    highlighted: true,
    updatedAt: "2026-06-15",
  },
  {
    id: "cloudinary-signed-image-uploads",
    title: "Signed image upload payloads",
    description:
      "A scoped Cloudinary signing flow for homepage and destination media uploads with normalized folder and public ID rules.",
    category: "PHP",
    projectSlug: "travel-booking-platform-backend",
    projectTitle: "Travel Booking Platform Backend",
    stack: ["PHP", "Cloudinary"],
    highlighted: false,
    updatedAt: "2026-06-15",
  },
  {
    id: "notification-fanout-dispatch",
    title: "Notification fan-out dispatcher",
    description:
      "Coordinates in-app notifications and transactional email delivery from the same backend account and booking events.",
    category: "PHP",
    projectSlug: "travel-booking-platform-backend",
    projectTitle: "Travel Booking Platform Backend",
    stack: ["PHP", "ZeptoMail"],
    highlighted: false,
    updatedAt: "2026-06-15",
  },
  {
    id: "payship-transaction-status-map",
    title: "transactionStatusMap",
    description:
      "Maps payment, pending, and failed transaction states into concise labels used in PayShip activity flows.",
    category: "Flutter",
    projectSlug: "payship-fintech-platform",
    projectTitle: "PayShip",
    stack: ["Flutter", "Dart"],
    updatedAt: "2026-06-12",
  },
  {
    id: "payship-notification-route",
    title: "notificationRouteResolver",
    description:
      "Resolves notification intents into safe in-app destinations for payment and account activity updates.",
    category: "Flutter",
    projectSlug: "payship-fintech-platform",
    projectTitle: "PayShip",
    stack: ["Flutter", "Firebase"],
    updatedAt: "2026-06-11",
  },
  {
    id: "atlanticstay-filter-sync",
    title: "syncListingFilters",
    description:
      "Keeps listing filters, URL params, and visible results aligned without duplicating state updates.",
    category: "React",
    projectSlug: "atlanticstay-booking-platform",
    projectTitle: "Atlantic Stay",
    stack: ["React", "Search UI"],
    updatedAt: "2026-06-12",
  },
  {
    id: "primewave-section-groups",
    title: "groupServiceSections",
    description:
      "Normalizes service content blocks into consistent card groups for multi-service landing and detail pages.",
    category: "React",
    projectSlug: "primewave-digital-services-platform",
    projectTitle: "PrimeWave Digital Services Platform",
    stack: ["React", "Content Modeling"],
    updatedAt: "2026-06-10",
  },
  {
    id: "lugspace-menu-focus-trap",
    title: "trapMenuFocus",
    description:
      "Keeps keyboard focus inside student navigation drawers until the active panel is closed.",
    category: "Accessibility",
    projectSlug: "lugspace-student-community-platform",
    projectTitle: "LugSpace",
    stack: ["React", "Accessibility"],
    updatedAt: "2026-06-12",
  },
  {
    id: "lgsc-result-badge-state",
    title: "resultBadgeState",
    description:
      "Converts raw election result states into readable labels and status colors for dashboard summaries.",
    category: "Utilities",
    projectSlug: "lgsc-election-results-platform",
    projectTitle: "LGSC Election Results Platform",
    stack: ["React", "Data Formatting"],
    updatedAt: "2026-06-11",
  },
  {
    id: "excaco-money-label",
    title: "normalizeMoneyLabel",
    description:
      "Formats compact property price labels into cleaner marketing and listing-friendly values.",
    category: "Utilities",
    projectSlug: "excaco-real-estate-platform",
    projectTitle: "ExcaCo",
    stack: ["React", "Property UI"],
    updatedAt: "2026-06-08",
  },
].sort(
  (left, right) =>
    getContentDateSortValue(right.updatedAt) -
    getContentDateSortValue(left.updatedAt),
);

export const newsletterPage = {
  eyebrow: "Newsletter",
  title: "Newsletter",
  lede: "Occasional notes on design systems, frontend delivery, and the product decisions behind developer-focused interfaces.",
  benefits: [
    "Case studies, components, and shipping notes that are actually reusable.",
    "A slower publishing rhythm focused on signal instead of filler.",
    "Thoughtful updates on design-engineering workflows as the archive grows.",
  ],
  issues: [
    {
      title: "Designing role-based cleaning operations",
      excerpt:
        "Keeping customer, cleaner, and operations workflows connected without making responsibilities unclear.",
    },
    {
      title: "Making election results easier to read",
      excerpt: "Building for clarity when election information changes over time.",
    },
  ],
};
