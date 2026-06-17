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
  updateDoc,
  setDoc
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "../lib/firebaseConfig";
import { useLang } from "../i18n/LanguageContext.jsx";

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
  const { t } = useLang();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [description, setDescription] = useState("");
  const [submittingVideo, setSubmittingVideo] = useState(false);
  const [videos, setVideos] = useState([]);

  const [editingVideo, setEditingVideo] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editYoutubeUrl, setEditYoutubeUrl] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const [photoTitle, setPhotoTitle] = useState("");
  const [photoProject, setPhotoProject] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoDescription, setPhotoDescription] = useState("");
  const [submittingPhoto, setSubmittingPhoto] = useState(false);
  const [photos, setPhotos] = useState([]);

  const [viewsInput, setViewsInput] = useState("");
  const [currentViews, setCurrentViews] = useState(null);
  const [savingViews, setSavingViews] = useState(false);
  const [viewsSavedMsg, setViewsSavedMsg] = useState(false);

  useEffect(() => {
    const unsubVideos = onSnapshot(
      query(collection(db, "videos"), orderBy("createdAt", "desc")),
      (snap) => setVideos(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );

    const unsubPhotos = onSnapshot(
      query(collection(db, "photos"), orderBy("createdAt", "desc")),
      (snap) => setPhotos(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );

    const unsubViews = onSnapshot(doc(db, "settings", "views"), (snap) => {
      if (snap.exists()) {
        const count = snap.data().count;
        setCurrentViews(count);
        setViewsInput(String(count / 1000000));
      }
    });

    return () => {
      unsubVideos();
      unsubPhotos();
      unsubViews();
    };
  }, []);

  useEffect(() => {
    if (!editingVideo) return;

    setEditTitle(editingVideo.title || "");
    setEditCategory(editingVideo.category || "");
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
      alert(t.dashboard.invalidUrl);
      setSubmittingVideo(false);
      return;
    }

    try {
      await addDoc(collection(db, "videos"), {
        title: title.trim(),
        category: category.trim() || null,
        youtubeId: youtubeId.trim(),
        description: description.trim(),
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setCategory("");
      setYoutubeUrl("");
      setDescription("");
    } catch (error) {
      console.error("Erro ao salvar vídeo:", error);
    } finally {
      setSubmittingVideo(false);
    }
  }

  async function handleDeleteVideo(id) {
    if (!window.confirm(t.dashboard.deleteConfirm)) return;
    await deleteDoc(doc(db, "videos", id));
  }

  async function handleUpdateVideo(e) {
    e.preventDefault();
    if (!editingVideo) return;

    setSavingEdit(true);

    const newId = extractYouTubeId(editYoutubeUrl);

    if (!newId) {
      alert(t.dashboard.invalidLink);
      setSavingEdit(false);
      return;
    }

    const newThumb = `https://img.youtube.com/vi/${newId}/maxresdefault.jpg`;

    try {
      await updateDoc(doc(db, "videos", editingVideo.id), {
        title: editTitle.trim(),
        category: editCategory.trim() || null,
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

  async function handleSaveViews(e) {
    e.preventDefault();
    setSavingViews(true);
    setViewsSavedMsg(false);

    const millions = parseFloat(viewsInput);
    if (isNaN(millions) || millions < 0) {
      setSavingViews(false);
      return;
    }

    try {
      await setDoc(doc(db, "settings", "views"), {
        count: Math.round(millions * 1000000),
      });
      setViewsSavedMsg(true);
      setTimeout(() => setViewsSavedMsg(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingViews(false);
    }
  }

  async function handleLogout() {
    await signOut(auth);
    navigate("/", { replace: true });
  }

  return (
    <div className="max-w-6xl mx-auto px-space-4 pt-space-10 pb-space-8 space-y-space-7">

      <div className="flex items-center justify-between">
        <h1 className="font-display uppercase text-fluid-3 text-content">{t.dashboard.title}</h1>
        <button
          onClick={handleLogout}
          className="px-space-3 py-space-2 text-fluid--1 uppercase tracking-[0.14em] border border-border-strong rounded-pill text-muted hover:bg-white hover:text-black transition"
        >
          {t.dashboard.logout}
        </button>
      </div>

      {/* ── Views ── */}
      <section className="bg-bg-elevated border border-border rounded-lg p-space-5 space-y-space-4">
        <h2 className="eyebrow">{t.dashboard.views}</h2>

        {currentViews != null && (
          <p className="text-fluid--1 text-subtle">
            {t.dashboard.currentViews}: <span className="text-content font-medium">{(currentViews / 1000000).toFixed(1)}M</span>
          </p>
        )}

        <form onSubmit={handleSaveViews} className="flex items-end gap-3">
          <div className="flex-1">
            <label className="text-fluid--1 text-muted">{t.dashboard.viewsLabel}</label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={viewsInput}
              onChange={(e) => setViewsInput(e.target.value)}
              className="w-full bg-bg border border-border rounded-md px-space-3 py-space-2 text-fluid--1 text-content focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
              required
            />
          </div>
          <button
            type="submit"
            disabled={savingViews}
            className="px-space-5 py-space-2 text-fluid--1 uppercase tracking-[0.14em] bg-white text-black rounded-pill whitespace-nowrap hover:bg-accent transition"
          >
            {savingViews ? t.dashboard.savingViews : t.dashboard.saveViews}
          </button>
        </form>

        {viewsSavedMsg && (
          <p className="text-xs text-green-400">{t.dashboard.viewsSaved}</p>
        )}
      </section>

      {/* ── Videos ── */}
      <section className="bg-bg-elevated border border-border rounded-lg p-space-5 space-y-space-5">
        <h2 className="eyebrow">{t.dashboard.videos}</h2>

        <form onSubmit={handleSubmitVideo} className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-fluid--1 text-muted">{t.dashboard.videoTitleLabel}</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-bg border border-border rounded-md px-space-3 py-space-2 text-fluid--1 text-content focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-fluid--1 text-muted">{t.dashboard.videoCategoryLabel}</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder={t.dashboard.videoCategoryPlaceholder}
              className="w-full bg-bg border border-border rounded-md px-space-3 py-space-2 text-fluid--1 text-content focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-fluid--1 text-muted">
              {t.dashboard.videoUrlLabel}
            </label>
            <input
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              type="url"
              className="w-full bg-bg border border-border rounded-md px-space-3 py-space-2 text-fluid--1 text-content focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-fluid--1 text-muted">{t.dashboard.videoDescLabel}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-bg border border-border rounded-md px-space-3 py-space-2 text-fluid--1 text-content resize-none focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={submittingVideo}
              className="px-space-5 py-space-2 text-fluid--1 uppercase tracking-[0.14em] bg-white text-black rounded-pill hover:bg-accent transition"
            >
              {submittingVideo ? t.dashboard.saving : t.dashboard.saveVideo}
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {videos.map((video) => (
            <div
              key={video.id}
              className="flex items-center gap-space-3 bg-bg p-space-3 rounded-md border border-border"
            >
              <img
                src={video.thumbnailUrl}
                className="w-28 h-20 rounded-sm object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-content text-fluid--1 truncate">{video.title}</p>
                {video.category && (
                  <p className="text-subtle text-[0.7rem] uppercase tracking-[0.14em] mt-0.5 truncate">
                    {video.category}
                  </p>
                )}
              </div>

              <button
                onClick={() => setEditingVideo(video)}
                className="px-space-3 py-space-1 text-fluid--1 uppercase tracking-[0.12em] border border-border-strong rounded-pill text-muted hover:text-content transition"
              >
                {t.dashboard.edit}
              </button>

              <button
                onClick={() => handleDeleteVideo(video.id)}
                className="px-space-3 py-space-1 text-fluid--1 uppercase tracking-[0.12em] bg-red-600 text-white rounded-pill hover:bg-red-500 transition"
              >
                {t.dashboard.delete}
              </button>
            </div>
          ))}
        </div>

        {editingVideo && (
          <div className="p-space-4 border border-border rounded-md mt-space-4 bg-bg">
            <h3 className="eyebrow mb-space-3">{t.dashboard.editVideoTitle}</h3>

            <form onSubmit={handleUpdateVideo} className="grid gap-3">
              <div>
                <label className="text-fluid--1 text-muted">{t.dashboard.videoTitleLabel}</label>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-bg border border-border rounded-md px-space-3 py-space-2 text-fluid--1 text-content focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                />
              </div>

              <div>
                <label className="text-fluid--1 text-muted">{t.dashboard.videoCategoryLabel}</label>
                <input
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  placeholder={t.dashboard.videoCategoryPlaceholder}
                  className="w-full bg-bg border border-border rounded-md px-space-3 py-space-2 text-fluid--1 text-content focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                />
              </div>

              <div>
                <label className="text-fluid--1 text-muted">{t.dashboard.videoUrlLabel}</label>
                <input
                  value={editYoutubeUrl}
                  onChange={(e) => setEditYoutubeUrl(e.target.value)}
                  className="w-full bg-bg border border-border rounded-md px-space-3 py-space-2 text-fluid--1 text-content focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                />
              </div>

              <div>
                <label className="text-fluid--1 text-muted">{t.dashboard.videoDescLabel}</label>
                <textarea
                  value={editDescription}
                  rows={3}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-bg border border-border rounded-md px-space-3 py-space-2 text-fluid--1 text-content resize-none focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="px-space-5 py-space-2 text-fluid--1 uppercase tracking-[0.14em] border border-border-strong rounded-pill text-muted hover:text-content transition"
                >
                  {t.dashboard.cancel}
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-space-5 py-space-2 text-fluid--1 uppercase tracking-[0.14em] bg-white text-black rounded-pill hover:bg-accent transition"
                >
                  {savingEdit ? t.dashboard.saving : t.dashboard.save}
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}
