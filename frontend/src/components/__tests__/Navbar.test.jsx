import { render, screen, fireEvent } from "../../test-utils";
import { MemoryRouter } from "react-router-dom";
import { ThemeContextProvider } from "../../context/ThemeContext";
import { AuthContextProvider } from "../../context/AuthContext";
import { LanguageProvider } from "../../i18n/LanguageContext";
import { render as rtlRender } from "@testing-library/react";
import Navbar from "../Navbar";

function renderNavbar({ initialEntries = ["/"] } = {}) {
  return rtlRender(
    <MemoryRouter initialEntries={initialEntries}>
      <ThemeContextProvider>
        <AuthContextProvider>
          <LanguageProvider>
            <Navbar />
          </LanguageProvider>
        </AuthContextProvider>
      </ThemeContextProvider>
    </MemoryRouter>
  );
}

describe("Navbar Component", () => {
  it("renders the brand logo and name", () => {
    renderNavbar();
    expect(screen.getByText("Macaw")).toBeInTheDocument();
    expect(screen.getByAltText("Macaw")).toBeInTheDocument();
  });

  it("renders navigation links (desktop + mobile)", () => {
    renderNavbar();
    // Links appear twice: desktop nav and mobile menu
    expect(screen.getAllByText("Home")).toHaveLength(2);
    expect(screen.getAllByText("Cursos")).toHaveLength(2);
    expect(screen.getAllByText("FAQ")).toHaveLength(2);
  });

  it("renders auth buttons (desktop + mobile)", () => {
    renderNavbar();
    // "Entrar" appears for both desktop and mobile
    expect(screen.getAllByText("Entrar").length).toBeGreaterThanOrEqual(1);
    // "Começar" appears for both desktop and mobile
    expect(screen.getAllByText("Começar").length).toBeGreaterThanOrEqual(1);
  });

  it("shows dashboard button instead of login when authenticated", () => {
    // Setup: store user in localStorage so AuthContext restores it
    localStorage.setItem("user", JSON.stringify({ id: "1", email: "test@test.com", name: "Test" }));

    renderNavbar();
    // Dashboard text should appear (desktop + mobile)
    expect(screen.getAllByText("Dashboard").length).toBeGreaterThanOrEqual(1);
  });
});
