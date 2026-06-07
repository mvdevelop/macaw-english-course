import { render, screen } from "../../test-utils";
import Footer from "../Footer";

describe("Footer Component", () => {
  it("renders the brand name", () => {
    render(<Footer />);
    expect(screen.getByText("Macaw English School")).toBeInTheDocument();
  });

  it("renders footer section titles", () => {
    render(<Footer />);
    expect(screen.getByText("Institucional")).toBeInTheDocument();
    expect(screen.getByText("Suporte")).toBeInTheDocument();
    expect(screen.getByText("Legal")).toBeInTheDocument();
  });

  it("renders contact information", () => {
    render(<Footer />);
    expect(screen.getByText("+55 (11) 98765-4321")).toBeInTheDocument();
    expect(screen.getByText("contato@macawenglish.com")).toBeInTheDocument();
    expect(screen.getByText("São Paulo, SP — Brasil")).toBeInTheDocument();
  });

  it("renders the copyright notice", () => {
    render(<Footer />);
    expect(
      screen.getByText(/Copyright 2024.*Macaw English School/)
    ).toBeInTheDocument();
  });
});
