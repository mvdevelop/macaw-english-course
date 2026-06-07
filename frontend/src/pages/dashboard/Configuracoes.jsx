"use client"
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "../../i18n/LanguageContext";
import ThemeToggle from "../../components/ThemeToggle";
import LanguageSelector from "../../components/LanguageSelector";
import {
  SettingsIcon,
  BellIcon,
  ShieldIcon,
  GlobeIcon,
  MoonIcon,
  LogOutIcon,
  UserIcon,
  ChevronRightIcon,
  Trash2Icon,
  SaveIcon,
} from "lucide-react";

export default function Configuracoes() {
  const { user, logout } = useAuth();
  const { theme } = useThemeContext();

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false,
  });

  const [showDanger, setShowDanger] = useState(false);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <SettingsIcon className="size-6 text-primary" strokeWidth={1.5} />
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-white">Configurações</h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Gerencie suas preferências e conta
        </p>
      </div>

      {/* ── Seção: Aparência ── */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <MoonIcon className="size-4 text-slate-400" strokeWidth={1.5} />
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white uppercase tracking-wider">Aparência</h2>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700/50">
            <div className="flex items-center gap-3">
              <MoonIcon className="size-5 text-slate-400" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-white">Tema Escuro/Claro</p>
                <p className="text-xs text-slate-400">Alternar entre tema claro e escuro</p>
              </div>
            </div>
            <ThemeToggle />
          </div>

          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <GlobeIcon className="size-5 text-slate-400" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-white">Idioma</p>
                <p className="text-xs text-slate-400">Português, English, Español</p>
              </div>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </section>

      {/* ── Seção: Notificações ── */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <BellIcon className="size-4 text-slate-400" strokeWidth={1.5} />
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white uppercase tracking-wider">Notificações</h2>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 overflow-hidden">
          {[
            { key: "email", label: "Notificações por Email", desc: "Receba atualizações dos cursos por email" },
            { key: "push", label: "Notificações Push", desc: "Alertas no navegador sobre seu progresso" },
            { key: "sms", label: "SMS", desc: "Mensagens de texto para lembretes importantes" },
            { key: "marketing", label: "Ofertas e Novidades", desc: "Descontos, novos cursos e conteúdos" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 last:border-b-0">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-white">{item.label}</p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[item.key]}
                  onChange={() => setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          ))}
        </div>
      </section>

      {/* ── Seção: Conta ── */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <UserIcon className="size-4 text-slate-400" strokeWidth={1.5} />
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white uppercase tracking-wider">Conta</h2>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
                <UserIcon size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-white">{user?.name}</p>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="flex items-center gap-3 w-full px-5 py-4 text-sm text-fail hover:bg-fail/5 transition"
          >
            <LogOutIcon size={18} strokeWidth={1.5} />
            Sair da conta
            <ChevronRightIcon size={16} className="ml-auto" strokeWidth={1.5} />
          </button>
        </div>
      </section>

      {/* ── Seção: Perigo ── */}
      {!showDanger ? (
        <button
          onClick={() => setShowDanger(true)}
          className="text-xs text-slate-400 hover:text-fail transition"
        >
          Opções avançadas
        </button>
      ) : (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <ShieldIcon className="size-4 text-fail" strokeWidth={1.5} />
            <h2 className="text-sm font-semibold text-fail uppercase tracking-wider">Zona de Perigo</h2>
          </div>
          <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/10 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <Trash2Icon className="size-5 text-fail" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-white">Excluir Conta</p>
                  <p className="text-xs text-slate-400">Essa ação não pode ser desfeita</p>
                </div>
              </div>
              <button className="px-4 py-2 rounded-lg bg-fail hover:bg-red-600 text-white text-xs font-medium transition">
                Excluir
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
