import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { server, rest } from '#/helpers/testServer';
import { useRouter } from 'next/router';

import TEST_ID from '#/constants/testIds';
import singleMock from '#/mocks/single.json';
import Detail from '../Detail';
import debounce from '../../helpers/debounce';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('../../helpers/debounce', () => ({
  __esModule: true,
  default: (cb, timer) => {
    return cb;
  },
}));

describe('Detail Page', () => {
  beforeEach(() => {
    const handlers = [
      rest.get(`*/${singleMock.data.id}$`, async (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(singleMock));
      }),
    ];
    server.use(...handlers);

    (useRouter as jest.Mock).mockReturnValue({
      query: {
        id: singleMock.data.id,
      },
    });
  });

  it('can render correctly', () => {
    const { queryByTestId } = render(<Detail />);

    expect(queryByTestId(TEST_ID.DETAIL)).toBeInTheDocument();
  });

  it('render image element containing the image url', async () => {
    const expectedUrl = singleMock.data.images.fixed_height.url;
    const { findByText } = render(<Detail />);

    const imgEl = await findByText((tx, el) => {
      return (
        el.tagName.toLowerCase() === 'img' &&
        (el as HTMLImageElement).src === expectedUrl
      );
    });

    expect(imgEl).toBeInTheDocument();
  });

  it('render table of information, of property data', async () => {
    const userPropertyData = JSON.stringify(singleMock.data.title, null, 2);
    const { findByText } = render(<Detail />);

    const dataEl = await findByText(userPropertyData);

    expect(dataEl).toBeInTheDocument();
  });
});
