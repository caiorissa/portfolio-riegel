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
import PhotoModal from "../components/PhotoModal.jsx";

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
    <div className="max-w-5xl mx-auto px-4 pt-28 pb-10">

{/* HERO PREMIUM APPLE STYLE */}
<section className="relative w-full flex flex-col md:flex-row items-center justify-between mt-10 mb-20">

  {/* BOX DE TEXTO GLASS */}
  <div
    className="
      md:w-1/2 w-full
      p-10 rounded-3xl
      bg-white/5 border border-white/10
      backdrop-blur-2xl
      shadow-[0_0_50px_rgba(255,255,255,0.05)]
      hover:shadow-[0_0_80px_rgba(255,255,255,0.09)]
      transition
    "
  >
    <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
      Artur Riegel
    </h1>

    <p className="text-neutral-300 text-sm md:text-base leading-relaxed mb-6 max-w-md">
      Filmmaker especialista em apresentar sua marca. Desde 2024 dando o reconhecimento que seu trabalho merece, através de filmes, comerciais, documentários e vídeos curtos multiplataforma. De Barra do Ribeiro - RS para o mundo!
    </p>

    <button
      onClick={() => window.open("mailto:arturriegelph@gmail.com")}
      className="px-6 py-3 bg-white text-black rounded-full text-sm font-medium hover:bg-neutral-200 transition"
    >
      Entrar em contato
    </button>
  </div>
  <div className="md:w-1/2 w-full flex justify-center mt-10 md:mt-0">
    <img
      src="/foto-riegel.jpeg"
      className="
        w-[90%] md:w-[420px] h-auto
        rounded-3xl object-cover
        shadow-lg shadow-black/40
      "
      alt="Artur Riegel"
    />
  </div>
</section>

<section
  className="
    mb-10 p-8 rounded-3xl
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
  );
}
