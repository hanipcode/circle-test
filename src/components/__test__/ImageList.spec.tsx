import React from 'react';
import { render } from '@testing-library/react';
import ImageList from '../ImageList';
import ImageData from '../../mocks/image_data.json';
import { ImageListItem } from '../interfaces/ImageListItem';
import TEST_ID from '#/constants/testIds';

const mockImageList: ImageListItem[] = ImageData.map((imageData) => ({
  title: imageData.title,
  id: imageData.id,
  imageLink: imageData.images.downsized_large.url,
}));

describe('ImageLIst', () => {
  it('can render coorectly', () => {
    const { queryByTestId } = render(<ImageList images={mockImageList} />);
    expect(queryByTestId(TEST_ID.IMG_LIST_CONTAINER)).toBeTruthy();
  });

  it('render image element as much as the search result length', () => {
    const { getByTestId } = render(<ImageList images={mockImageList} />);
    const imageContainer = getByTestId(TEST_ID.IMG_LIST_CONTAINER);
    expect(imageContainer.children.length).toEqual(mockImageList.length);
  });
});
