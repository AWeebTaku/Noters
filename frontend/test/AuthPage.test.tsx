import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { vi } from "vitest";
import AuthPage from "../src/pages/AuthPage";

const login = vi.fn();
const register = vi.fn();
vi.mock("../src/context/AuthContext", () => ({
  useAuth: () => ({ user: null, login, register, logout: vi.fn() }),
}));

const renderPage = (mode: "login" | "register") =>
  render(
    <MemoryRouter>
      <AuthPage mode={mode} />
    </MemoryRouter>
  );

describe("AuthPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("logs in with the typed credentials", async () => {
    login.mockResolvedValue(undefined);
    renderPage("login");

    await userEvent.type(screen.getByLabelText("Email"), "a@test.com");
    await userEvent.type(screen.getByLabelText("Password"), "password123");
    await userEvent.click(screen.getByRole("button", { name: "Log in" }));

    expect(login).toHaveBeenCalledWith("a@test.com", "password123");
  });

  it("shows the server's error message", async () => {
    login.mockRejectedValue(new Error("boom"));
    renderPage("login");

    await userEvent.type(screen.getByLabelText("Email"), "a@test.com");
    await userEvent.type(screen.getByLabelText("Password"), "password123");
    await userEvent.click(screen.getByRole("button", { name: "Log in" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Something went wrong");
  });

  it("offers the demo account on login but not on register", () => {
    const { unmount } = renderPage("login");
    expect(screen.getByRole("button", { name: /demo account/i })).toBeInTheDocument();
    unmount();
    renderPage("register");
    expect(screen.queryByRole("button", { name: /demo account/i })).not.toBeInTheDocument();
  });
});
