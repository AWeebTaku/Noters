import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { ArrowLeftIcon, LoaderIcon, Trash2Icon } from "lucide-react";

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch (error) {
        console.log("Error in fetching note", error);
        toast.error("Failed to fetch the note");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted");
      navigate("/");
    } catch (error) {
      console.log("Error deleting the note:", error);
      toast.error("Failed to delete note");
    }
  };

  const handleSave = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      toast.error("Add a title and some content");
      return;
    }

    setSaving(true);

    try {
      await api.put(`/notes/${id}`, note);
      toast.success("Note updated successfully");
      navigate("/");
    } catch (error) {
      console.log("Error saving the note:", error);
      toast.error("Failed to update note");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center text-base-content/70">
        <LoaderIcon className="size-8 animate-spin" aria-label="Loading note" />
      </div>
    );
  }

  if (!note) {
    return (
      <main className="mx-auto min-h-[100dvh] max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">Note not found</h1>
        <Link to="/" className="btn btn-primary mt-6">
          Back to notes
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-[100dvh] max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/" className="btn btn-ghost -ml-4">
          <ArrowLeftIcon className="size-4" />
          All notes
        </Link>
        <button onClick={handleDelete} className="btn btn-outline btn-error">
          <Trash2Icon className="size-4" />
          Delete
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="label mb-2 text-base-content">
            Title
          </label>
          <input
            id="title"
            type="text"
            className="input w-full"
            value={note.title}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="content" className="label mb-2 text-base-content">
            Content
          </label>
          <textarea
            id="content"
            className="textarea h-56 w-full resize-y"
            value={note.content}
            onChange={(e) => setNote({ ...note, content: e.target.value })}
          />
        </div>

        <div className="flex justify-end">
          <button className="btn btn-primary" disabled={saving} onClick={handleSave}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </main>
  );
};
export default NoteDetailPage;
