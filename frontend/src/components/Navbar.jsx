import { Link } from "react-router";
import { PlusIcon } from "lucide-react";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-base-300 bg-base-200/80 backdrop-blur">
      <div className="navbar mx-auto h-16 max-w-5xl px-4">
        <div className="flex-1">
          <Link to="/" className="text-xl font-semibold tracking-tight">
            Noters
          </Link>
        </div>
        <Link to="/create" className="btn btn-primary">
          <PlusIcon className="size-4" />
          New note
        </Link>
      </div>
    </header>
  );
};
export default Navbar;
