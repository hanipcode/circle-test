import { API_BASE_URL, API_KEY } from '#/constants/api_config';
import { AutoCompleteResponse } from './interfaces/AutoCompleteResponse';

export function buildPath(path: string, withApiKey = false): string {
  if (withApiKey) {
    return `${API_BASE_URL}${path}?api_key=${API_KEY}`;
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
