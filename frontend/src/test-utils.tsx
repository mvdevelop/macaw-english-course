import { render as rtlRender } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import { ThemeContextProvider } from "./context/ThemeContext";
import { AuthContextProvider } from "./context/AuthContext";
import { LanguageProvider } from "./i18n/LanguageContext";

/**
 * Custom render that wraps components with the same providers used in main.jsx.
 * This makes tests more realistic and reduces boilerplate.
 */
function render(ui, { options = {} } = {}) {
  function Wrapper({ children }) {
    return (
      <BrowserRouter>
        <ThemeContextProvider>
          <AuthContextProvider>
            <LanguageProvider>{children}</LanguageProvider>
          </AuthContextProvider>
        </ThemeContextProvider>
      </BrowserRouter>
    );
  }

  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything so test files import from here
export * from "@testing-library/react";
export { render };
