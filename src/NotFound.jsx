import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function setRobotsNoindex() {
  let meta = document.querySelector('meta[name="robots"]');

  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "robots");
    document.head.appendChild(meta);
  }

  meta.setAttribute("content", "noindex, nofollow");
}

export default function NotFound({
  title = "Page Not Found",
  message = "This page is no longer available.",
}) {
  useEffect(() => {
    const previousTitle = document.title;
    const robotsMeta = document.querySelector('meta[name="robots"]');
    const previousRobots = robotsMeta?.getAttribute("content") || null;

    document.title = title;
    setRobotsNoindex();

    return () => {
      document.title = previousTitle;

      const currentMeta = document.querySelector('meta[name="robots"]');
      if (!currentMeta) return;

      if (previousRobots) {
        currentMeta.setAttribute("content", previousRobots);
      } else {
        currentMeta.remove();
      }
    };
  }, [title]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 text-center">
      <div>
        <h1 className="text-3xl font-semibold mb-3">{title}</h1>
        <p className="text-siteText/80 mb-6">{message}</p>
        <Link to="/" className="btn-brown inline-flex px-6 py-3 rounded">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
