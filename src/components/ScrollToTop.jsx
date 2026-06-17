import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

function resetScroll() {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export function scrollPageToTop() {
  resetScroll();
}

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    resetScroll();
    const frame = requestAnimationFrame(() => {
      resetScroll();
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
