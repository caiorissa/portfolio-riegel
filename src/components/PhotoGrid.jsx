// src/components/PhotoGrid.jsx
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

      {/* Estado: Carregando */}
      {loading && (
        <p className="text-sm text-neutral-500 text-center py-10">
          Carregando fotos...
        </p>
      )}

      {/* Estado: Nenhuma foto */}
      {!loading && photos.length === 0 && (
        <p className="text-sm text-neutral-500 text-center py-10">
          Nenhuma foto cadastrada ainda. Acesse o dashboard para adicionar.
        </p>
      )}

      {/* Grid */}
      {!loading && photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative rounded-xl overflow-hidden bg-black border border-white/10 cursor-pointer"
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="aspect-[4/3] bg-neutral-900">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 backdrop-blur-sm">
                <p className="text-white text-xs truncate">{photo.title}</p>

                {photo.project && (
                  <p className="text-neutral-300 text-[0.7rem] truncate">
                    {photo.project}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </div>
  );
}
