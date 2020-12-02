import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, waitFor } from '@testing-library/react';
import Search from '../Search';
import TEST_ID from '#/constants/testIds';
import { server, rest } from '#/helpers/testServer';
import autoCompleteMock from '../../mocks/autocomplete.json';

describe('Search View', () => {
  beforeEach(() => {
    server.use(
      rest.get('*/tags', async (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(autoCompleteMock));
      })
    );
  });

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
    const { findByTestId, findByText, getByTestId, queryByText } = render(
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
    const firstItemText = await findByText(firstItem);
    fireEvent.click(firstItemText);
    await waitFor(() => {
      expect(queryByText(firstItem)).not.toBeInTheDocument();
    });
  });
});
