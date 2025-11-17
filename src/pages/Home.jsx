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

<section className="mt-10 mb-16">
  <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
    Sobre mim
  </h2>

  <div className="mb-16 p-8 rounded-3xl
          bg-white/5 border border-white/10
          backdrop-blur-xl shadow-[0_0_40px_rgba(255,255,255,0.05)]
          transition hover:shadow-[0_0_60px_rgba(255,255,255,0.08)]">
    <h3 className="text-lg font-medium text-white mb-3">
      Artur Riegel
    </h3>

    <p className="text-neutral-300 text-sm md:text-base leading-relaxed">
      Sou videomaker e fotógrafo especializado em capturar momentos com estética,
      emoção e identidade visual. Meu trabalho combina luz, narrativa e direção
      para transformar histórias em imagens marcantes. Sempre com foco em
      profundidade, movimento e autenticidade.
    </p>

    <p className="text-neutral-400 text-xs md:text-sm mt-3 leading-relaxed">
      Aqui você encontra uma seleção de vídeos, fotos e álbuns produzidos ao longo
      da minha trajetória profissional.
    </p>
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
    Portfólio em vídeo
  </p>

  <h1 className="text-2xl md:text-3xl font-semibold text-white mb-3">
    Trabalhos selecionados em vídeo
  </h1>

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
    Fotografias
  </p>

  <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">
    Trabalhos em imagem
  </h2>

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
