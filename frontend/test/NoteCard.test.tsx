import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { vi } from "vitest";
import NoteCard from "../src/components/NoteCard";
import api from "../src/lib/axios";

vi.mock("react-hot-toast", () => ({ default: { success: vi.fn(), error: vi.fn() } }));

const note = {
  _id: "abc123",
  title: "Groceries",
  content: "Oats and coffee",
  createdAt: "2026-11-01T10:00:00.000Z",
  updatedAt: "2026-11-01T10:00:00.000Z",
};

const renderCard = (onDeleted = vi.fn()) =>
  render(
    <MemoryRouter>
      <NoteCard note={note} onDeleted={onDeleted} />
    </MemoryRouter>
  );

describe("NoteCard", () => {
  it("shows the note and links to its page", () => {
    renderCard();
    expect(screen.getByText("Groceries")).toBeInTheDocument();
    expect(screen.getByText("Oats and coffee")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/note/abc123");
  });

  it("deletes after confirmation and tells the parent", async () => {
    const del = vi.spyOn(api, "delete").mockResolvedValue({});
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const onDeleted = vi.fn();
    renderCard(onDeleted);

    await userEvent.click(screen.getByRole("button", { name: /delete groceries/i }));

    expect(del).toHaveBeenCalledWith("/notes/abc123");
    expect(onDeleted).toHaveBeenCalled();
  });

  it("does nothing when the user cancels", async () => {
    const del = vi.spyOn(api, "delete").mockResolvedValue({});
    del.mockClear();
    vi.spyOn(window, "confirm").mockReturnValue(false);
    renderCard();

    await userEvent.click(screen.getByRole("button", { name: /delete groceries/i }));

    expect(del).not.toHaveBeenCalled();
  });
});
