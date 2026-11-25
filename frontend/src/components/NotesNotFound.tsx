import { NotebookPenIcon } from "lucide-react";
import { Link } from "react-router";

const NotesNotFound = () => {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center py-24 text-center">
      <div className="rounded-box border border-base-300 bg-base-100 p-4">
        <NotebookPenIcon className="size-6 text-primary" />
      </div>
      <h2 className="mt-6 text-2xl font-semibold tracking-tight">No notes yet</h2>
      <p className="mt-2 text-base-content/70">
        Write down your first idea. It takes a few seconds.
      </p>
      <Link to="/create" className="btn btn-primary mt-6">
        Write a note
      </Link>
    </div>
  );
};
export default NotesNotFound;
