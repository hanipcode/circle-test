import React from 'react';
import { render, fireEvent } from '@testing-library/react';
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
    // @ts-ignore
    const { queryByTestId } = render(<ImageList images={mockImageList} />);
    expect(queryByTestId(TEST_ID.IMG_LIST_CONTAINER)).toBeTruthy();
  });

  it('render image element as much as the search result length', () => {
    // @ts-ignore
    const { getByTestId } = render(<ImageList images={mockImageList} />);
    const imageContainer = getByTestId(TEST_ID.IMG_LIST_CONTAINER);
    expect(imageContainer.children.length).toEqual(mockImageList.length);
  });

  it('render the correct image', () => {
    // @ts-ignore
    const { getByTestId } = render(<ImageList images={mockImageList} />);
    const imageContainer = getByTestId(TEST_ID.IMG_LIST_CONTAINER);
    const firstChild = imageContainer.children.item(0);
    expect(firstChild.tagName.toLowerCase()).toEqual('img');
    expect((firstChild as HTMLImageElement).src).toEqual(
      mockImageList[0].imageLink
    );
  });
  it('run onclick hander with the image data', () => {
    const spy = jest.fn();
    const { getByTestId } = render(
      <ImageList
        images={mockImageList}
        onImageClick={(imageData) => spy(imageData)}
      />
    );
    const imageContainer = getByTestId(TEST_ID.IMG_LIST_CONTAINER);
    const firstChild = imageContainer.children.item(0);
    fireEvent.click(firstChild);
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(mockImageList[0]);
  });
});
