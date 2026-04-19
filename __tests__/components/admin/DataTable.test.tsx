import React from "react";
import { render, screen } from "@testing-library/react";
import { DataTable } from "@/components/admin/DataTable";

describe("DataTable", () => {
  const data = [
    { id: 1, name: "Alice", role: "admin" },
    { id: 2, name: "Bob", role: "editor" },
  ];

  const columns = [
    { header: "Name", accessor: "name" as const },
    { header: "Role", accessor: (row: any) => row.role.toUpperCase() },
  ];

  it("renders headers and data correctly", () => {
    render(
      <DataTable 
        data={data} 
        columns={columns} 
        keyAccessor="id" 
      />
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("EDITOR")).toBeInTheDocument(); // EDITOR because of function accessor
  });

  it("renders empty message when data is empty", () => {
    render(
      <DataTable 
        data={[]} 
        columns={columns} 
        keyAccessor="id" 
        emptyMessage="Nothing here"
      />
    );

    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("renders actions when renderActions is provided", () => {
    render(
      <DataTable 
        data={data} 
        columns={columns} 
        keyAccessor="id" 
        renderActions={(row) => <button>Edit {row.name}</button>}
      />
    );

    expect(screen.getByText("Actions")).toBeInTheDocument();
    expect(screen.getByText("Edit Alice")).toBeInTheDocument();
    expect(screen.getByText("Edit Bob")).toBeInTheDocument();
  });
});
