import { MenuIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useThemeContext } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../i18n/LanguageContext";
import { navLinks } from "../data/navLinks";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import LanguageSelector from "./LanguageSelector";

export default function Navbar() {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const { theme } = useThemeContext();
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (openMobileMenu) {
      document.body.classList.add("max-md:overflow-hidden");
    } else {
      document.body.classList.remove("max-md:overflow-hidden");
    }
  }, [openMobileMenu]);

  return (
    <nav
      className={`flex items-center justify-between fixed z-50 top-0 w-full px-6 md:px-16 lg:px-24 xl:px-32 py-4 ${openMobileMenu ? "" : "backdrop-blur"}`}
    >
      <a href="/" className="flex items-center gap-2">
        <img
          src="/macaw.png"
          alt="Macaw"
          className="size-7 object-contain"
          width={28}
          height={28}
        />
        <span className="text-xl font-bold text-primary">Macaw</span>
      </a>
      <div className="hidden items-center md:gap-8 lg:gap-9 md:flex lg:pl-20">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="text-base font-medium nav-link-neon transition-colors duration-300"
          >
            {t(link.name)}
          </a>
        ))}
      </div>
      {/* Mobile menu */}
      <div
        className={`fixed inset-0 flex flex-col items-center justify-center gap-6 text-lg font-medium bg-white/60 dark:bg-black/40 backdrop-blur-md md:hidden transition duration-300 ${openMobileMenu ? "translate-x-0" : "-translate-x-full"}`}
      >
        {navLinks.map((link) => (
          <a key={link.name} href={link.href}>
            {t(link.name)}
          </a>
        ))}
        <LanguageSelector variant="mobile" />
        {user ? (
          <button
            onClick={() => {
              navigate("/dashboard");
              setOpenMobileMenu(false);
            }}
          >
            {t("nav.dashboard")}
          </button>
        ) : (
          <>
            <button
              onClick={() => {
                navigate("/login");
                setOpenMobileMenu(false);
              }}
            >
              {t("nav.login")}
            </button>
            <button
              onClick={() => {
                navigate("/signup");
                setOpenMobileMenu(false);
              }}
              className="px-4 py-2 bg-primary hover:bg-primary-dark transition text-white rounded-md"
            >
              {t("nav.signup")}
            </button>
          </>
        )}
        <button
          className="aspect-square size-10 p-1 items-center justify-center bg-primary hover:bg-primary-dark transition text-white rounded-md flex"
          onClick={() => setOpenMobileMenu(false)}
        >
          <XIcon />
        </button>
      </div>
      <div className="flex items-center gap-4">
        <LanguageSelector />
        <ThemeToggle />
        {user ? (
          <button
            onClick={() => navigate("/dashboard")}
            className="hidden md:block px-4 py-2 bg-primary hover:bg-primary-dark transition text-white rounded-md"
          >
            {t("nav.dashboard")}
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="hidden md:block hover:bg-slate-100 dark:hover:bg-brand-dark/60 transition px-4 py-2 border border-primary rounded-md"
            >
              {t("nav.login")}
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="hidden md:block px-4 py-2 bg-primary hover:bg-primary-dark transition text-white rounded-md"
            >
              {t("nav.signup")}
            </button>
          </>
        )}
        <button
          onClick={() => setOpenMobileMenu(!openMobileMenu)}
          className="md:hidden"
        >
          <MenuIcon size={26} className="active:scale-90 transition" />
        </button>
      </div>
    </nav>
  );
}
