"use client";

import Image from "next/image";
import { IMAGES } from "@/lib/images";
import { useChapterImage } from "./ChapterImages";

export default function ImageStage({ keys }: { keys: string[] }) {
  const activeKey = useChapterImage();
  const active = activeKey ? IMAGES[activeKey] : undefined;

  return (
    <figure className="relative w-full h-full flex flex-col items-center justify-center">
      <div className="relative w-full flex-1 min-h-[240px]">
        {/* This chapter's images all stay mounted and crossfade, so a swap never
            flashes empty. Other chapters' images are never downloaded. */}
        {keys.map((key) => {
          const image = IMAGES[key];
          if (!image) return null;
          const isActive = key === activeKey;
          return (
            <Image
              key={key}
              src={image.src}
              alt={isActive ? image.alt : ""}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={isActive}
              aria-hidden={!isActive}
              className={`object-contain transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            />
          );
        })}
      </div>

      {active?.caption && (
        <figcaption
          key={activeKey}
          className="fancy mt-4 text-[10px] uppercase tracking-[0.2em] text-muted text-center"
        >
          {active.caption}
        </figcaption>
      )}
    </figure>
  );
}
