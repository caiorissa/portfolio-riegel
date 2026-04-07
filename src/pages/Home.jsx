import React, { useEffect, useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  limit,
  doc
} from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import { useLang } from "../i18n/LanguageContext.jsx";
import VideoCard from "../components/VideoCard.jsx";
import VideoModal from "../components/VideoModal.jsx";
import BlurText from "../components/reactbits/BlurText.jsx";
import CountUp from "../components/reactbits/CountUp.jsx";
import ScrollReveal from "../components/reactbits/ScrollReveal.jsx";

const MAX_VIDEOS = 15;

export default function Home() {
  const { lang, t } = useLang();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [viewTarget, setViewTarget] = useState(2000000);

  const heroCtaTransition = useMemo(() => {
    const titleWords = t.hero.title.split(/\s+/).filter(Boolean).length;
    const descWords = t.hero.description.split(/\s+/).filter(Boolean).length;
    const delaySec = Math.min(2.5, 0.35 + titleWords * 0.04 + descWords * 0.028);
    return {
      delay: delaySec,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    };
  }, [lang, t.hero.title, t.hero.description]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "views"), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.count != null) setViewTarget(data.count);
      }
    });
    return () => unsub();
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

  const viewMillions = viewTarget / 1000000;

  return (
    <>
      <div className="absolute top-0 left-0 right-0 h-[950px] bg-black -z-50"></div>

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
            relative
            max-w-6xl mx-auto px-4 md:px-10
            min-h-[90vh]
            flex flex-col md:flex-row items-center justify-between
          "
        >
          <div className="md:w-1/2 z-10">
            {t.hero.title.split("\n").map((line, i) => (
              <BlurText
                key={`${lang}-${i}`}
                text={line}
                delay={120}
                animateBy="words"
                direction="top"
                className="text-5xl md:text-6xl font-bold text-white leading-tight"
              />
            ))}
            <div className="mb-8" />

            <BlurText
              key={`${lang}-desc`}
              text={t.hero.description}
              delay={30}
              animateBy="words"
              direction="top"
              stepDuration={0.3}
              className="text-neutral-300 text-lg leading-relaxed mb-10 max-w-lg"
            />

            <div className="min-h-[3.25rem] flex flex-col items-start justify-start">
              <motion.button
                key={`hero-cta-${lang}`}
                type="button"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4, margin: "0px 0px -8% 0px" }}
                transition={heroCtaTransition}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  window.open(
                    "https://mail.google.com/mail/?view=cm&fs=1&to=arturriegelph@gmail.com"
                  )
                }
                className="
                  relative inline-flex shrink-0 px-10 py-4 bg-white text-black text-base font-medium
                  rounded-full shadow-xl hover:bg-neutral-200
                  transition-colors duration-200
                  will-change-transform
                "
              >
                {t.hero.cta}
              </motion.button>
            </div>
          </div>

          <div className="md:w-1/2 flex justify-center md:justify-end mt-20 md:mt-0 z-10">
            <div className="floating-metric">
              <div className="metric-number">
                +<CountUp
                  to={viewMillions}
                  from={0}
                  duration={1.5}
                  delay={0.15}
                  separator=""
                  className="inline"
                /> {t.hero.millionSuffix}
              </div>
              <div className="metric-label">
                {t.hero.metricLabel}
              </div>
              <div className="metric-detail">
                {t.hero.metricDetail}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14 mb-10 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <ScrollReveal
            baseRotation={2}
            baseOpacity={0.15}
            blurStrength={3}
            containerClassName="mb-6"
            textClassName="text-[0.75rem] tracking-[0.25em] uppercase text-neutral-500"
          >
            {t.portfolio.label}
          </ScrollReveal>

          <ScrollReveal
            baseRotation={0}
            baseOpacity={0.2}
            blurStrength={2}
            containerClassName="mb-6"
            textClassName="text-sm text-neutral-400 max-w-2xl"
          >
            {t.portfolio.description}
          </ScrollReveal>

          {loading ? (
            <div className="min-h-[30vh] flex items-center justify-center">
              <p className="text-sm text-neutral-500 uppercase tracking-widest">
                {t.portfolio.loading}
              </p>
            </div>
          ) : (
            <div
              className="
                -mx-4 px-4
                flex gap-4 overflow-x-auto pb-2
                snap-x snap-mandatory scroll-smooth
                [scrollbar-width:none] [-ms-overflow-style:none]
                sm:mx-0 sm:px-0 sm:overflow-x-visible sm:pb-0
                sm:grid sm:grid-cols-2
                lg:grid-cols-3
              "
            >
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="
                    snap-start
                    min-w-[85%] sm:min-w-0
                  "
                >
                  <VideoCard
                    video={video}
                    onClick={() => setSelectedVideo(video)}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      </div>
    </>
  );
}
