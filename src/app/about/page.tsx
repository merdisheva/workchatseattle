import { Metadata } from "next";
import Image from "next/image";
import { Users, Target, Heart, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about WorkChatSeattle - a professional network for Russian-speaking women in the Seattle area.",
};

const values = [
  {
    icon: Users,
    title: "Community",
    description:
      "We believe in the power of connection. Our community brings together women from diverse backgrounds and industries to support each other's growth.",
  },
  {
    icon: Lightbulb,
    title: "Knowledge Sharing",
    description:
      "Learning never stops. We create opportunities for members to share their expertise and learn from one another through events and mentorship.",
  },
  {
    icon: Heart,
    title: "Support",
    description:
      "We understand the unique challenges women face in their careers. Our network provides a safe space for honest conversations and mutual support.",
  },
  {
    icon: Target,
    title: "Growth",
    description:
      "We are committed to helping every member achieve their professional goals, whether that's landing a new job, switching careers, or advancing in their field.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80"
            alt="Team collaboration"
            fill
            className="object-cover brightness-[0.35]"
            priority
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              About WorkChatSeattle
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-200">
              We are a professional network for Russian-speaking women in the
              Seattle area, dedicated to fostering career growth, building
              meaningful connections, and creating a supportive community.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative h-[400px] overflow-hidden rounded-2xl">
              <Image
                src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80"
                alt="Women networking"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Our Mission</h2>
              <p className="mt-4 text-muted-foreground">
                WorkChatSeattle was founded with a simple yet powerful mission:
                to create a space where Russian-speaking women in the Seattle
                area can connect, learn, and grow together professionally.
              </p>
              <p className="mt-4 text-muted-foreground">
                We understand that navigating a career in a new country comes
                with unique challenges. Language barriers, cultural differences,
                and the need to rebuild professional networks can make the
                journey feel isolating. That&apos;s why we created this
                community - to ensure no one has to face these challenges alone.
              </p>
              <p className="mt-4 text-muted-foreground">
                Our members come from all walks of life - from tech professionals
                and healthcare workers to entrepreneurs and creatives. What unites
                us is our shared experiences and our commitment to lifting each
                other up.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl font-bold">What We Do</h2>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start">
                  <div className="mr-4 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Host Regular Events</h4>
                    <p className="text-sm text-muted-foreground">
                      Virtual and in-person events on career development, leadership,
                      and professional skills
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Connect Mentors & Mentees</h4>
                    <p className="text-sm text-muted-foreground">
                      Match members with experienced professionals across various industries
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Facilitate Networking</h4>
                    <p className="text-sm text-muted-foreground">
                      Create opportunities both online and in-person to build lasting connections
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold">Provide Resources</h4>
                    <p className="text-sm text-muted-foreground">
                      Job searching tips, resume reviews, and interview preparation support
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative order-1 h-[400px] overflow-hidden rounded-2xl lg:order-2">
              <Image
                src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80"
                alt="Workshop session"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Our Values</h2>
            <p className="mt-4 text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <Card key={value.title} className="border-none bg-muted/30 text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Seattle Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1502175353174-a7a70e73b362?w=1920&q=80"
            alt="Seattle skyline"
            fill
            className="object-cover brightness-[0.3]"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">Based in Seattle</h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-200">
            Our community is rooted in the vibrant Seattle area, home to a thriving
            tech industry, diverse cultures, and endless opportunities for professional growth.
          </p>
        </div>
      </section>

      {/* Join Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Join Our Community</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Whether you&apos;re just starting your career journey or are an
            experienced professional looking to give back, there&apos;s a place
            for you in WorkChatSeattle.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://www.facebook.com/groups/workchatseattle"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90"
            >
              Join Facebook Group
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
