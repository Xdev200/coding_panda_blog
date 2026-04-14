import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Navbar } from "@/components/layout/Navbar";

jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
    target,
    rel,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    target?: string;
    rel?: string;
    [key: string]: unknown;
  }) {
    return (
      <a href={href} target={target} rel={rel} {...rest}>
        {children}
      </a>
    );
  };
});

// Mock lucide-react to avoid missing icon errors
jest.mock("lucide-react", () => ({
  Github: () => <div data-testid="github-icon" />,
  Sun: () => <div data-testid="sun-icon" />,
  Moon: () => <div data-testid="moon-icon" />,
}));

// Mock ThemeToggle component
jest.mock("@/components/ui/ThemeToggle", () => ({
  ThemeToggle: () => <div data-testid="theme-toggle" />,
}));

describe("Navbar", () => {
  it("renders the Coding Panda logo", () => {
    render(<Navbar />);
    expect(screen.getByText("Coding Panda")).toBeInTheDocument();
  });

  it("logo links to /", () => {
    render(<Navbar />);
    const logoLink = screen.getByText("Coding Panda").closest("a");
    expect(logoLink).toHaveAttribute("href", "/");
  });

  it("renders the GitHub link as external", () => {
    render(<Navbar />);
    const githubLink = screen.getByRole("link", { name: /github repository/i });
    expect(githubLink).toHaveAttribute("href", "https://github.com/Logging-Studio/RetroUI");
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders a header element as banner", () => {
    render(<Navbar />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders the theme toggle component", () => {
    render(<Navbar />);
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });

  it("has sticky positioning class", () => {
    const { container } = render(<Navbar />);
    const header = container.querySelector("header");
    expect(header?.className).toContain("sticky");
  });

  it("has yellow background in light mode", () => {
    const { container } = render(<Navbar />);
    const header = container.querySelector("header");
    expect(header?.className).toContain("bg-retro-yellow");
  });
});
