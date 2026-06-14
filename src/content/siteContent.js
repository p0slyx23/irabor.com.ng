import { getContentDateSortValue } from "../core/dateFormatting.js";

export const siteBrand = {
  cycle: "Product Design + Mobile",
  name: "irabor",
  footerLabel: "irabor 2026",
  tagline: "Product Designer & Full-Stack Engineer",
  location: "Lagos, Nigeria",
  email: "irabor.art@gmail.com",
  resumeUrl: "/assets/files/Irabor-Joseph-Ehis.pdf",
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
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/joseph-irabor",
    icon: "linkedin",
  },
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
  lede: "I design and build digital products across product design, frontend engineering, mobile development, and backend systems with an emphasis on scalable architecture and production-ready execution.",
  paragraphs: [
    "My work sits between product design and implementation, which means I care as much about how an interface behaves in code as how it looks in a mockup.",
    "Across fintech, travel, civic, real-estate, and service platforms, I focus on building systems that stay readable, maintainable, and trustworthy as products grow.",
    "I am most useful on teams that need product thinking, frontend execution, mobile delivery, backend architecture, and design decisions that can survive real-world constraints.",
  ],
  capabilities: [
    "UI/UX design for product interfaces and flows",
    "Design systems and reusable component thinking",
    "Flutter-based mobile interface implementation",
    "React frontend architecture and product UI delivery",
    "PHP-backed platform and API collaboration",
    "Accessibility-minded interaction and content structure",
    "PHP API architecture and backend development",
    "Database design and data modelling",
    "Authentication and authorization systems",
    "Backend integrations and platform workflows",
    "Scalable application architecture",
    "Content management and business workflow systems",
  ],
  principles: [
    "Typography and structure before ornament",
    "Reusable systems over one-off screens",
    "Interfaces that stay clear under pressure",
    "Design decisions that hold up in implementation",
    "Backend systems should be as maintainable as interfaces",
    "Scalable architecture over short-term fixes",
  ],
  availability:
    "Open to product design, mobile, frontend, backend, and full-stack product collaborations where systems thinking and execution quality matter.",
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

const tourOduduwaProjectStack = [
  {
    id: "php",
    badge: "php",
    badgeTone: "purple",
    title: "php",
    description:
      "Server-side application logic powering platform workflows and tourism content delivery.",
  },
  {
    id: "api-development",
    badge: "api",
    badgeTone: "sky",
    title: "api development",
    description:
      "Endpoints supporting destinations, attractions, experiences, and platform operations.",
  },
  {
    id: "database-design",
    badge: "db",
    badgeTone: "neutral",
    title: "database design",
    description:
      "Data modelling, relationships, and schema planning for scalable platform development.",
  },
  {
    id: "content-workflows",
    badge: "cms",
    badgeTone: "ice",
    title: "content workflows",
    description:
      "Backend support for organizing and maintaining tourism content efficiently.",
  },
  {
    id: "auth-security",
    badge: "auth",
    badgeTone: "slate",
    title: "auth & security",
    description:
      "Authentication and access control for reliable platform management and integrations.",
  },
  {
    id: "performance",
    badge: "perf",
    badgeTone: "pink",
    title: "performance",
    description:
      "Performance-focused backend decisions for stability under growing platform demand.",
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

const projectStacks = {
  "atlanticstay-booking-platform": atlanticStayProjectStack,
  "excaco-real-estate-platform": excacoProjectStack,
  "lgsc-election-results-platform": lgscProjectStack,
  "lugspace-student-community-platform": lugspaceProjectStack,
  "payship-fintech-platform": payshipProjectStack,
  "primewave-digital-services-platform": primewaveProjectStack,
  "tour-oduduwa-tourism-platform": tourOduduwaProjectStack,
};

export function getProjectStack(slug) {
  return projectStacks[slug] ?? [];
}

export const projectCategories = ["All", "Case Studies"];

export const projectPosts = [
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
      src: "/images/projects/primewave/primewave-cover.jpg",
      alt: "PrimeWave digital services platform",
    },
  },
  {
    slug: "atlanticstay-booking-platform",
    title: "Atlantic Stay",
    category: "Case Studies",
    date: "Aug 2025",
    readTime: "8 min",
    excerpt:
      "A vacation rental and property discovery platform designed to simplify accommodation search, property management, and booking experiences across multiple listings.",
    tags: ["react", "php", "travel-tech", "booking-platform", "marketplace"],
    featured: false,
    image: {
      src: "/images/projects/atlanticstay/atlanticstay-cover.jpg",
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
      src: "/images/projects/lugspace/lugspace-cover.jpg",
      alt: "LugSpace student platform",
    },
  },
  {
    slug: "excaco-real-estate-platform",
    title: "ExcaCo",
    category: "Case Studies",
    date: "Jan 2025",
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
      src: "/images/projects/excaco/excaco-cover.jpg",
      alt: "ExcaCo real estate platform",
    },
  },
  {
    slug: "lgsc-election-results-platform",
    title: "LGSC Election Results Platform",
    category: "Case Studies",
    date: "May 2025",
    readTime: "8 min",
    excerpt:
      "A real-time election results platform designed to provide transparent access to candidate standings, vote percentages, and election updates through a responsive digital dashboard.",
    tags: ["react", "php", "civic-tech", "elections", "real-time-data"],
    featured: false,
    image: {
      src: "/images/projects/lgsc/lgsc-cover.jpg",
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
      src: "/images/projects/payship/payship-cover.jpg",
      alt: "PayShip native mobile fintech experience",
    },
  },
  {
    slug: "tour-oduduwa-tourism-platform",
    title: "Tour Oduduwa",
    category: "Case Studies",
    date: "Feb 2026",
    readTime: "15 min",
    excerpt:
      "Backend architecture and PHP API development for a tourism discovery platform connecting travelers with destinations, cultural experiences, tours, and attractions across Western Nigeria.",
    tags: ["backend", "php", "api", "tourism", "travel", "platform"],
    featured: true,
    image: {
      src: "/images/projects/tour-oduduwa/tour-oduduwa-cover.jpg",
      alt: "Tour Oduduwa tourism platform",
    },
  },
].sort(
  (left, right) =>
    getContentDateSortValue(right.date) - getContentDateSortValue(left.date),
);

