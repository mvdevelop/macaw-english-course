import { render, screen } from "../../test-utils";
import SectionTitle from "../SectionTitle";

describe("SectionTitle Component", () => {
  it("renders all three text props", () => {
    render(<SectionTitle text1="Label" text2="Title" text3="Subtitle" />);

    expect(screen.getByText("Label")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Subtitle")).toBeInTheDocument();
  });

  it("renders with only text1 and text2", () => {
    render(<SectionTitle text1="Only Label" text2="Only Title" />);

    expect(screen.getByText("Only Label")).toBeInTheDocument();
    expect(screen.getByText("Only Title")).toBeInTheDocument();
  });

  it("has proper heading structure", () => {
    render(<SectionTitle text1="Label" text2="Main Title" text3="Description" />);

    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveTextContent("Main Title");
  });
});
