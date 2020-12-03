import { API_BASE_URL, API_KEY } from '#/constants/api_config';
import { AutoCompleteResponse } from './interfaces/AutoCompleteResponse';
import { GetImageListResponse } from './interfaces/GetImageListResponse';

export function buildPath(path: string, withApiKey = false): string {
  if (withApiKey) {
    return `${API_BASE_URL}${path}?api_key=${API_KEY}&limit=10`;
  }
  return `${API_BASE_URL}${path}`;
}

export function getAutoCompleteSuggestion(
  query: string
): Promise<AutoCompleteResponse> {
  const completePath = `${buildPath(`/search/tags`, true)}&q=${query}`;
  return fetch(completePath).then((res) => {
    return res.json();
  });
}

export function getRandomGiphyData(): Promise<GetImageListResponse> {
  return fetch(buildPath('/trending', true)).then((res) => res.json());
}

export function searchGiphyData(query: string): Promise<GetImageListResponse> {
  const completePath = `${buildPath(`/search`, true)}&q=${query}`;
  return fetch(completePath).then((res) => res.json());
}
