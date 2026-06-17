import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import PhotoModal from "./PhotoModal.jsx";

export default function PhotoGrid() {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "photos"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPhotos(list);
        setLoading(false);
      },
      (error) => {
        console.error("Erro ao carregar fotos:", error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  return (
    <div className="w-full">
      {loading && (
        <p className="eyebrow text-center py-space-7">Carregando fotos...</p>
      )}

      {!loading && photos.length === 0 && (
        <p className="text-fluid--1 text-subtle text-center py-space-7">
          Nenhuma foto cadastrada ainda. Acesse o dashboard para adicionar.
        </p>
      )}

      {!loading && photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-space-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative rounded-md overflow-hidden bg-bg border border-border cursor-pointer transition-all duration-300 hover:border-border-strong"
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="aspect-[4/3] bg-bg-elevated">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-space-2 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-content text-fluid--1 truncate">{photo.title}</p>

                {photo.project && (
                  <p className="text-muted text-[0.7rem] truncate">{photo.project}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </div>
  );
}
