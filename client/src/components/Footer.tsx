import { Link } from "wouter";
import { AR } from "@shared/translations";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-card text-card-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">⚽</span>
              </div>
              <span className="text-lg font-bold text-accent">{AR.app.title}</span>
            </div>
            <p className="text-sm text-muted-foreground">{AR.app.description}</p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-foreground">{AR.nav.home}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/">
                  <a className="text-muted-foreground hover:text-accent transition-colors">
                    {AR.matches.today}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/competitions">
                  <a className="text-muted-foreground hover:text-accent transition-colors">
                    {AR.nav.competitions}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/standings">
                  <a className="text-muted-foreground hover:text-accent transition-colors">
                    {AR.nav.standings}
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-foreground">معلومات</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about">
                  <a className="text-muted-foreground hover:text-accent transition-colors">
                    {AR.nav.about}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-muted-foreground hover:text-accent transition-colors">
                    {AR.nav.contact}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <a className="text-muted-foreground hover:text-accent transition-colors">
                    {AR.nav.privacy}
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-foreground">تواصل معنا</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">
                البريد الإلكتروني: <br />
                <a
                  href="mailto:info@footballlive.app"
                  className="text-accent hover:text-accent/80 transition-colors"
                >
                  info@footballlive.app
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} {AR.app.title}. جميع الحقوق محفوظة.
            </p>
            <div className="flex gap-4 text-sm">
              <Link href="/privacy">
                <a className="text-muted-foreground hover:text-accent transition-colors">
                  {AR.nav.privacy}
                </a>
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/contact">
                <a className="text-muted-foreground hover:text-accent transition-colors">
                  {AR.nav.contact}
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
