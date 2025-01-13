"use client";
import Image from "next/image";
import React from "react";

export default function ImageOpt({
  src,
  alt,
  width,
  height,
  className,
  layout,
  noPlaceholder,
}: any) {
  const logoLoader = ({
    src,
    width,
    quality,
  }: {
    src: any;
    width: any;
    quality: any;
  }) => {
    return `${src}?w=${width}&q=${quality || 75}`;
  };

  const lazyRoot = React.useRef(null);

  return (
    <div ref={lazyRoot} style={{ marginBottom: "-7px" }}>
      {!noPlaceholder ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          layout={layout}
          priority
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          layout={layout}
          priority
        />
      )}
    </div>
  );
}
