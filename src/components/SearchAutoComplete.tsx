import React from 'react';
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
  return (
    <div data-testid={TEST_ID.SEARCH_AC}>
      <input
        value={value}
        data-testid={TEST_ID.SEARCH_AC_INPUT}
        onChange={(e) => onTextChange(e.currentTarget.value)}
      />
      {suggestions && suggestions.length > 0 && (
        <div data-testid={TEST_ID.SEARCH_AC_SUGGESTION}>
          {suggestions.map((suggestion, index) => (
            <div
              onClick={() => onSuggestionClick(suggestion)}
              key={`Suggestion-${index}-${suggestion}`}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchAutoComplete;
