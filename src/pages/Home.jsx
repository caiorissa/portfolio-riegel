import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  limit
} from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import VideoCard from "../components/VideoCard.jsx";
import VideoModal from "../components/VideoModal.jsx";
import PhotoGrid from "../components/PhotoGrid.jsx";

const MAX_VIDEOS = 15;

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [views, setViews] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = 2000000;
    const duration = 900;
    const increment = end / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        setViews(end);
        clearInterval(counter);
      } else {
        setViews(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "videos"),
      orderBy("createdAt", "desc"),
      limit(MAX_VIDEOS)
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setVideos(list);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsub();
  }, []);

  return (
    <>
      <div className="absolute top-0 left-0 right-0 h-[900px] bg-black -z-50"></div>


      <div className="
        absolute left-0 right-0
        top-[950px] md:top-[840px]
        h-[200px]
        bg-gradient-to-b
        from-black/100 via-black/90 to-transparent
        -z-50
      "></div>

      <div className="relative max-w-6xl mx-auto px-4 pt-28 pb-10 z-10">
        <section
          className="
            reveal
            relative
            max-w-6xl mx-auto px-4 md:px-10
            min-h-[90vh]
            flex flex-col md:flex-row items-center justify-between
          "
        >
          {/* TEXTO */}
          <div className="md:w-1/2 z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-8">
              Criação audiovisual<br />de alto impacto.
            </h1>

            <p className="text-neutral-300 text-lg leading-relaxed mb-10 max-w-lg">
              Transformando momentos em experiências visuais marcantes.
              Filmes, comerciais, documentários e vídeos criativos com estética moderna e profissional.
            </p>

            <button
              onClick={() =>
                window.open(
                  "https://mail.google.com/mail/?view=cm&fs=1&to=arturriegelph@gmail.com"
                )
              }
              className="
                px-10 py-4 bg-white text-black text-base font-medium
                rounded-full shadow-xl hover:bg-neutral-200 transition
              "
            >
              Entrar em contato
            </button>
          </div>

          <div className="reveal md:w-1/2 flex justify-center md:justify-end mt-20 md:mt-0 z-10">
            <div className="floating-metric">
              <div className="metric-number">
                +{Math.floor(views / 1000000)} milhões
              </div>
              <div className="metric-label">
                de visualizações geradas
              </div>
              <div className="metric-detail">
                em projetos reais
              </div>
            </div>
          </div>
        </section>

        <section className="reveal mt-14 mb-10 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <p className="text-[0.75rem] tracking-[0.25em] uppercase text-neutral-500 mb-2">
            Portfólio Audiovisual
          </p>

          <p className="text-sm text-neutral-400 max-w-2xl mb-6">
            Uma seleção minimalista dos projetos em vídeo. Clique em um card para assistir
            e ver detalhes.
          </p>

          {loading ? (
            <div className="min-h-[30vh] flex items-center justify-center">
              <p className="text-sm text-neutral-500 uppercase tracking-widest">
                Carregando vídeos...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onClick={() => setSelectedVideo(video)}
                />
              ))}
            </div>
          )}
        </section>

        {/* ===============================
            FOTOS
           =============================== */}
        <section className="reveal mt-10 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <p className="text-[0.75rem] tracking-[0.25em] uppercase text-neutral-500 mb-2">
            Olhar estético
          </p>

          <p className="text-sm text-neutral-400 max-w-2xl mb-6">
            Uma seleção de fotos avulsas e projetos fotográficos.
          </p>

          <PhotoGrid />
        </section>

        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      </div>
    </>
  );
}
