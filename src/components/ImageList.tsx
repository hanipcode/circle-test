import React from 'react';
import TEST_ID from '#/constants/testIds';
import { ImageListItem } from './interfaces/ImageListItem';

interface Props {
  images: ImageListItem[];
  onImageClick: (imageData: ImageListItem) => void;
}

const ImageList: React.FC<Props> = ({ images, onImageClick }: Props) => {
  return (
    <div data-testid={TEST_ID.IMG_LIST_CONTAINER}>
      {images.map((image) => (
        <img
          src={image.imageLink}
          key={image.id}
          alt={image.title}
          onClick={() => onImageClick(image)}
        />
      ))}
    </div>
  );
};

export default ImageList;
