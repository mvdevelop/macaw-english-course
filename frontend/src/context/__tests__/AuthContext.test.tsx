import { render, screen, fireEvent, waitFor } from "../../test-utils";
import { AuthContextProvider, useAuth } from "../AuthContext";

// Test component that consumes the auth context
function TestAuthComponent() {
  const { user, loading, login, signup, logout } = useAuth();

  return (
    <div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="user">{user ? user.email : "no-user"}</div>
      <button data-testid="login-btn" onClick={() => login("test@test.com", "pass123")}>
        Login
      </button>
      <button data-testid="signup-btn" onClick={() => signup("Test", "new@test.com", "pass123")}>
        Signup
      </button>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with no user and loading completes", () => {
    render(
      <AuthContextProvider>
        <TestAuthComponent />
      </AuthContextProvider>
    );

    expect(screen.getByTestId("user").textContent).toBe("no-user");
    expect(screen.getByTestId("loading").textContent).toBe("false");
  });

  it("restores user from localStorage", () => {
    const storedUser = { id: "1", email: "stored@test.com", name: "Stored User" };
    localStorage.setItem("user", JSON.stringify(storedUser));

    render(
      <AuthContextProvider>
        <TestAuthComponent />
      </AuthContextProvider>
    );

    expect(screen.getByTestId("user").textContent).toBe("stored@test.com");
  });

  it("logout clears user", () => {
    localStorage.setItem("user", JSON.stringify({ id: "1", email: "test@test.com" }));

    render(
      <AuthContextProvider>
        <TestAuthComponent />
      </AuthContextProvider>
    );

    fireEvent.click(screen.getByTestId("logout-btn"));

    expect(screen.getByTestId("user").textContent).toBe("no-user");
    expect(localStorage.getItem("user")).toBeNull();
  });
});
