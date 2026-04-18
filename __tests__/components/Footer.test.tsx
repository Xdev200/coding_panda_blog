import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Footer } from "@/components/layout/Footer";

jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  };
});

describe("Footer", () => {
  it("renders the Coding Panda brand name", () => {
    render(<Footer />);
    expect(screen.getByText("Coding Panda")).toBeInTheDocument();
  });

  it("renders the tagline", () => {
    render(<Footer />);
    expect(
      screen.getByText(/Coding Panda · Insights and tutorials/i)
    ).toBeInTheDocument();
  });

  it("renders the GitHub link", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /github/i })).toBeInTheDocument();
  });

  it("renders the Blog link pointing to root", () => {
    render(<Footer />);
    const blogLink = screen.getByRole("link", { name: /^blog$/i });
    expect(blogLink).toHaveAttribute("href", "/");
  });

  it("renders the current year in copyright", () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
    expect(screen.getByText(/CodingPanda Powered by XDEV200/)).toBeInTheDocument();
  });

  it("renders MIT License text", () => {
    render(<Footer />);
    expect(screen.getByText(/MIT License/i)).toBeInTheDocument();
  });

  it("renders footer navigation landmark", () => {
    render(<Footer />);
    expect(
      screen.getByRole("navigation", { name: /footer navigation/i })
    ).toBeInTheDocument();
  });

  it("renders a contentinfo landmark (footer element)", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("has black background", () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector("footer");
    expect(footer?.className).toContain("bg-retro-black");
  });

  it("has yellow brand text", () => {
    render(<Footer />);
    const brand = screen.getByText("Coding Panda");
    expect(brand.className).toContain("text-retro-yellow");
  });
});
