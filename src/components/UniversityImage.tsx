'use client';

import Image from 'next/image';
import { useState } from 'react';

interface UniversityImageProps {
  src: string;
  alt: string;
  size?: 'small' | 'large';
}

export default function UniversityImage({ src, alt, size = 'small' }: UniversityImageProps) {
  const [showImage, setShowImage] = useState(true);

  if (!showImage) return null;

  const dimensions = size === 'small' ? 'w-24 h-24' : 'w-32 h-32';

  return (
    <div className={`relative ${dimensions} mb-4`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="rounded-full object-cover"
        onError={() => setShowImage(false)}
      />
    </div>
  );
} 