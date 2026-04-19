import React from "react";
import { render, screen } from "@testing-library/react";
import { StatsCard } from "@/components/admin/StatsCard";

describe("StatsCard", () => {
  it("renders label, value and icon", () => {
    render(
      <StatsCard 
        label="Total Posts" 
        value={42} 
        icon={<span data-testid="test-icon">icon</span>} 
      />
    );

    expect(screen.getByText("Total Posts")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("applies custom colorClass to icon container", () => {
    render(
      <StatsCard 
        label="L" 
        value="V" 
        icon={<span>I</span>} 
        colorClass="bg-blue-500" 
      />
    );
    
    // Find the icon container
    const iconContainer = screen.getByText("I").parentElement;
    expect(iconContainer).toHaveClass("bg-blue-500");
  });
});
