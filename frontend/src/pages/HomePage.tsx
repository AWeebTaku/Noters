import { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import api from "../lib/axios";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import NotesNotFound from "../components/NotesNotFound";
import { isRateLimited as is429 } from "../lib/utils";
import type { NotesPage } from "../types";

const grid = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";

const HomePage = () => {
  const [data, setData] = useState<NotesPage | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState(""); // search text after the typing pause
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);

  // wait 300ms after typing stops before asking the server
  useEffect(() => {
    const t = setTimeout(() => setQuery(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    let ignore = false; // drop answers that arrive after a newer request
    api
      .get<NotesPage>("/notes", { params: { search: query || undefined, page } })
      .then((res) => {
        if (ignore) return;
        // deleted the last note on a later page: step back one page
        if (res.data.notes.length === 0 && page > 1) return setPage(page - 1);
        setData(res.data);
        setRateLimited(false);
      })
      .catch((error) => {
        if (ignore) return;
        if (is429(error)) setRateLimited(true);
        else toast.error("Failed to load notes");
        setData((d) => d ?? { notes: [], page: 1, limit: 12, total: 0, totalPages: 1 });
      });
    return () => {
      ignore = true;
    };
  }, [query, page, reload]);

  const searching = query !== "";

  return (
    <div className="min-h-[100dvh]">
      <Navbar />

      {rateLimited && <RateLimitedUI />}

      <main className="mx-auto max-w-5xl px-4 py-10">
        {data === null && (
          <div className={grid} aria-busy="true" aria-label="Loading notes">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-40" />
            ))}
          </div>
        )}

        {data && !rateLimited && (data.total > 0 || searching || search) && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-semibold tracking-tight">
              {searching ? "Results" : "Your notes"}{" "}
              <span className="text-base-content/70">({data.total})</span>
            </h1>
            <label className="input w-full sm:w-72">
              <SearchIcon className="size-4 opacity-60" />
              <input
                type="search"
                placeholder="Search notes"
                aria-label="Search notes"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </label>
          </div>
        )}

        {data && data.total === 0 && !rateLimited && !searching && !search && <NotesNotFound />}

        {data && data.total === 0 && (searching || search) && (
          <p className="py-16 text-center text-base-content/70">No notes match your search.</p>
        )}

        {data && data.total > 0 && !rateLimited && (
          <>
            <div className={grid}>
              {data.notes.map((note) => (
                <NoteCard key={note._id} note={note} onDeleted={() => setReload((n) => n + 1)} />
              ))}
            </div>

            {data.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  className="btn btn-outline btn-sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </button>
                <span className="text-sm text-base-content/70">
                  Page {data.page} of {data.totalPages}
                </span>
                <button
                  className="btn btn-outline btn-sm"
                  disabled={page >= data.totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
export default HomePage;
