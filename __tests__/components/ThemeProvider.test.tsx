import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@/components/ThemeProvider";

// Mock next-themes
jest.mock("next-themes", () => ({
    ThemeProvider: ({ children }: any) => <div data-testid="next-themes-provider">{children}</div>,
}));

describe("ThemeProvider", () => {
    it("renders children within the provider", () => {
        render(
            <ThemeProvider defaultTheme="light">
                <div data-testid="child">Hello</div>
            </ThemeProvider>
        );
        
        expect(screen.getByTestId("next-themes-provider")).toBeInTheDocument();
        expect(screen.getByTestId("child")).toHaveTextContent("Hello");
    });
});
