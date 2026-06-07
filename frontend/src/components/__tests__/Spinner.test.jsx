import { render, screen } from "../../test-utils";
import Spinner from "../Spinner";

describe("Spinner Component", () => {
  it("renders with default size (md)", () => {
    const { container } = render(<Spinner />);
    const spinner = container.firstChild;
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("w-12", "h-12", "border-4");
    expect(spinner).toHaveClass("animate-spin");
  });

  it("renders with small size", () => {
    const { container } = render(<Spinner size="sm" />);
    const spinner = container.firstChild;
    expect(spinner).toHaveClass("w-6", "h-6", "border-2");
  });

  it("renders with large size", () => {
    const { container } = render(<Spinner size="lg" />);
    const spinner = container.firstChild;
    expect(spinner).toHaveClass("w-16", "h-16", "border-[5px]");
  });

  it("falls back to md for unknown size", () => {
    const { container } = render(<Spinner size="unknown" />);
    const spinner = container.firstChild;
    expect(spinner).toHaveClass("w-12", "h-12", "border-4");
  });
});
