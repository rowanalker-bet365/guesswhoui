import React from 'react';
import Image from 'next/image';

interface CharacterImageProps {
  imagePath: string;
  altText: string;
}

const CharacterImage: React.FC<CharacterImageProps> = ({ imagePath, altText }) => {
  return (
    <Image
      src={imagePath}
      alt={altText}
      className="h-full w-full rounded-lg object-cover"
      width={200}
      height={200}
    />
  );
};

export { CharacterImage };