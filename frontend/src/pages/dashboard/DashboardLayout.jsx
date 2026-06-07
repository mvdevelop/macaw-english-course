import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboardIcon,
    BookOpenIcon,
    SettingsIcon,
    LogOutIcon,
    MenuIcon,
    XIcon,
    UserIcon,
    GraduationCapIcon,
    SparklesIcon,
} from "lucide-react";
import ThemeToggle from "../../components/ThemeToggle";

const sidebarLinks = [
    { icon: LayoutDashboardIcon, label: "Dashboard", href: "/dashboard" },
    { icon: BookOpenIcon, label: "Meus Cursos", href: "/my-courses" },
    { icon: SparklesIcon, label: "AI Practice", href: "/dashboard/ai-practice" },
    { icon: GraduationCapIcon, label: "Certificados", href: "/dashboard/certificados" },
    { icon: UserIcon, label: "Perfil", href: "/dashboard/perfil" },
    { icon: SettingsIcon, label: "Configurações", href: "/dashboard/configuracoes" },
];

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-brand-dark">
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed md:sticky top-0 z-50 md:z-auto h-screen w-64 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 transition-transform duration-300 ${
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0`}
            >
                {/* Logo + ThemeToggle */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800">
                    <Link to="/" className="text-xl font-bold text-primary">
                        Macaw
                    </Link>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <button
                            className="md:hidden text-slate-400"
                            onClick={() => setMobileOpen(false)}
                        >
                            <XIcon size={24} />
                        </button>
                    </div>
                </div>

                {/* Nav links */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {sidebarLinks.map((link) => {
                        const isActive = location.pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                to={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                }`}
                            >
                                <link.icon size={18} />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User section */}
                <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="size-9 rounded-full bg-primary/20 flex items-center justify-center">
                            <UserIcon size={16} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.name}</p>
                            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-fail hover:bg-fail/10 transition"
                    >
                        <LogOutIcon size={16} />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar (mobile) */}
                <header className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900">
                    <button onClick={() => setMobileOpen(true)}>
                        <MenuIcon size={24} />
                    </button>
                    <span className="text-lg font-bold text-primary">Macaw</span>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6 md:p-10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
