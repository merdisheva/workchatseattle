import { Link } from "@/i18n/routing";
import { Facebook, Linkedin, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");

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
              {t("description")}
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
                href="https://www.linkedin.com/company/work-chat-seattle/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="mailto:workchatseattle@gmail.com"
                className="text-muted-foreground hover:text-primary"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold">{t("quickLinks")}</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("events")}
                </Link>
              </li>
              <li>
                <Link
                  href="/mentors"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("findMentor")}
                </Link>
              </li>
              <li>
                <Link
                  href="/mentor/register"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("becomeMentor")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold">{t("contact")}</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("contactUs")}
                </Link>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/groups/workchatseattle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("facebookGroup")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} WorkChatSeattle. {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
