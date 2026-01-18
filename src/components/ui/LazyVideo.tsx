'use client';

import { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import Image from 'next/image';

interface LazyVideoProps {
  src: string;
  poster: string;
  alt: string;
}

const LazyVideo = ({ src, poster, alt }: LazyVideoProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if ((videoRef.current as unknown as { webkitRequestFullscreen?: () => void }).webkitRequestFullscreen) {
        (videoRef.current as unknown as { webkitRequestFullscreen: () => void }).webkitRequestFullscreen();
      }
    }
  };

  return (
    <div ref={containerRef} className="relative group">
      {isVisible ? (
        <video
          ref={videoRef}
          className="w-full aspect-video object-cover rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          poster={poster}
          preload="metadata"
          muted
          loop
          playsInline
          onEnded={handleVideoEnd}
          onClick={handlePlayPause}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="w-full aspect-video bg-stone-100 rounded-2xl shadow-lg flex items-center justify-center relative overflow-hidden">
          <Image
            src={poster}
            alt={alt}
            fill
            className="object-cover rounded-2xl"
            sizes="(max-width: 768px) 100vw, 672px"
          />
          <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center">
            <Play size={48} className="text-white" />
          </div>
        </div>
      )}

      {/* Play/Pause Overlay */}
      {isVisible && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handlePlayPause}
            className="bg-black/50 hover:bg-black/70 text-white rounded-full p-4 transition-colors duration-300"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? (
              <div className="w-8 h-8 flex items-center justify-center">
                <div className="w-3 h-6 border-l-2 border-r-2 border-white"></div>
              </div>
            ) : (
              <Play size={32} className="ml-1" />
            )}
          </button>
        </div>
      )}

      {/* Fullscreen Button */}
      {isVisible && isPlaying && (
        <button
          onClick={handleFullscreen}
          className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-lg p-2 transition-colors duration-300 opacity-0 group-hover:opacity-100"
          title="Enter fullscreen"
          aria-label="Enter fullscreen"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default LazyVideo;
