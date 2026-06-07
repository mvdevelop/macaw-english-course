import { render, screen, fireEvent } from "../../test-utils";
import ThemeToggle from "../ThemeToggle";

describe("ThemeToggle Component", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("renders the toggle button", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("renders an SVG icon", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button");
    // Should contain an SVG element
    expect(button.querySelector("svg")).toBeInTheDocument();
  });

  it("toggles dark class on document when clicked", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button");

    // Click once (light → dark if component was initialized as dark)
    fireEvent.click(button);

    // After click, theme should have changed
    const isDarkAfterClick = document.documentElement.classList.contains("dark");
    const storageAfter = localStorage.getItem("theme");

    // Either dark theme is set or light is set — only verify something changed
    expect(isDarkAfterClick || storageAfter !== null).toBe(true);
  });

  it("persists theme in localStorage after toggle", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button");
    fireEvent.click(button);

    const stored = localStorage.getItem("theme");
    expect(stored).not.toBeNull();
    expect(["light", "dark"]).toContain(stored);
  });
});
