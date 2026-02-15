import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Seed Industries
  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Marketing",
    "Legal",
    "Real Estate",
    "Non-Profit",
    "Consulting",
    "Manufacturing",
    "Retail",
    "Media & Entertainment",
    "Government",
    "Other",
  ];

  for (const name of industries) {
    await prisma.industry.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Seed Expertise Areas
  const expertiseAreas = [
    "Software Engineering",
    "Product Management",
    "Data Science",
    "UX/UI Design",
    "Project Management",
    "Business Development",
    "Human Resources",
    "Operations",
    "Career Transitions",
    "Leadership",
    "Entrepreneurship",
    "Work-Life Balance",
    "Networking",
    "Interview Preparation",
    "Resume Review",
    "Salary Negotiation",
    "Other",
  ];

  for (const name of expertiseAreas) {
    await prisma.expertiseArea.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Seed sample events
  const sampleEvents = [
    {
      title: "Career Growth Strategies for Tech Professionals",
      description:
        "Join us for an insightful discussion on navigating career growth in the tech industry. We will cover topics such as building your personal brand, networking effectively, and identifying opportunities for advancement.",
      date: new Date("2026-03-15T18:00:00Z"),
      isOnline: true,
      zoomLink: "https://zoom.us/j/example1",
    },
    {
      title: "Women in Leadership: Panel Discussion",
      description:
        "Hear from successful women leaders across various industries as they share their journeys, challenges, and advice for aspiring leaders. Q&A session included.",
      date: new Date("2026-04-01T17:30:00Z"),
      isOnline: true,
      zoomLink: "https://zoom.us/j/example2",
    },
    {
      title: "Networking Mixer - Spring 2026",
      description:
        "An informal networking event to connect with fellow community members. Great opportunity to expand your professional network in the Seattle area.",
      date: new Date("2026-03-22T18:00:00Z"),
      isOnline: false,
      location: "Seattle, WA",
    },
    {
      title: "Resume Workshop",
      description:
        "Learn how to craft a compelling resume that stands out. Our expert will provide tips on formatting, content, and tailoring your resume for different roles.",
      date: new Date("2025-12-10T18:00:00Z"),
      isOnline: true,
      recordingUrl: "https://youtube.com/watch?v=example1",
    },
    {
      title: "Interview Skills Masterclass",
      description:
        "Master the art of interviewing with practical tips and mock interview sessions. Covers behavioral, technical, and case interviews.",
      date: new Date("2026-01-20T18:00:00Z"),
      isOnline: true,
      recordingUrl: "https://youtube.com/watch?v=example2",
    },
  ];

  for (const event of sampleEvents) {
    await prisma.event.create({
      data: event,
    });
  }

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
