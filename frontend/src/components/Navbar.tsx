import { Link, useNavigate } from "react-router";
import { LogOutIcon, PlusIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-base-300 bg-base-200/80 backdrop-blur">
      <div className="navbar mx-auto h-16 max-w-5xl gap-2 px-4">
        <div className="flex-1">
          <Link to="/" className="text-xl font-semibold tracking-tight">
            Noters
          </Link>
        </div>
        <span className="hidden max-w-48 truncate text-sm text-base-content/70 sm:inline">
          {user?.email}
        </span>
        <Link to="/create" className="btn btn-primary">
          <PlusIcon className="size-4" />
          New note
        </Link>
        <button className="btn btn-ghost btn-square" onClick={handleLogout} aria-label="Log out">
          <LogOutIcon className="size-4" />
        </button>
      </div>
    </header>
  );
};
export default Navbar;
