import React from 'react';
import Image from 'next/image';

interface CharacterImageProps {
  imageUrl: string;
  altText: string;
}

const CharacterImage: React.FC<CharacterImageProps> = ({ imageUrl, altText }) => {
  return (
    <Image
      src={imageUrl}
      alt={altText}
      className="h-full w-full rounded-lg object-cover"
      width={200}
      height={200}
    />
  );
};

export { CharacterImage };