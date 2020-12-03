import ImageList from '#/components/ImageList';
import { ImageListItem } from '#/components/interfaces/ImageListItem';
import SearchAutoComplete from '#/components/SearchAutoComplete';
import {
  getAutoCompleteSuggestion,
  getRandomGiphyData,
  searchGiphyData,
  uploadGiphy,
} from '#/helpers/api';
import convertImageData from '#/helpers/convertImageData';
import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import debounce from '#/helpers/debounce';
import Page from '#/components/Page';
import { useDebouncedCallback } from '#/helpers/useDebouncedCallback';
import { GetImageListResponse } from '#/helpers/interfaces/GetImageListResponse';

const debounced = {
  getAutoCompleteSuggestion: debounce(getAutoCompleteSuggestion, 350),
  getRandomGiphyData: debounce(getRandomGiphyData, 350),
  searchGiphyData: debounce(searchGiphyData, 350),
};

const Search: React.FC = () => {
  const [query, setquery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Array<string>>([]);
  const [images, setImages] = useState<Array<ImageListItem>>([]);
  const [pagination, setPagination] = useState<
    GetImageListResponse['pagination']
  >({ offset: 0, total_count: 0, count: 0 });
  const [isNoNextPage, setIsNoNextPage] = useState(false);
  const Router = useRouter();

  const getTrendingImage = useCallback(
    async (offset = 0) => {
      const response = await debounced.getRandomGiphyData(offset);
      const nextImage =
        offset === 0
          ? convertImageData(response.data)
          : [...images, ...convertImageData(response.data)];

      setPagination(response.pagination);
      setImages(nextImage);
    },
    [images]
  );

  const getSearchResult = useCallback(
    async (offset = 0) => {
      const response = await debounced.searchGiphyData(query, offset);
      const nextImage =
        offset === 0
          ? convertImageData(response.data)
          : [...images, ...convertImageData(response.data)];

      setPagination(response.pagination);
      setImages(nextImage);
    },
    [query, images]
  );

  useEffect(() => {
    if (query === '') {
      setSuggestions([]);
      getTrendingImage(0);
      return;
    } else {
      getSearchResult(0);
      return;
    }
  }, [query]);

  const onAutoCompleteTextChange = useCallback(async (newQuery) => {
    setPagination({ count: 0, total_count: 0, offset: 0 });
    if (newQuery.length > 0) {
      setquery(newQuery);
      const response = await debounced.getAutoCompleteSuggestion(newQuery);
      const suggestionList = response.data
        ? response.data.map((dataValue) => {
            return dataValue.name;
          })
        : [];
      setSuggestions([newQuery, ...suggestionList]);
    } else {
      setquery(newQuery);
      setSuggestions([]);
    }
  }, []);

  const onSuggestionClick = useCallback(async (item) => {
    setquery(item);
    setSuggestions([]);
  }, []);

  const onImageClick = useCallback(
    async (imageItem: ImageListItem) => {
      Router.push(`/detail/${imageItem.id}`);
    },
    [Router]
  );

  const onScroll = useDebouncedCallback((e) => {
    const OFFSET = 75; // px
    const top = (e.nativeEvent.target as HTMLDivElement).scrollTop;
    const total =
      (e.nativeEvent.target as HTMLDivElement).scrollHeight -
      (e.nativeEvent.target as HTMLDivElement).clientHeight -
      OFFSET;
    if (top >= total) {
      loadNext();
    }
  }, 150);

  const loadNext = useCallback(() => {
    if (pagination.offset >= pagination.total_count) {
      return;
    }
    const nextOffset = pagination.offset + 12;
    if (query === '') {
      getTrendingImage(nextOffset);
      return;
    } else {
      getSearchResult(nextOffset);
      return;
    }
  }, [query, getTrendingImage, getSearchResult, pagination]);

  const onUploadFormChange = useCallback(
    async (e: SyntheticEvent) => {
      const file = (e.nativeEvent.target as HTMLInputElement).files[0];
      const resp = await uploadGiphy(file);
      Router.push(`/detail/${resp.data.id}`);
    },
    [Router]
  );

  return (
    <Page onScroll={onScroll}>
      <SearchAutoComplete
        onTextChange={(text) => onAutoCompleteTextChange(text)}
        onSuggestionClick={onSuggestionClick}
        value={query}
        suggestions={query.length > 0 ? suggestions : []}
      />
      <div className="btn-view">
        <div className="upload-btn-wrapper">
          <button className="btn">Upload a file</button>
          <input type="file" name="myfile" onChange={onUploadFormChange} />
        </div>
      </div>
      <ImageList
        images={images}
        onImageClick={(image) => onImageClick(image)}
      />
    </Page>
  );
};

export default Search;
