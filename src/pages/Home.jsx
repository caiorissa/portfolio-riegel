import React, { useEffect, useState, useMemo } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
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
import VideoShowcase from "../components/VideoShowcase.jsx";
import VideoModal from "../components/VideoModal.jsx";
import AboutPhotoModal, { PhotoNameOverlay } from "../components/AboutPhotoModal.jsx";
import { scrollPageToTop } from "../components/ScrollToTop.jsx";
import BlurText from "../components/reactbits/BlurText.jsx";
import CountUp from "../components/reactbits/CountUp.jsx";
import TiltedCard from "../components/reactbits/TiltedCard.jsx";

const MAX_VIDEOS = 15;
const ABOUT_PHOTO_SRC = "/foto-riegel.png";

const easeOut = [0.22, 1, 0.36, 1];

export default function Home() {
  const { lang, t } = useLang();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [aboutPhotoOpen, setAboutPhotoOpen] = useState(false);
  const [viewTarget, setViewTarget] = useState(2000000);

  const heroCtaTransition = useMemo(() => {
    const titleWords = t.hero.title.split(/\s+/).filter(Boolean).length;
    const descWords = t.hero.description.split(/\s+/).filter(Boolean).length;
    const delaySec = Math.min(2.5, 0.35 + titleWords * 0.04 + descWords * 0.028);
    return { delay: delaySec, duration: 0.5, ease: easeOut };
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
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setVideos(list);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsub();
  }, []);

  const viewMillions = viewTarget / 1000000;

  return (
    <div className="relative w-full">
      {/* ===================== HERO ===================== */}
      <section className="relative min-h-[92vh] flex items-center">
        <div
          className="pointer-events-none absolute inset-0 -z-10
            bg-[radial-gradient(circle_at_50%_-10%,rgba(255,255,255,0.06),transparent_55%)]"
          aria-hidden
        />

        <div className="w-full max-w-6xl mx-auto px-space-4 pt-space-10 pb-space-8">
          <motion.p
            key={`${lang}-hero-eyebrow`}
            className="eyebrow flex items-center gap-space-3 mb-space-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOut }}
          >
            <span className="inline-block h-px w-8 bg-accent/60" />
            {t.hero.eyebrow}
          </motion.p>

          <div className="grid items-center gap-space-8 lg:grid-cols-[1.10fr_0.85fr] lg:gap-space-8">
            <div>
              <h1 className="font-display uppercase text-fluid-6 leading-[0.92] text-content">
                {t.hero.title.split("\n").map((line, i) => (
                  <BlurText
                    key={`${lang}-title-${i}`}
                    text={line}
                    delay={110}
                    animateBy="words"
                    direction="top"
                    className="block"
                  />
                ))}
                <motion.span
                  key={`${lang}-title-accent`}
                  className="block text-gradient"
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.6, delay: 0.35, ease: easeOut }}
                >
                  {t.hero.titleAccent}
                </motion.span>
              </h1>

              <BlurText
                key={`${lang}-hero-desc`}
                text={t.hero.description}
                delay={26}
                animateBy="words"
                direction="top"
                stepDuration={0.3}
                className="mt-space-5 max-w-xl text-fluid-0 leading-relaxed text-muted"
              />

              <div className="mt-space-6 flex flex-wrap items-center gap-space-4">
                <motion.button
                  key={`hero-cta-${lang}`}
                  type="button"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={heroCtaTransition}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    window.location.assign(
                      "/contato",
                    )
                  }
                  className="group inline-flex items-center gap-space-2 rounded-pill bg-white px-space-6 py-space-3
                    text-fluid--1 font-medium uppercase tracking-[0.16em] text-black
                    shadow-md transition-all duration-200 hover:bg-accent hover:shadow-glow"
                >
                  {t.hero.cta}
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </motion.button>
              </div>
            </div>

            {/* Métrica — à direita do título (desktop) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: easeOut }}
              className="lg:justify-self-end lg:pr-space-2 lg:text-right"
            >
              <div className="floating-metric max-md:mt-space-6">
                <div className="metric-number">
                  +
                  <CountUp
                    to={viewMillions}
                    from={0}
                    duration={0.55}
                    delay={0}
                    separator=""
                    className="inline"
                  />{" "}
                  {t.hero.millionSuffix}
                </div>
                <div className="metric-label">{t.hero.metricLabel}</div>
                <div className="metric-detail">{t.hero.metricDetail}</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================== SELECTED WORK ===================== */}
      <section className="relative max-w-6xl mx-auto px-space-4 py-space-8">
        <div className="flex items-end justify-between gap-space-4 mb-space-7">
          <div>
            <p className="eyebrow mb-space-3">{t.portfolio.label}</p>
            <h2 className="font-display uppercase text-fluid-4 text-content">
              {t.portfolio.title}
            </h2>
          </div>
          <p className="hidden sm:block max-w-xs text-fluid--1 text-muted text-right">
            {t.portfolio.description}
          </p>
        </div>

        {loading ? (
          <div className="min-h-[30vh] flex items-center justify-center">
            <p className="eyebrow">{t.portfolio.loading}</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="min-h-[20vh] flex items-center justify-center">
            <p className="text-fluid--1 text-subtle">{t.portfolio.empty}</p>
          </div>
        ) : (
          <VideoShowcase
            videos={videos}
            onSelect={(video) => setSelectedVideo(video)}
          />
        )}
      </section>

      {/* ===================== ABOUT ===================== */}
      <section className="relative w-full border-t border-border">
        <div className="grid lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, scale: 1.03 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: easeOut }}
            className="flex items-center justify-center bg-bg px-space-5 py-space-9 sm:px-space-7 lg:py-space-12"
          >
            <div className="relative w-full max-w-[300px] sm:max-w-[340px] lg:max-w-[380px] aspect-[1513/2690]">
              <TiltedCard
                imageSrc={ABOUT_PHOTO_SRC}
                altText={t.about.name}
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                rotateAmplitude={8}
                scaleOnHover={1.02}
                showMobileWarning={false}
                showTooltip={false}
                displayOverlayContent
                fill
                rounded
                objectFit="cover"
                objectPosition="center 18%"
                overlayContent={<PhotoNameOverlay name={t.about.name} compact />}
                onClick={() => setAboutPhotoOpen(true)}
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="flex flex-col justify-center bg-bg px-space-5 py-space-9 sm:px-space-7 lg:px-space-10 xl:px-space-12 lg:py-space-12"
          >
            <p className="font-display uppercase text-fluid-3 leading-none text-content mb-space-6">
              {t.about.name}
            </p>

            <p className="eyebrow mb-space-5">{t.about.eyebrow}</p>

            <h2 className="font-display uppercase text-fluid-5 leading-[0.92] text-content whitespace-pre-line">
              {t.about.headline}
            </h2>

            <p className="mt-space-6 max-w-md text-fluid-0 leading-relaxed text-muted">
              {t.about.body}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===================== CTA BAND ===================== */}
      <section className="relative max-w-6xl mx-auto px-space-4 pt-space-8 lg:pt-space-9 pb-space-9">
        <div
          className="relative overflow-hidden rounded-xl bg-accent px-space-6 py-space-8 md:px-space-8
            flex flex-col md:flex-row items-start md:items-center justify-between gap-space-5"
        >
          <div
            className="pointer-events-none absolute inset-0
              bg-[radial-gradient(circle_at_80%_-20%,rgba(255,255,255,0.25),transparent_50%)]"
            aria-hidden
          />
          <h2 className="relative font-display uppercase text-fluid-4 leading-[0.95] text-black whitespace-pre-line">
            {t.ctaBand.title}
          </h2>
          <Link
            to="/contato"
            onClick={scrollPageToTop}
            className="relative group inline-flex items-center gap-space-2 rounded-pill bg-black px-space-6 py-space-4
              text-fluid--1 font-medium uppercase tracking-[0.16em] text-white
              transition-all duration-200 hover:bg-bg-elevated whitespace-nowrap"
          >
            {t.ctaBand.button}
            <ArrowUpRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </section>

      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      <AboutPhotoModal open={aboutPhotoOpen} onClose={() => setAboutPhotoOpen(false)} />
    </div>
  );
}
