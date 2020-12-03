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
    const firstItemEl = await findByText(firstItem);

    expect(suggestionResultsEl).toBeVisible();

    expect(firstItemEl).toBeVisible();
    done();
  });

  it('query is also in the suggestion for seamless close experience', async () => {
    const { findByText, getByTestId, findByTestId } = render(<Search />);
    const query = 'SEARCH_TEST_1';
    const input = getByTestId(TEST_ID.SEARCH_AC_INPUT);
    const firstItem = autoCompleteMock.data[0].name;
    fireEvent.change(input, {
      target: {
        value: query,
      },
    });
    const querySuggestionEl = await findByText(query);
    expect(querySuggestionEl).toBeInTheDocument();
  });

  it('total suggestion equal to query + suggestions', async () => {
    const { findByText, getByTestId, findByTestId } = render(<Search />);
    const query = 'SEARCH_TEST_1';
    const input = getByTestId(TEST_ID.SEARCH_AC_INPUT);
    const TOTAL_SUGGESTION = autoCompleteMock.data.length + 1;
    fireEvent.change(input, {
      target: {
        value: query,
      },
    });

    const suggestionResultsEl = await findByTestId(
      TEST_ID.SEARCH_AC_SUGGESTION
    );
    expect(suggestionResultsEl.children.length).toEqual(TOTAL_SUGGESTION);
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
    const firstItemEl = await findByText(firstItem);

    expect(suggestionResultsEl).toBeVisible();
    expect(firstItemEl).toBeVisible();

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
    const firstItemEl = await findByText(firstItem);
    fireEvent.click(firstItemEl);
    await waitFor(() => {
      expect(queryByText(firstItem)).not.toBeInTheDocument();
    });
  });

  it('fill the search box on suggestion click', async () => {
    const { findByText, getByTestId, queryByText, getByText } = render(
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
    const firstItemEl = await findByText(firstItem);
    act(() => {
      fireEvent.click(firstItemEl);
    });
    await waitFor(() => {
      expect((input as HTMLInputElement).value).toEqual(firstItem);
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
