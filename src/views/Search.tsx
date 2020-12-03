import ImageList from '#/components/ImageList';
import { ImageListItem } from '#/components/interfaces/ImageListItem';
import SearchAutoComplete from '#/components/SearchAutoComplete';
import {
  getAutoCompleteSuggestion,
  getRandomGiphyData,
  searchGiphyData,
} from '#/helpers/api';
import convertImageData from '#/helpers/convertImageData';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import debounce from '#/helpers/debounce';

const debounced = {
  getAutoCompleteSuggestion: debounce(getAutoCompleteSuggestion, 350),
  getRandomGiphyData: debounce(getRandomGiphyData, 350),
  searchGiphyData: debounce(searchGiphyData, 350),
};

const Search: React.FC = () => {
  const [query, setquery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Array<string>>([]);
  const [images, setImages] = useState<Array<ImageListItem>>([]);
  const Router = useRouter();

  const getTrendingImage = useCallback(async () => {
    const response = await debounced.getRandomGiphyData();
    console.log(response);
    setImages(convertImageData(response.data));
  }, []);

  const getSearchResult = useCallback(async () => {
    const response = await debounced.searchGiphyData(query);
    console.log(response);
    setImages(convertImageData(response.data));
  }, [query]);

  useEffect(() => {
    if (query === '') {
      setSuggestions([]);
      getTrendingImage();
      return;
    } else {
      getSearchResult();
      return;
    }
  }, [query, getTrendingImage, getSearchResult]);

  const onAutoCompleteTextChange = useCallback(async (newQuery) => {
    if (newQuery.length > 0) {
      setquery(newQuery);
      const response = await debounced.getAutoCompleteSuggestion(newQuery);
      const suggestionList = response.data.map((dataValue) => {
        return dataValue.name;
      });
      setSuggestions(suggestionList);
    } else {
      setquery(newQuery);
      setSuggestions([]);
    }
  }, []);

  const onSuggestionClick = useCallback(async () => {
    setSuggestions([]);
  }, []);

  const onImageClick = useCallback(
    async (imageItem: ImageListItem) => {
      Router.push(`/detail/${imageItem.id}`);
    },
    [Router]
  );

  return (
    <div>
      <SearchAutoComplete
        onTextChange={(text) => onAutoCompleteTextChange(text)}
        onSuggestionClick={onSuggestionClick}
        value={query}
        suggestions={suggestions}
      />
      <ImageList
        images={images}
        onImageClick={(image) => onImageClick(image)}
      />
    </div>
  );
};

export default Search;