export const homeRecentProjects = projectPosts.slice(0, 3);

export const projectEntries = {
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
      src: "/images/projects/payship/payship-cover.jpg",
      alt: "PayShip native mobile product screens",
    },
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
    related: ["tour-oduduwa-tourism-platform"],
  },
  "tour-oduduwa-tourism-platform": {
    slug: "tour-oduduwa-tourism-platform",
    eyebrow: "case study",
    title: "Tour Oduduwa",
    lede: "A tourism discovery platform designed to connect travelers with destinations, cultural experiences, attractions, and tour opportunities across Western Nigeria.",
    meta: [
      "PHP Backend Development",
      "API & Platform Systems",
      "Completed",
      "Completed Feb 2026",
    ],
    tags: ["backend", "php", "api", "tourism", "travel", "platform"],
    coverImage: {
      src: "/images/projects/tour-oduduwa/tour-oduduwa-cover.jpg",
      alt: "Tour Oduduwa platform",
    },
    stack: tourOduduwaProjectStack,
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
        id: "architecture",
        label: "Backend Systems",
      },
      {
        id: "content",
        label: "Content Workflows",
      },
      {
        id: "delivery",
        label: "Delivery Approach",
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
          "Tour Oduduwa is a tourism platform that showcases destinations, attractions, cultural experiences, and travel opportunities across Western Nigeria.",
          "The platform enables users to explore locations, discover experiences, and access tourism-related information through a centralized digital experience.",
          "From a backend perspective, the product needed to support a broad mix of structured destination data, editorial content, and platform-driven interactions without letting the content model become difficult to manage over time.",
        ],
      },
      {
        id: "role",
        heading: "My Role",
        paragraphs: [
          "I served as the Backend Developer on the project, working primarily with PHP.",
          "My focus was building and maintaining the server-side foundation that supports content management, platform functionality, data processing, and application integrations.",
          "That work included shaping API behavior, organizing data relationships, supporting administrative workflows, and creating a backend structure that could handle a growing tourism catalog in a maintainable way.",
        ],
      },
      {
        id: "architecture",
        heading: "Backend Systems",
        paragraphs: [
          "The backend was designed to support tourism content, destination listings, platform operations, and scalable data management.",
          "Emphasis was placed on maintainability, performance, reliability, and building a PHP-based foundation that supports future platform growth.",
          "Because the platform spans destinations, attractions, experiences, and discovery flows, the architecture had to balance clear data modeling with practical API responses that could support multiple surfaces cleanly.",
        ],
        list: [
          "PHP backend architecture",
          "API development",
          "Database design",
          "Content management workflows",
          "Platform integrations",
          "Authentication and security",
          "Performance optimization",
          "Scalable data management",
        ],
      },
      {
        id: "content",
        heading: "Content Workflows",
        paragraphs: [
          "A key part of the system was supporting tourism content in a way that remained structured, searchable, and reusable across the platform.",
          "That meant treating destinations, experiences, and supporting travel information as connected data rather than isolated entries, which helped create a more coherent discovery experience for users.",
          "The backend also needed to support content updates and operational workflows without introducing unnecessary friction for future platform maintenance.",
        ],
        list: [
          "Destination and attraction data relationships",
          "Tourism content structuring",
          "Searchable content organization",
          "Administrative content workflows",
          "Reusable API response design",
        ],
      },
      {
        id: "delivery",
        heading: "Delivery Approach",
        paragraphs: [
          "My approach centered on building a backend that was practical to extend, easy to reason about, and stable enough to support a content-heavy product as it evolved.",
          "Rather than optimizing for short-term speed alone, the work emphasized clear separation of responsibilities, reliable API behavior, and data structures that could support additional destinations, experiences, and integrations over time.",
          "The result was a backend layer that could serve current platform needs while remaining flexible for future product expansion.",
        ],
      },
      {
        id: "outcome",
        heading: "Outcome",
        paragraphs: [
          "The project delivered a stable backend foundation capable of supporting destination discovery and tourism experiences.",
          "The work demonstrates my ability to architect and develop PHP backend systems that power content-driven digital platforms.",
          "It also reflects my ability to think beyond isolated endpoints and build backend systems around product structure, operational clarity, and long-term maintainability.",
        ],
      },
    ],
    related: ["payship-fintech-platform"],
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
      src: "/images/projects/primewave/primewave-cover.jpg",
      alt: "PrimeWave digital services platform",
    },
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
      src: "/images/projects/atlanticstay/atlanticstay-cover.jpg",
      alt: "Atlantic Stay booking platform",
    },
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
      src: "/images/projects/lugspace/lugspace-cover.jpg",
      alt: "LugSpace student platform",
    },
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
      "Completed Jan 2025",
    ],
    tags: [
      "react",
      "php",
      "real-estate",
      "property-tech",
      "investment-platform",
    ],
    coverImage: {
      src: "/images/projects/excaco/excaco-cover.jpg",
      alt: "ExcaCo real estate platform",
    },
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
      "Completed May 2025",
    ],
    tags: ["react", "php", "civic-tech", "elections", "real-time-data"],
    coverImage: {
      src: "/images/projects/lgsc/lgsc-cover.jpg",
      alt: "LGSC election results platform",
    },
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

export const blogCategories = ["All"];

export const blogPosts = [];

export const blogEntries = {};

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
    id: "tour-oduduwa-destination-query",
    title: "buildDestinationQuery",
    description:
      "Builds clean destination query payloads for state, category, and keyword-based tourism discovery.",
    category: "PHP",
    projectSlug: "tour-oduduwa-tourism-platform",
    projectTitle: "Tour Oduduwa",
    stack: ["PHP", "API"],
    highlighted: true,
    updatedAt: "2026-06-13",
  },
  {
    id: "tour-oduduwa-api-resource",
    title: "formatApiResource",
    description:
      "Shapes destination and experience responses into a stable API format for frontend consumption.",
    category: "PHP",
    projectSlug: "tour-oduduwa-tourism-platform",
    projectTitle: "Tour Oduduwa",
    stack: ["PHP", "REST API"],
    updatedAt: "2026-06-09",
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
];

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
      title: "Tour Oduduwa",
      excerpt:
        "Backend architecture and PHP API work for a tourism discovery platform.",
    },
    {
      title: "PayShip",
      excerpt: "The first published case study in the portfolio archive.",
    },
  ],
};
