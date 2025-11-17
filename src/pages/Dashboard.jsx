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
import { auth, db, storage } from "../lib/firebaseConfig";

// extrai ID do YouTube de um link
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

  // ─────────────────────────────
  // ESTADOS VÍDEOS
  // ─────────────────────────────
  const [title, setTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [description, setDescription] = useState("");
  const [submittingVideo, setSubmittingVideo] = useState(false);
  const [videos, setVideos] = useState([]);

  // edição de vídeo
  const [editingVideo, setEditingVideo] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editYoutubeUrl, setEditYoutubeUrl] = useState("");
  const [editThumbnailUrl, setEditThumbnailUrl] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // ─────────────────────────────
  // ESTADOS FOTOS AVULSAS
  // ─────────────────────────────
  const [photoTitle, setPhotoTitle] = useState("");
  const [photoProject, setPhotoProject] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photos, setPhotos] = useState([]);
  const [submittingPhoto, setSubmittingPhoto] = useState(false);
  const [photoDescription, setPhotoDescription] = useState("");

  // ─────────────────────────────
  // EFFECTS – carregar dados
  // ─────────────────────────────
  useEffect(() => {
    const qVideos = query(
      collection(db, "videos"),
      orderBy("createdAt", "desc")
    );
    const unsubVideos = onSnapshot(qVideos, (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setVideos(list);
    });

    const qPhotos = query(
      collection(db, "photos"),
      orderBy("createdAt", "desc")
    );
    const unsubPhotos = onSnapshot(qPhotos, (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPhotos(list);
    });

    return () => {
      unsubVideos();
      unsubPhotos();
    };
  }, []);

  // quando começa a editar, preenche os campos de edição
  useEffect(() => {
    if (!editingVideo) return;
    setEditTitle(editingVideo.title || "");
    setEditDescription(editingVideo.description || "");
    setEditThumbnailUrl(editingVideo.thumbnailUrl || "");
    // reconstruir um link completo só pra UX
    const youtubeId = editingVideo.youtubeId || "";
    const fullUrl = youtubeId
      ? `https://www.youtube.com/watch?v=${youtubeId}`
      : "";
    setEditYoutubeUrl(fullUrl);
  }, [editingVideo]);

  // ─────────────────────────────
  // HANDLERS – VÍDEOS
  // ─────────────────────────────
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
        thumbnailUrl: thumbnailUrl.trim(),
        description: description.trim(),
        createdAt: serverTimestamp()
      });

      setTitle("");
      setYoutubeUrl("");
      setThumbnailUrl("");
      setDescription("");
    } catch (error) {
      console.error("Erro ao salvar vídeo:", error);
    } finally {
      setSubmittingVideo(false);
    }
  }

  async function handleDeleteVideo(id) {
    const ok = window.confirm("Tem certeza que deseja excluir este vídeo?");
    if (!ok) return;

    try {
      await deleteDoc(doc(db, "videos", id));
    } catch (error) {
      console.error("Erro ao excluir vídeo:", error);
    }
  }

  async function handleUpdateVideo(e) {
    e.preventDefault();
    if (!editingVideo) return;

    setSavingEdit(true);

    const newYoutubeId = extractYouTubeId(editYoutubeUrl);

    if (!newYoutubeId) {
      alert("O link do YouTube (edição) não é válido.");
      setSavingEdit(false);
      return;
    }

    try {
      await updateDoc(doc(db, "videos", editingVideo.id), {
        title: editTitle.trim(),
        description: editDescription.trim(),
        youtubeId: newYoutubeId.trim(),
        thumbnailUrl: editThumbnailUrl.trim()
      });

      setEditingVideo(null);
    } catch (error) {
      console.error("Erro ao atualizar vídeo:", error);
    } finally {
      setSavingEdit(false);
    }
  }

  // ─────────────────────────────
  // HANDLERS – FOTOS AVULSAS
  // ─────────────────────────────
  async function handleSubmitPhoto(e) {
    e.preventDefault();
    setSubmittingPhoto(true);

    try {
      let finalUrl = photoUrl.trim();

      if (!finalUrl) {
        alert("Informe uma URL de imagem.");
        setSubmittingPhoto(false);
        return;
      }

        await addDoc(collection(db, "photos"), {
          title: photoTitle.trim(),
          project: photoProject.trim() || null,
          description: photoDescription.trim() || null,
          imageUrl: finalUrl,
          createdAt: serverTimestamp()
        });

      setPhotoTitle("");
      setPhotoProject("");
      setPhotoUrl("");
    } catch (error) {
      console.error("Erro ao salvar foto:", error);
    } finally {
      setSubmittingPhoto(false);
    }
  }
  
  async function handleDeletePhoto(id) {
  const ok = window.confirm("Excluir esta foto?");
  if (!ok) return;

  try {
    await deleteDoc(doc(db, "photos", id));
  } catch (err) {
    console.error("Erro ao excluir foto:", err);
  }
}
  // ─────────────────────────────
  // LOGOUT
  // ─────────────────────────────
  async function handleLogout() {
    try {
      await signOut(auth);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  }

  // ─────────────────────────────
  // RENDER
  // ─────────────────────────────
  return (
    <div className="max-w-6xl mx-auto px-4 pt-28 pb-10 space-y-10">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[0.7rem] tracking-[0.25em] uppercase text-neutral-500 mb-1">
            Painel administrativo
          </p>
          <h1 className="text-2xl font-semibold text-white">
            Gerenciar conteúdo
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs px-3 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition"
        >
          Logout
        </button>
      </div>

      {/* BLOCO: VÍDEOS */}
      <section className="bg-neutral-950 border border-white/10 rounded-2xl p-5 space-y-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-medium text-white">
            Vídeos
          </h2>
          <p className="text-[0.7rem] text-neutral-500">
            Adicione ou gerencie vídeos do portfólio
          </p>
        </div>

        {/* formulário vídeo */}
        <form onSubmit={handleSubmitVideo} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs text-neutral-400">Título</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/40"
              placeholder="Título do vídeo"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-xs text-neutral-400">
              Link completo do YouTube
            </label>
            <input
              type="url"
              required
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/40"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-xs text-neutral-400">
              URL da thumbnail (qualquer imagem)
            </label>
            <input
              type="url"
              required
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/40"
              placeholder="https://site.com/imagem.jpg"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-xs text-neutral-400">Descrição</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/40 resize-none"
              placeholder="Breve descrição do vídeo"
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={submittingVideo}
              className="text-xs font-medium px-4 py-2.5 bg-white text-black rounded-full hover:bg-neutral-100 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {submittingVideo ? "Salvando..." : "Salvar vídeo"}
            </button>
          </div>
        </form>

        {/* lista vídeos */}
        <div className="space-y-3">
          {videos.length === 0 ? (
            <p className="text-xs text-neutral-500">
              Nenhum vídeo cadastrado ainda.
            </p>
          ) : (
            videos.map((video) => (
              <div
                key={video.id}
                className="flex flex-col md:flex-row md:items-center gap-3 border border-white/5 rounded-xl px-3 py-2 bg-black"
              >
                <div className="w-full md:w-32 h-20 rounded-md overflow-hidden bg-neutral-900 flex-shrink-0">
                  {video.thumbnailUrl && (
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">
                    {video.title}
                  </p>
                  <p className="text-[0.7rem] text-neutral-500 truncate">
                    {video.youtubeId}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingVideo(video)}
                    className="text-[0.7rem] px-3 py-1 rounded-full border border-white/20 hover:bg-white hover:text-black transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteVideo(video.id)}
                    className="text-[0.7rem] px-3 py-1 rounded-full border border-red-400/60 text-red-300 hover:bg-red-500 hover:text-white transition"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* painel de edição de vídeo */}
        {editingVideo && (
          <div className="mt-4 border border-white/15 rounded-xl p-4 bg-black/60">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-white">
                Editar vídeo
              </h3>
              <button
                onClick={() => setEditingVideo(null)}
                className="text-[0.7rem] text-neutral-400 hover:text-white transition"
              >
                Fechar
              </button>
            </div>

            <form onSubmit={handleUpdateVideo} className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs text-neutral-400">Título</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-black border border-white/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/40"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs text-neutral-400">
                  Link completo do YouTube
                </label>
                <input
                  type="url"
                  required
                  value={editYoutubeUrl}
                  onChange={(e) => setEditYoutubeUrl(e.target.value)}
                  className="w-full bg-black border border-white/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/40"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs text-neutral-400">
                  URL da thumbnail
                </label>
                <input
                  type="url"
                  required
                  value={editThumbnailUrl}
                  onChange={(e) => setEditThumbnailUrl(e.target.value)}
                  className="w-full bg-black border border-white/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/40"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs text-neutral-400">Descrição</label>
                <textarea
                  required
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-black border border-white/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/40 resize-none"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="text-[0.7rem] px-4 py-2 rounded-full border border-white/20 hover:bg-neutral-900 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="text-[0.7rem] px-4 py-2 rounded-full bg-white text-black hover:bg-neutral-100 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {savingEdit ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            </form>
          </div>
        )}
      </section>

      {/* BLOCO: FOTOS AVULSAS */}
      <section className="bg-neutral-950 border border-white/10 rounded-2xl p-5 space-y-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-medium text-white">
            Fotos avulsas
          </h2>
          <p className="text-[0.7rem] text-neutral-500">
            Link de fotos individuais
          </p>
        </div>

        <form onSubmit={handleSubmitPhoto} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs text-neutral-400">Título</label>
            <input
              type="text"
              required
              value={photoTitle}
              onChange={(e) => setPhotoTitle(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/40"
              placeholder="Ex: Making of, Close da noiva..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-neutral-400">
              Projeto (opcional)
            </label>
            <input
              type="text"
              value={photoProject}
              onChange={(e) => setPhotoProject(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/40"
              placeholder="Ex: Casamento João & Ana"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-xs text-neutral-400">
              URL da imagem
            </label>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/40"
              placeholder="https://site.com/foto.jpg"
            />
            <p className="text-[0.7rem] text-neutral-500 mt-1">
              Você pode informar uma URL.
            </p>
          </div>
          <div className="space-y-1 md:col-span-2">
          <label className="text-xs text-neutral-400">Descrição</label>
          <textarea
            rows={2}
            value={photoDescription}
            onChange={(e) => setPhotoDescription(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/40 resize-none"
            placeholder="Breve descrição da foto"
          />
        </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={submittingPhoto}
              className="text-xs font-medium px-4 py-2.5 bg-white text-black rounded-full hover:bg-neutral-100 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {submittingPhoto ? "Salvando..." : "Salvar foto"}
            </button>
          </div>
        </form>

        {/* lista de fotos resumida */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="border border-white/10 rounded-lg overflow-hidden bg-black relative"
              >
                <div className="absolute top-2 right-2 z-10">
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="text-[0.6rem] px-2 py-1 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    Excluir
                  </button>
                </div>

                <div className="aspect-[4/3] bg-neutral-900 overflow-hidden">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="px-2 py-2">
                  <p className="text-[0.7rem] text-white truncate">{photo.title}</p>

                  {photo.project && (
                    <p className="text-[0.65rem] text-neutral-500 truncate">{photo.project}</p>
                  )}

                  {photo.description && (
                    <p className="text-[0.65rem] text-neutral-400 mt-1 line-clamp-3">
                      {photo.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
      </section>  
    </div>
  );
}
