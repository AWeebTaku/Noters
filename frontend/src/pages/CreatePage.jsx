import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import api from "../lib/axios";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Add a title and some content");
      return;
    }

    setLoading(true);
    try {
      await api.post("/notes", { title, content });
      toast.success("Note created");
      navigate("/");
    } catch (error) {
      console.log("Error creating note", error);
      if (error.response?.status === 429) {
        toast.error("Slow down, you're creating notes too fast", { duration: 4000 });
      } else {
        toast.error("Failed to create note");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto min-h-[100dvh] max-w-2xl px-4 py-10">
      <Link to="/" className="btn btn-ghost -ml-4 mb-6">
        <ArrowLeftIcon className="size-4" />
        All notes
      </Link>

      <h1 className="text-3xl font-semibold tracking-tight">New note</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="title" className="label mb-2 text-base-content">
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Groceries, ideas, meeting recap"
            className="input w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="content" className="label mb-2 text-base-content">
            Content
          </label>
          <textarea
            id="content"
            placeholder="Start writing"
            className="textarea h-56 w-full resize-y"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save note"}
          </button>
        </div>
      </form>
    </main>
  );
};
export default CreatePage;
