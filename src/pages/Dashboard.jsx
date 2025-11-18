// src/pages/Dashboard.jsx
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

// extrai ID do YouTube de qualquer link
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

  
  // ESTADOS VÍDEOS
  
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

  
  // ESTADOS FOTOS AVULSAS
  
  const [photoTitle, setPhotoTitle] = useState("");
  const [photoProject, setPhotoProject] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoDescription, setPhotoDescription] = useState("");
  const [submittingPhoto, setSubmittingPhoto] = useState(false);
  const [photos, setPhotos] = useState([]);

  
  // CARREGAR ITENS
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

  // Quando começa edição de vídeo, preenche inputs
  useEffect(() => {
    if (!editingVideo) return;

    setEditTitle(editingVideo.title || "");
    setEditDescription(editingVideo.description || "");

    const fullUrl = editingVideo.youtubeId
      ? `https://www.youtube.com/watch?v=${editingVideo.youtubeId}`
      : "";

    setEditYoutubeUrl(fullUrl);
  }, [editingVideo]);

  
  // SALVAR VÍDEO — com thumbnail automática
  
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



  
  // DELETAR VÍDEO
  
  async function handleDeleteVideo(id) {
    if (!window.confirm("Excluir este vídeo?")) return;
    await deleteDoc(doc(db, "videos", id));
  }

  
  // EDITAR VÍDEO — thumbnail automática também
  
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

  
  // SALVAR FOTO AVULSA (URL normal)
  
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
  
  // LOGOUT
  
  async function handleLogout() {
    await signOut(auth);
    navigate("/", { replace: true });
  }

  
  // RENDER
  
  return (
    <div className="max-w-6xl mx-auto px-4 pt-28 pb-10 space-y-10">
      
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Painel administrativo</h1>
        <button
          onClick={handleLogout}
          className="px-3 py-2 text-xs border border-white/20 rounded-full hover:bg-white hover:text-black transition"
        >
          Logout
        </button>
      </div>

      {/* FORMULÁRIO VÍDEOS */}
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

        {/* LISTA VIDEOS */}
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

        {/* EDIÇÃO */}
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

      {/* FOTOS AVULSAS */}
      <section className="bg-neutral-950 border border-white/10 rounded-2xl p-5 space-y-5">
        <h2 className="text-sm font-medium text-white">Fotos avulsas</h2>

        <form onSubmit={handleSubmitPhoto} className="grid gap-4 md:grid-cols-2">
          <input
            value={photoTitle}
            required
            onChange={(e) => setPhotoTitle(e.target.value)}
            className="bg-black border border-white/10 rounded-lg px-3 py-2 text-sm"
            placeholder="Título"
          />

          <input
            value={photoProject}
            onChange={(e) => setPhotoProject(e.target.value)}
            className="bg-black border border-white/10 rounded-lg px-3 py-2 text-sm"
            placeholder="Projeto (opcional)"
          />

          <div className="md:col-span-2">
            <input
              value={photoUrl}
              required
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm"
              placeholder="URL da imagem"
            />
          </div>

          <div className="md:col-span-2">
            <textarea
              rows={2}
              value={photoDescription}
              onChange={(e) => setPhotoDescription(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm resize-none"
              placeholder="Descrição"
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={submittingPhoto}
              className="px-4 py-2 bg-white text-black rounded-full text-xs"
            >
              {submittingPhoto ? "Salvando..." : "Salvar foto"}
            </button>
          </div>
        </form>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="border border-white/10 rounded-lg overflow-hidden bg-black relative"
            >
              <button
                onClick={() => handleDeletePhoto(photo.id)}
                className="absolute top-2 right-2 bg-red-600 text-white text-[0.6rem] px-2 py-1 rounded-full"
              >
                Excluir
              </button>

              <img
                src={photo.imageUrl}
                className="w-full h-32 object-cover"
              />

              <div className="p-2">
                <p className="text-[0.7rem] text-white">{photo.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
