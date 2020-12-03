import { ImageListItem } from '#/components/interfaces/ImageListItem';
import { GetImageListResponse } from './interfaces/GetImageListResponse';

function convertImageData(
  imageList: GetImageListResponse['data']
): ImageListItem[] {
  return imageList.map((imageData) => ({
    title: imageData.title,
    id: imageData.id,
    imageLink: imageData.images.fixed_height_downsampled.url,
  }));
}

export default convertImageData;
