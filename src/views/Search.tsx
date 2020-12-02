import SearchAutoComplete from '#/components/SearchAutoComplete';
import { getAutoCompleteSuggestion } from '#/helpers/api';
import React, { useCallback, useState } from 'react';

const Search = () => {
  const [query, setquery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Array<string>>([]);
  const onAutoCompleteTextChange = useCallback(async (newQuery) => {
    if (newQuery.length > 0) {
      setquery(newQuery);
      const response = await getAutoCompleteSuggestion(newQuery);
      const suggestionList = response.data.map((dataValue) => {
        return dataValue.name;
      });
      setSuggestions(suggestionList);
    } else {
      setSuggestions([]);
    }
  }, []);
  const onSuggestionClick = useCallback(async () => {
    setSuggestions([]);
  }, []);

  return (
    <div>
      <SearchAutoComplete
        onTextChange={(text) => onAutoCompleteTextChange(text)}
        onSuggestionClick={onSuggestionClick}
        value={query}
        suggestions={suggestions}
      />
    </div>
  );
};

export default Search;
