import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Badge, CATEGORY_VARIANT_MAP } from "@/components/ui/Badge";

describe("Badge", () => {
  it("renders the label text", () => {
    render(<Badge label="Design" />);
    expect(screen.getByText("Design")).toBeInTheDocument();
  });

  it("renders as a span element", () => {
    render(<Badge label="Test" />);
    expect(screen.getByText("Test").tagName).toBe("SPAN");
  });

  it("applies default variant classes when no variant is given", () => {
    render(<Badge label="Default" />);
    const el = screen.getByText("Default");
    expect(el.className).toContain("bg-retro-yellow");
  });

  it("applies pink variant classes", () => {
    render(<Badge label="Pink" variant="pink" />);
    expect(screen.getByText("Pink").className).toContain("bg-retro-pink");
  });

  it("applies blue variant classes", () => {
    render(<Badge label="Blue" variant="blue" />);
    expect(screen.getByText("Blue").className).toContain("bg-retro-blue");
  });

  it("applies green variant classes", () => {
    render(<Badge label="Green" variant="green" />);
    expect(screen.getByText("Green").className).toContain("bg-retro-green");
  });

  it("applies orange variant classes", () => {
    render(<Badge label="Orange" variant="orange" />);
    expect(screen.getByText("Orange").className).toContain("bg-retro-orange");
  });

  it("applies purple variant classes", () => {
    render(<Badge label="Purple" variant="purple" />);
    expect(screen.getByText("Purple").className).toContain("bg-retro-purple");
  });

  it("applies outline variant classes", () => {
    render(<Badge label="Outline" variant="outline" />);
    const el = screen.getByText("Outline");
    expect(el.className).toContain("bg-transparent");
  });

  it("merges custom className", () => {
    render(<Badge label="Custom" className="my-custom-class" />);
    expect(screen.getByText("Custom").className).toContain("my-custom-class");
  });

  it("always has border and shadow classes", () => {
    render(<Badge label="Bordered" />);
    const el = screen.getByText("Bordered");
    expect(el.className).toContain("border-2");
    expect(el.className).toContain("border-retro-black");
  });
});

describe("CATEGORY_VARIANT_MAP", () => {
  it("maps design to pink", () => {
    expect(CATEGORY_VARIANT_MAP["design"]).toBe("pink");
  });

  it("maps tutorials to blue", () => {
    expect(CATEGORY_VARIANT_MAP["tutorials"]).toBe("blue");
  });

  it("maps accessibility to green", () => {
    expect(CATEGORY_VARIANT_MAP["accessibility"]).toBe("green");
  });

  it("maps announcements to purple", () => {
    expect(CATEGORY_VARIANT_MAP["announcements"]).toBe("purple");
  });

  it("maps all to default", () => {
    expect(CATEGORY_VARIANT_MAP["all"]).toBe("default");
  });
});
