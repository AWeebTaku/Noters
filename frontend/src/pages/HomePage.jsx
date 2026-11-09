import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import api from "../lib/axios";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import NotesNotFound from "../components/NotesNotFound";

const grid = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        setNotes(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.log("Error fetching notes", error.response);
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load notes");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className="min-h-[100dvh]">
      <Navbar />

      {isRateLimited && <RateLimitedUI />}

      <main className="mx-auto max-w-5xl px-4 py-10">
        {loading && (
          <div className={grid} aria-busy="true" aria-label="Loading notes">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-40" />
            ))}
          </div>
        )}

        {!loading && notes.length === 0 && !isRateLimited && <NotesNotFound />}

        {notes.length > 0 && !isRateLimited && (
          <>
            <h1 className="mb-6 text-3xl font-semibold tracking-tight">
              Your notes <span className="text-base-content/70">({notes.length})</span>
            </h1>
            <div className={grid}>
              {notes.map((note) => (
                <NoteCard key={note._id} note={note} setNotes={setNotes} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};
export default HomePage;
