import { Trash2Icon } from "lucide-react";
import { Link } from "react-router";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";

const NoteCard = ({ note, setNotes }) => {
  const handleDelete = async (e, id) => {
    e.preventDefault(); // stop the card link from navigating

    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note._id !== id));
      toast.success("Note deleted");
    } catch (error) {
      console.log("Error in handleDelete", error);
      toast.error("Failed to delete note");
    }
  };

  return (
    <Link
      to={`/note/${note._id}`}
      className="card card-border bg-base-100 transition duration-200 hover:-translate-y-0.5 hover:border-primary"
    >
      <div className="card-body">
        <h3 className="card-title leading-snug tracking-tight">{note.title}</h3>
        <p className="line-clamp-3 text-base-content/70">{note.content}</p>
        <div className="card-actions mt-4 items-center justify-between">
          <span className="text-sm text-base-content/70">
            {formatDate(new Date(note.createdAt))}
          </span>
          <button
            className="btn btn-ghost btn-sm btn-square text-error"
            onClick={(e) => handleDelete(e, note._id)}
            aria-label={`Delete ${note.title}`}
          >
            <Trash2Icon className="size-4" />
          </button>
        </div>
      </div>
    </Link>
  );
};
export default NoteCard;
