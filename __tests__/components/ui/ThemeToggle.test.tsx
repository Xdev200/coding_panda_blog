import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTheme } from "next-themes";

jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

describe("ThemeToggle", () => {
  const mockSetTheme = jest.fn();

  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue({
      resolvedTheme: "light",
      setTheme: mockSetTheme,
    });
  });

  it("renders light mode icon by default", () => {
    render(<ThemeToggle />);
    expect(screen.getByLabelText(/Switch to dark mode/i)).toBeInTheDocument();
  });

  it("calls setTheme with 'dark' when clicked in light mode", () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("calls setTheme with 'light' when clicked in dark mode", () => {
    (useTheme as jest.Mock).mockReturnValue({
      resolvedTheme: "dark",
      setTheme: mockSetTheme,
    });
    render(<ThemeToggle />);
    fireEvent.click(screen.getByLabelText(/Switch to light mode/i));
    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });
});
