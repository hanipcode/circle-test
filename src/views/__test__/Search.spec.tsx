import React from 'react';
import '@testing-library/jest-dom';
import {
  fireEvent,
  render,
  waitFor,
  act,
  cleanup,
} from '@testing-library/react';
import Search from '../Search';
import TEST_ID from '#/constants/testIds';
import { server, rest } from '#/helpers/testServer';
import autoCompleteMock from '../../mocks/autocomplete.json';
import trendingData from '../../mocks/trending_data.json';
import searchData from '../../mocks/search.json';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

describe('Search View', () => {
  beforeEach(() => {
    const handlers = [
      rest.get('*/tags$', async (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(autoCompleteMock));
      }),
      rest.get('*/search$', async (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(searchData));
      }),
      rest.get('*/trending', async (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(trendingData));
      }),
    ];
    server.use(...handlers);
  });
  afterEach(cleanup);

  it('render autocomplete input', () => {
    const { getByTestId } = render(<Search />);

    expect(getByTestId(TEST_ID.SEARCH_AC)).toBeTruthy();
  });

  it('not show suggestion container during initial render', () => {
    const { queryByTestId } = render(<Search />);

    expect(queryByTestId(TEST_ID.SEARCH_AC_SUGGESTION)).toBeFalsy();
  });

  it('show suggestion container when typing query', async (done) => {
    const { findByText, getByTestId, findByTestId } = render(<Search />);
    const query = 'SEARCH_TEST_1';
    const input = getByTestId(TEST_ID.SEARCH_AC_INPUT);
    const firstItem = autoCompleteMock.data[0].name;
    fireEvent.change(input, {
      target: {
        value: query,
      },
    });

    const suggestionResultsEl = await findByTestId(
      TEST_ID.SEARCH_AC_SUGGESTION
    );
    const firstItemText = await findByText(firstItem);

    expect(suggestionResultsEl).toBeVisible();
    expect(suggestionResultsEl.children.length).toEqual(
      autoCompleteMock.data.length
    );
    expect(firstItemText).toBeVisible();
    done();
  });

  it('remove suggestion on empty query', async () => {
    const { findByText, getByTestId, findByTestId, queryByTestId } = render(
      <Search />
    );
    const query = 'SEARCH_TEST_1';
    const input = getByTestId(TEST_ID.SEARCH_AC_INPUT);
    const firstItem = autoCompleteMock.data[0].name;
    fireEvent.change(input, {
      target: {
        value: query,
      },
    });

    const suggestionResultsEl = await findByTestId(
      TEST_ID.SEARCH_AC_SUGGESTION
    );
    const firstItemText = await findByText(firstItem);

    expect(suggestionResultsEl).toBeVisible();
    expect(suggestionResultsEl.children.length).toEqual(
      autoCompleteMock.data.length
    );
    expect(firstItemText).toBeVisible();

    // empty the query
    fireEvent.change(input, {
      target: {
        value: '',
      },
    });

    await waitFor(() => {
      expect(
        queryByTestId(TEST_ID.SEARCH_AC_SUGGESTION)
      ).not.toBeInTheDocument();
    });
  });

  it('remove suggestion when suggestion item clicked', async () => {
    const { findByText, getByTestId, queryByText } = render(<Search />);
    const query = 'SEARCH_TEST_1';
    const input = getByTestId(TEST_ID.SEARCH_AC_INPUT);
    const firstItem = autoCompleteMock.data[0].name;
    fireEvent.change(input, {
      target: {
        value: query,
      },
    });
    const firstItemText = await findByText(firstItem);
    fireEvent.click(firstItemText);
    await waitFor(() => {
      expect(queryByText(firstItem)).not.toBeInTheDocument();
    });
  });

  it('initially render image from trending', async () => {
    const { findByAltText } = render(<Search />);
    const firstImage = await findByAltText(trendingData.data[0].title);
    expect(firstImage).toBeVisible();
  });

  it('render from search result after typing', async () => {
    const { getByTestId, findByAltText } = render(<Search />);
    const query = 'SEARCH_TEST_1';
    const input = getByTestId(TEST_ID.SEARCH_AC_INPUT);
    act(() => {
      fireEvent.change(input, {
        target: {
          value: query,
        },
      });
    });

    const firstImage = await findByAltText(searchData.data[0].title);
    expect(firstImage).toBeVisible();
  });

  it('push to deatil page on image click with correct id', async () => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push,
    });
    const { findByAltText } = render(<Search />);
    const firstImage = await findByAltText(trendingData.data[0].title);
    act(() => {
      fireEvent.click(firstImage);
    });
    expect(push).toBeCalledTimes(1);
    expect(push).toBeCalledWith(`/detail/${trendingData.data[0].id}`);
  });
});
