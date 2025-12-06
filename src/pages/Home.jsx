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
      (error) => {
        console.error("Erro ao carregar vídeos:", error);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return (
    <>
      <div className="
        absolute
        top-0 left-0 right-0
        h-[900px]
        bg-black
        -z-50
      "></div>

<div className="
  absolute
  left-0 right-0

  top-[950px]
  md:top-[840px]

  h-[200px]
  bg-gradient-to-b
  from-black/100 via-black/90 to-transparent
  -z-50
"></div>

      <div className="relative max-w-6xl mx-auto px-4 pt-28 pb-10 z-10">
        <section
          className="
            relative
            max-w-6xl mx-auto px-4 md:px-10
            min-h-[90vh]
            flex flex-col md:flex-row items-center justify-between
          "
        >
          <div className="md:w-1/2 z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-8">
              Criação audiovisual<br />de alto impacto.
            </h1>

            <p className="text-neutral-300 text-lg leading-relaxed mb-10 max-w-lg">
              Transformando momentos em experiências visuais marcantes.
              Filmes, comerciais, documentários e vídeos criativos com estética moderna e profissional.
            </p>

            <button
              onClick={() => window.open('mailto:arturriegelph@gmail.com')}
              className="
                px-10 py-4 bg-white text-black text-base font-medium
                rounded-full shadow-xl hover:bg-neutral-200 transition
              "
            >
              Entrar em contato
            </button>
          </div>

          <div className="md:w-1/2 flex justify-center md:justify-end mt-10 md:mt-0 z-10">
            <img
              src="/foto-riegel.png"
              alt="Artur Riegel"
              className="
                h-[500px] md:h-[650px] lg:h-[750px]
                object-contain
                drop-shadow-[0_30px_120px_rgba(0,0,0,0.5)]
              "
            />
          </div>
        </section>

        <section
          className="
            mt-14 mb-10 p-8 rounded-3xl
            bg-white/5 border border-white/10
            backdrop-blur-xl shadow-[0_0_40px_rgba(255,255,255,0.05)]
            transition hover:shadow-[0_0_60px_rgba(255,255,255,0.08)]
          "
        >
          <p className="text-[0.75rem] tracking-[0.25em] uppercase text-neutral-500 mb-2">
            Portfólio Audiovisual
          </p>

          <p className="text-sm text-neutral-400 max-w-2xl mb-6">
            Uma seleção minimalista dos projetos em vídeo. Clique em um card para assistir
            e ver detalhes.
          </p>

          {loading ? (
            <div className="min-h-[30vh] flex items-center justify-center">
              <p className="text-sm text-neutral-500 tracking-[0.2em] uppercase">
                Carregando vídeos...
              </p>
            </div>
          ) : videos.length === 0 ? (
            <div className="min-h-[20vh] flex items-center justify-center">
              <p className="text-sm text-neutral-500">
                Nenhum vídeo cadastrado ainda. Acesse o dashboard para adicionar.
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

        <section
          className="
            mt-10 p-8 rounded-3xl
            bg-white/5 border border-white/10
            backdrop-blur-xl shadow-[0_0_40px_rgba(255,255,255,0.05)]
            transition hover:shadow-[0_0_60px_rgba(255,255,255,0.08)]
          "
        >
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
