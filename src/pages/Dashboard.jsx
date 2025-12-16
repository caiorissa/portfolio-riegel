import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "../lib/firebaseConfig";

function extractYouTubeId(url) {
  try {
    if (!url.includes("http")) return url;

    const parsed = new URL(url);

    if (parsed.searchParams.get("v")) {
      return parsed.searchParams.get("v");
    }

    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.replace("/", "");
    }

    if (parsed.pathname.startsWith("/shorts/")) {
      return parsed.pathname.split("/")[2];
    }

    return null;
  } catch {
    return null;
  }
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [description, setDescription] = useState("");
  const [submittingVideo, setSubmittingVideo] = useState(false);
  const [videos, setVideos] = useState([]);

  const [editingVideo, setEditingVideo] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editYoutubeUrl, setEditYoutubeUrl] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const [photoTitle, setPhotoTitle] = useState("");
  const [photoProject, setPhotoProject] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoDescription, setPhotoDescription] = useState("");
  const [submittingPhoto, setSubmittingPhoto] = useState(false);
  const [photos, setPhotos] = useState([]);


  useEffect(() => {
    const unsubVideos = onSnapshot(
      query(collection(db, "videos"), orderBy("createdAt", "desc")),
      (snap) => setVideos(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );

    const unsubPhotos = onSnapshot(
      query(collection(db, "photos"), orderBy("createdAt", "desc")),
      (snap) => setPhotos(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );

    return () => {
      unsubVideos();
      unsubPhotos();
    };
  }, []);
  useEffect(() => {
    if (!editingVideo) return;

    setEditTitle(editingVideo.title || "");
    setEditDescription(editingVideo.description || "");

    const fullUrl = editingVideo.youtubeId
      ? `https://www.youtube.com/watch?v=${editingVideo.youtubeId}`
      : "";

    setEditYoutubeUrl(fullUrl);
  }, [editingVideo]);
  
async function handleSubmitVideo(e) {
  e.preventDefault();
  setSubmittingVideo(true);

  const youtubeId = extractYouTubeId(youtubeUrl);

  if (!youtubeId) {
    alert("O link do YouTube não é válido.");
    setSubmittingVideo(false);
    return;
  }

  try {
    await addDoc(collection(db, "videos"), {
      title: title.trim(),
      youtubeId: youtubeId.trim(),
      description: description.trim(),
      createdAt: serverTimestamp(),
    });

    setTitle("");
    setYoutubeUrl("");
    setDescription("");
  } catch (error) {
    console.error("Erro ao salvar vídeo:", error);
  } finally {
    setSubmittingVideo(false);
  }
}
  
  async function handleDeleteVideo(id) {
    if (!window.confirm("Excluir este vídeo?")) return;
    await deleteDoc(doc(db, "videos", id));
  }
  
  async function handleUpdateVideo(e) {
    e.preventDefault();
    if (!editingVideo) return;

    setSavingEdit(true);

    const newId = extractYouTubeId(editYoutubeUrl);

    if (!newId) {
      alert("Link inválido.");
      setSavingEdit(false);
      return;
    }

    const newThumb = `https://img.youtube.com/vi/${newId}/maxresdefault.jpg`;

    try {
      await updateDoc(doc(db, "videos", editingVideo.id), {
        title: editTitle.trim(),
        description: editDescription.trim(),
        youtubeId: newId,
        thumbnailUrl: newThumb
      });

      setEditingVideo(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingEdit(false);
    }
  }
  
  async function handleSubmitPhoto(e) {
    e.preventDefault();
    setSubmittingPhoto(true);

    if (!photoUrl.trim()) {
      alert("Informe uma URL.");
      setSubmittingPhoto(false);
      return;
    }

    try {
      await addDoc(collection(db, "photos"), {
        title: photoTitle.trim(),
        project: photoProject.trim() || null,
        description: photoDescription.trim() || null,
        imageUrl: photoUrl.trim(),
        createdAt: serverTimestamp()
      });

      setPhotoTitle("");
      setPhotoProject("");
      setPhotoUrl("");
      setPhotoDescription("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingPhoto(false);
    }
  }

  async function handleDeletePhoto(id) {
    if (!window.confirm("Excluir foto?")) return;
    await deleteDoc(doc(db, "photos", id));
  }
  
  async function handleLogout() {
    await signOut(auth);
    navigate("/", { replace: true });
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 pt-28 pb-10 space-y-10">
      
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Painel administrativo</h1>
        <button
          onClick={handleLogout}
          className="px-3 py-2 text-xs border border-white/20 rounded-full hover:bg-white hover:text-black transition"
        >
          Logout
        </button>
      </div>

      <section className="bg-neutral-950 border border-white/10 rounded-2xl p-5 space-y-5">
        <h2 className="text-sm font-medium text-white">Vídeos</h2>

        <form onSubmit={handleSubmitVideo} className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-xs text-neutral-400">Título</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs text-neutral-400">
              Link completo do YouTube
            </label>
            <input
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              type="url"
              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs text-neutral-400">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm resize-none"
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={submittingVideo}
              className="px-4 py-2 text-xs bg-white text-black rounded-full"
            >
              {submittingVideo ? "Salvando..." : "Salvar vídeo"}
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {videos.map((video) => (
            <div
              key={video.id}
              className="flex items-center gap-3 bg-black p-3 rounded-xl border border-white/10"
            >
              <img
                src={video.thumbnailUrl}
                className="w-28 h-20 rounded-md object-cover"
              />
              <div className="flex-1">
                <p className="text-white text-sm">{video.title}</p>
              </div>

              <button
                onClick={() => setEditingVideo(video)}
                className="px-3 py-1 text-xs border border-white/20 rounded-full"
              >
                Editar
              </button>

              <button
                onClick={() => handleDeleteVideo(video.id)}
                className="px-3 py-1 text-xs bg-red-600 text-white rounded-full"
              >
                Excluir
              </button>
            </div>
          ))}
        </div>

        {editingVideo && (
          <div className="p-4 border border-white/10 rounded-xl mt-4 bg-black">
            <h3 className="text-white text-sm mb-3">Editar vídeo</h3>

            <form onSubmit={handleUpdateVideo} className="grid gap-3">
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="bg-black border border-white/10 rounded-lg px-3 py-2 text-sm"
              />

              <input
                value={editYoutubeUrl}
                onChange={(e) => setEditYoutubeUrl(e.target.value)}
                className="bg-black border border-white/10 rounded-lg px-3 py-2 text-sm"
              />

              <textarea
                value={editDescription}
                rows={3}
                onChange={(e) => setEditDescription(e.target.value)}
                className="bg-black border border-white/10 rounded-lg px-3 py-2 text-sm resize-none"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="px-4 py-2 text-xs border border-white/20 rounded-full"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-4 py-2 text-xs bg-white text-black rounded-full"
                >
                  {savingEdit ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}
