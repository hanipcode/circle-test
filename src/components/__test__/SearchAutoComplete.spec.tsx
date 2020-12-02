import React from 'react';
import SearchAutoComplete from '../SearchAutoComplete';
import { getByTestId, render, fireEvent } from '@testing-library/react';
import TEST_ID from '#/constants/testIds';

describe('Search Autocomplete', () => {
  it('Can Render Without Crash', () => {
    // @ts-ignore
    const { getByTestId } = render(<SearchAutoComplete />);
    expect(getByTestId(TEST_ID.SEARCH_AC)).toBeTruthy();
  });

  it('render an input element', () => {
    // @ts-ignore
    const { getByText } = render(<SearchAutoComplete />);
    const input = getByText((text, el) => {
      return el.tagName.toLowerCase() === 'input';
    });
    expect(input).toBeTruthy();
  });

  it('render input element with value from props', () => {
    const inputValue = 'HERO-TEST_AUTOC_INPUT';
    // @ts-ignore
    const { getByTestId } = render(<SearchAutoComplete value={inputValue} />);
    const input = getByTestId(TEST_ID.SEARCH_AC_INPUT);
    expect((input as HTMLInputElement).value).toEqual(inputValue);
  });

  it('when writing inside the input will run the onTextChange props', () => {
    const spy = jest.fn();
    const ttc = 'TESTTEX';
    const { getByTestId } = render(
      // @ts-ignore
      <SearchAutoComplete
        onTextChange={(text) => {
          spy(text);
        }}
      />
    );
    const input = getByTestId(TEST_ID.SEARCH_AC_INPUT);
    fireEvent.change(input, {
      target: {
        value: ttc,
      },
    });

    expect((input as HTMLInputElement).value).toEqual(ttc);
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(ttc);
  });

  it('given suggestions props render list of suggestions', () => {
    const SUGGESTION_LIST = ['one', 'two', 'three'];
    const { getByTestId, getByText } = render(
      // @ts-ignore
      <SearchAutoComplete suggestions={SUGGESTION_LIST} />
    );

    expect(getByTestId(TEST_ID.SEARCH_AC_SUGGESTION).children.length).toEqual(
      SUGGESTION_LIST.length
    );

    expect(getByText(SUGGESTION_LIST[0])).toBeTruthy();
  });

  it('run onSuggestionClick handler sith suggestion word as param', () => {
    const spy = jest.fn();
    const SUGGESTION_LIST = ['one', 'two', 'three'];

    const { getByTestId, getByText } = render(
      // @ts-ignore
      <SearchAutoComplete
        suggestions={SUGGESTION_LIST}
        onSuggestionClick={(suggestion) => spy(suggestion)}
      />
    );

    const firstSuggestionItem = getByText(SUGGESTION_LIST[0]);
    fireEvent.click(firstSuggestionItem);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(SUGGESTION_LIST[0]);
  });
});
