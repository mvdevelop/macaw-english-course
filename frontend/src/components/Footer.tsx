import {
  ShieldCheckIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
} from "lucide-react";
import { useTranslation } from "../i18n/LanguageContext";

interface FooterLink {
  label: string;
  href: string;
  target?: string;
}

interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

export default function Footer() {
  const { t } = useTranslation();

  const footerLinks: FooterLinkGroup[] = [
    {
      title: t("footer.institutional"),
      links: [
        { label: t("footer.aboutUs"), href: "#" },
        { label: t("footer.howItWorks"), href: "#" },
        { label: t("footer.careers"), href: "#" },
        { label: t("footer.blog"), href: "#" },
      ],
    },
    {
      title: t("footer.support"),
      links: [
        { label: t("footer.helpCenter"), href: "#" },
        {
          label: t("footer.reclameAqui"),
          href: "https://www.reclameaqui.com.br",
          target: "_blank",
        },
        { label: t("footer.faq"), href: "#faq" },
        { label: t("footer.contactUs"), href: "#contato" },
      ],
    },
    {
      title: t("footer.legal"),
      links: [
        { label: t("footer.privacyPolicy"), href: "#" },
        { label: t("footer.termsOfUse"), href: "#" },
        { label: t("footer.lgpd"), href: "#" },
        { label: t("footer.cookiePolicy"), href: "#" },
      ],
    },
  ];

  return (
    <footer className="w-full bg-[#0f0f1a] text-white">
      {/* Top bar — selos */}
      <div className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-6 px-6 py-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheckIcon className="size-4 text-primary" />
            <span>{t("footer.secureSite")}</span>
          </div>
          <span className="text-slate-700">|</span>
          <a
            href="https://www.reclameaqui.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition"
          >
            {t("footer.reclameAquiBadge")}
          </a>
          <span className="text-slate-700">|</span>
          <span>{t("footer.lgpdCompliant")}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <img
                src="/macaw.png"
                alt="Macaw"
                className="size-8 object-contain"
                width={32}
                height={32}
              />
              <span className="text-xl font-bold text-primary">
                Macaw English School
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-sm">
              {t("footer.description")}
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href="#"
                className="size-9 rounded-lg bg-slate-800 hover:bg-primary transition flex items-center justify-center text-slate-400 hover:text-white"
              >
                <FacebookIcon className="size-4" />
              </a>
              <a
                href="#"
                className="size-9 rounded-lg bg-slate-800 hover:bg-primary transition flex items-center justify-center text-slate-400 hover:text-white"
              >
                <InstagramIcon className="size-4" />
              </a>
              <a
                href="#"
                className="size-9 rounded-lg bg-slate-800 hover:bg-primary transition flex items-center justify-center text-slate-400 hover:text-white"
              >
                <YoutubeIcon className="size-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="font-semibold text-sm text-white mb-4 uppercase tracking-wider">
                {group.title}
              </h3>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.target || undefined}
                      rel={link.target ? "noopener noreferrer" : undefined}
                      className="text-sm text-slate-400 hover:text-primary transition"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Contact bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 py-6 flex flex-wrap items-center justify-between gap-4 text-sm text-slate-400">
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-1.5">
              <PhoneIcon className="size-3.5 text-primary" />
              <span>+55 (11) 98765-4321</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MailIcon className="size-3.5 text-primary" />
              <span>contato@macawenglish.com</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPinIcon className="size-3.5 text-primary" />
              <span>São Paulo, SP — Brasil</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>{t("footer.copyright")}</p>
          <p>CNPJ: 00.000.000/0001-00</p>
        </div>
      </div>
    </footer>
  );
}
