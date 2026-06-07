import { render, screen, fireEvent } from "../../test-utils";
import LanguageSelector from "../LanguageSelector";

describe("LanguageSelector Component (mobile variant)", () => {
  it("renders all languages in mobile variant", () => {
    render(<LanguageSelector variant="mobile" />);
    expect(screen.getByText("Português")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Español")).toBeInTheDocument();
  });

  it("has clickable language buttons", () => {
    render(<LanguageSelector variant="mobile" />);
    const englishBtn = screen.getByText("English").closest("button");
    expect(englishBtn).toBeInTheDocument();
  });
});

describe("LanguageSelector Component (desktop variant)", () => {
  it("opens dropdown on click", () => {
    render(<LanguageSelector />);
    const toggle = screen.getAllByRole("button")[0];
    fireEvent.click(toggle);
    expect(screen.getByText("Português")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Español")).toBeInTheDocument();
  });
});
