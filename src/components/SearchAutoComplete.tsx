import React, { useEffect, useRef } from 'react';
import TEST_ID from '#/constants/testIds';

interface Props {
  onTextChange: (text) => void;
  value: string;
  suggestions?: Array<string>;
  onSuggestionClick: (suggestion: string) => void;
}

const SearchAutoComplete: React.FC<Props> = ({
  onTextChange,
  suggestions,
  onSuggestionClick,
  value,
}: Props) => {
  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef.current) {
      (inputRef.current as HTMLInputElement).focus();
    }
  }, [inputRef]);
  return (
    <div data-testid={TEST_ID.SEARCH_AC} className="SAC-Wrapper">
      <input
        className="SAC-Input"
        placeholder="Search Your Favorite Gift"
        value={value}
        ref={inputRef}
        data-testid={TEST_ID.SEARCH_AC_INPUT}
        onChange={(e) => onTextChange(e.currentTarget.value)}
      />
      {suggestions && suggestions.length > 0 && (
        <div
          data-testid={TEST_ID.SEARCH_AC_SUGGESTION}
          className="SAC-Suggestion"
        >
          {suggestions.map((suggestion, index) => (
            <div
              className="SAC-SuggestionItem"
              onClick={() => onSuggestionClick(suggestion)}
              key={`Suggestion-${index}-${suggestion}`}
            >
              <span>{suggestion}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchAutoComplete;
