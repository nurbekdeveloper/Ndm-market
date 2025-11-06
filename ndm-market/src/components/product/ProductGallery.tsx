"use client";

import Image from "next/image";
import { useState } from "react";

import type { Locale } from "@/lib/i18n";
import { pickLocalizedAlt } from "@/lib/utils";
import type { ProductImage } from "@prisma/client";

interface ProductGalleryProps {
  images: ProductImage[];
  locale: Locale;
}

export default function ProductGallery({ images, locale }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasImages = images.length > 0;
  const activeImage = hasImages ? images[activeIndex] : null;

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-subtle">
        {activeImage ? (
          <Image
            key={activeImage.id}
            src={activeImage.url}
            alt={pickLocalizedAlt(activeImage, locale) ?? "Product image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            No image available
          </div>
        )}
      </div>

      {hasImages ? (
        <div className="flex gap-3 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-[var(--radius-sm)] border transition-transform ${
                index === activeIndex
                  ? "border-primary shadow"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={image.url}
                alt={pickLocalizedAlt(image, locale) ?? "Thumbnail"}
                fill
                sizes="96px"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
