import { render } from "@testing-library/react";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

// Mock next/script
jest.mock("next/script", () => {
    return ({ children, src }: any) => {
        return <div data-testid="next-script" data-src={src}>{children}</div>;
    };
});

describe("GoogleAnalytics", () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
        Object.defineProperty(process.env, "NODE_ENV", { value: originalEnv });
    });

    it("renders nothing when not in production", () => {
        Object.defineProperty(process.env, "NODE_ENV", { value: "development" });
        const { container } = render(<GoogleAnalytics />);
        expect(container).toBeEmptyDOMElement();
    });

    it("renders scripts when in production", () => {
        Object.defineProperty(process.env, "NODE_ENV", { value: "production" });
        const { getAllByTestId } = render(<GoogleAnalytics />);
        const scripts = getAllByTestId("next-script");
        expect(scripts.length).toBeGreaterThan(0);
        expect(scripts[0]).toHaveAttribute("data-src", expect.stringContaining("googletagmanager.com"));
    });
});
