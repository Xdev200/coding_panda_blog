import { render, screen } from "@testing-library/react";
import LoginPage from "@/app/login/page";

describe("LoginPage", () => {
  it("renders login form correctly", async () => {
    const Page = await LoginPage({ searchParams: Promise.resolve({}) });
    render(Page);
    
    expect(screen.getByText("Admin Login")).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign In/i })).toBeInTheDocument();
  });

  it("renders error message when error param is present", async () => {
    const Page = await LoginPage({ 
        searchParams: Promise.resolve({ error: "invalid_credentials" }) 
    });
    render(Page);
    
    expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
  });

  it("renders unauthorized error message", async () => {
    const Page = await LoginPage({ 
        searchParams: Promise.resolve({ error: "unauthorized" }) 
    });
    render(Page);
    
    expect(screen.getByText(/You don't have admin privileges/i)).toBeInTheDocument();
  });
});
