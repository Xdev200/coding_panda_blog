import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import type { BlogCategory } from "@/types/blog";

const MOCK_CATEGORIES: BlogCategory[] = [
  { id: "all", label: "All Posts", count: 6 },
  { id: "design", label: "Design", count: 2 },
  { id: "tutorials", label: "Tutorials", count: 2 },
];

describe("CategoryFilter", () => {
  const onSelect = jest.fn();

  beforeEach(() => {
    onSelect.mockClear();
  });

  it("renders all category buttons", () => {
    render(
      <CategoryFilter
        categories={MOCK_CATEGORIES}
        activeCategory="all"
        onSelect={onSelect}
      />
    );
    expect(screen.getByText(/All Posts/)).toBeInTheDocument();
    expect(screen.getByText(/Design/)).toBeInTheDocument();
    expect(screen.getByText(/Tutorials/)).toBeInTheDocument();
  });

  it("shows the count for each category", () => {
    render(
      <CategoryFilter
        categories={MOCK_CATEGORIES}
        activeCategory="all"
        onSelect={onSelect}
      />
    );
    expect(screen.getByText("6")).toBeInTheDocument();
    const twos = screen.getAllByText("2");
    expect(twos.length).toBe(2);
  });

  it("marks the active category button with aria-pressed=true", () => {
    render(
      <CategoryFilter
        categories={MOCK_CATEGORIES}
        activeCategory="design"
        onSelect={onSelect}
      />
    );
    const designBtn = screen.getAllByRole("button").find(
      (b) => b.getAttribute("aria-pressed") === "true"
    );
    expect(designBtn).toBeDefined();
    expect(designBtn?.textContent).toContain("Design");
  });

  it("marks inactive categories with aria-pressed=false", () => {
    render(
      <CategoryFilter
        categories={MOCK_CATEGORIES}
        activeCategory="all"
        onSelect={onSelect}
      />
    );
    const inactiveButtons = screen
      .getAllByRole("button")
      .filter((b) => b.getAttribute("aria-pressed") === "false");
    expect(inactiveButtons.length).toBe(2);
  });

  it("calls onSelect with the correct id when a button is clicked", () => {
    render(
      <CategoryFilter
        categories={MOCK_CATEGORIES}
        activeCategory="all"
        onSelect={onSelect}
      />
    );
    fireEvent.click(screen.getByText(/Design/));
    expect(onSelect).toHaveBeenCalledWith("design");
  });

  it("calls onSelect once per click", () => {
    render(
      <CategoryFilter
        categories={MOCK_CATEGORIES}
        activeCategory="all"
        onSelect={onSelect}
      />
    );
    fireEvent.click(screen.getByText(/Tutorials/));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("renders a nav element with aria-label", () => {
    render(
      <CategoryFilter
        categories={MOCK_CATEGORIES}
        activeCategory="all"
        onSelect={onSelect}
      />
    );
    expect(
      screen.getByRole("navigation", { name: /blog categories/i })
    ).toBeInTheDocument();
  });

  it("applies active styles to the selected category", () => {
    render(
      <CategoryFilter
        categories={MOCK_CATEGORIES}
        activeCategory="all"
        onSelect={onSelect}
      />
    );
    const allBtn = screen.getAllByRole("button")[0];
    expect(allBtn.className).toContain("bg-retro-black");
  });

  it("applies inactive styles to unselected categories", () => {
    render(
      <CategoryFilter
        categories={MOCK_CATEGORIES}
        activeCategory="all"
        onSelect={onSelect}
      />
    );
    const designBtn = screen.getAllByRole("button")[1];
    expect(designBtn.className).toContain("bg-retro-white");
  });

  it("renders nothing extra with empty categories array", () => {
    render(
      <CategoryFilter
        categories={[]}
        activeCategory="all"
        onSelect={onSelect}
      />
    );
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });
});
