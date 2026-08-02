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

  // Seed events from Facebook group
  const sampleEvents = [
    {
      title: "Career Longevity: Navigating Stress in the Corporate World",
      titleRu:
        "Карьерное долголетие: как справляться со стрессом в корпоративном мире",
      description:
        "Join us for an event on career longevity and navigating stress in the corporate world. Created by Masha Makarenkova.",
      descriptionRu:
        "Приглашаем вас на встречу о карьерном долголетии и управлении стрессом в корпоративном мире. Создано: Masha Makarenkova.",
      date: new Date("2026-07-09T01:30:00Z"), // Jul 8 at 6:30 PM PDT
      isOnline: true,
    },
    {
      title: "AI for Humanities Professionals with Yuliana Loginova",
      titleRu: "AI (Искусственный интеллект) для гуманитариев с Юлианой Логиновой",
      description:
        "A discussion of artificial intelligence for humanities professionals with Yuliana Loginova. Shared by Masha Makarenkova.",
      descriptionRu:
        "Обсуждение искусственного интеллекта для гуманитариев с Юлианой Логиновой. Добавлено: Masha Makarenkova.",
      date: new Date("2026-06-21T16:30:00Z"), // Jun 21 at 9:30 AM PDT
      isOnline: true,
    },
    {
      title: "Career-Proof Yourself: LinkedIn Positioning",
      titleRu: "Сделайте свою карьеру устойчивой: позиционирование в LinkedIn",
      description:
        "Learn how to position yourself on LinkedIn to future-proof your career. Created by Oksana Willeke.",
      descriptionRu:
        "Узнайте, как правильно позиционировать себя в LinkedIn, чтобы обезопасить карьеру в будущем. Создано: Oksana Willeke.",
      date: new Date("2026-06-01T20:00:00Z"), // Jun 1 at 1:00 PM PDT
      isOnline: true,
    },
    {
      title: "Careers in Public Service: Workshop with Kendall Hodson",
      titleRu: "Карьера на государственной службе: воркшоп с Kendall Hodson",
      description:
        "A workshop exploring career opportunities in public service with Kendall Hodson. Shared by Irena Furmanova.",
      descriptionRu:
        "Воркшоп о карьерных возможностях на государственной службе с Kendall Hodson. Добавлено: Irena Furmanova.",
      date: new Date("2026-05-22T01:00:00Z"), // May 21 at 6:00 PM PDT
      isOnline: false,
      location: "8275 166th Ave NE, Ste 202, Redmond, WA 98052",
    },
    {
      title: "Networking + Meetup with Accountant Alexsandra Litmanovich",
      titleRu: "Нетворкинг + встреча с бухгалтером Alexsandra Litmanovich",
      description:
        "A networking meetup and consultation with accountant Alexsandra Litmanovich. Shared by Milana Alderman.",
      descriptionRu:
        "Нетворкинг-встреча и консультация с бухгалтером Alexsandra Litmanovich. Добавлено: Milana Alderman.",
      date: new Date("2026-02-23T01:00:00Z"), // Feb 22 at 5:00 PM PST
      isOnline: false,
      location: "Agave Cocina & Cantina, 17158 Redmond Way #180, Redmond, WA 98052",
    },
    {
      title: "The Laws of Abundance (Part 1)",
      titleRu: "Законы изобилия (ч1)",
      description:
        "The first session in a series about the laws of abundance. Created by Kira Gamolsky.",
      descriptionRu:
        "Первая часть серии встреч о законах изобилия. Создано: Kira Gamolsky.",
      date: new Date("2026-02-18T03:00:00Z"), // Feb 17 at 7:00 PM PST
      isOnline: true,
    },
    {
      title: "Master the AI-Powered Job Search in 2026",
      titleRu: "Осваиваем поиск работы с помощью ИИ в 2026 году",
      description:
        "Learn how to leverage AI tools to supercharge your job search in 2026. Shared by Masha Makarenkova.",
      descriptionRu:
        "Узнайте, как использовать инструменты ИИ, чтобы значительно улучшить поиск работы в 2026 году. Добавлено: Masha Makarenkova.",
      date: new Date("2026-02-06T01:45:00Z"), // Feb 5 at 5:45 PM PST
      isOnline: true,
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
