import Link from "next/link";
import { Facebook, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-xl font-bold text-primary">
              WorkChat<span className="text-secondary">Seattle</span>
            </Link>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              A professional network for Russian-speaking women in the Seattle
              area. We focus on knowledge sharing, building community, and
              career development across all industries.
            </p>
            <div className="mt-4 flex space-x-4">
              <a
                href="https://www.facebook.com/groups/workchatseattle"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="mailto:contact@workchatseattle.com"
                className="text-muted-foreground hover:text-primary"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/mentors"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Find a Mentor
                </Link>
              </li>
              <li>
                <Link
                  href="/mentor/register"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Become a Mentor
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold">Contact</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/groups/workchatseattle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Facebook Group
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} WorkChatSeattle. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
