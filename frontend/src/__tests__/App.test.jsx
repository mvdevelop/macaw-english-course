import { render, screen } from "../test-utils";
import App from "../App";

describe("App Component", () => {
  it("renders login page on /login", () => {
    window.history.pushState({}, "", "/login");
    render(<App />);

    expect(screen.getByText("Bem-vindo de volta")).toBeInTheDocument();
  });

  it("renders signup page on /signup", () => {
    window.history.pushState({}, "", "/signup");
    render(<App />);

    const criarContaTexts = screen.getAllByText("Criar conta");
    expect(criarContaTexts.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Registre-se para começar a aprender")).toBeInTheDocument();
  });
});
