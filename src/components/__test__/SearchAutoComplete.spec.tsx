import React from 'react';
import SearchAutoComplete from '../SearchAutoComplete';
import { render } from '@testing-library/react';
import TEST_ID from '#/constants/testIds';

describe('Search Autocomplete', () => {
  it('Can Render Without Crash', () => {
    const { getByTestId } = render(<SearchAutoComplete />);
    expect(getByTestId(TEST_ID.SEARCH_AC)).toBeTruthy();
  });
});
