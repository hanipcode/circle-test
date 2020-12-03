import { API_BASE_URL, API_KEY } from '#/constants/api_config';
import { AutoCompleteResponse } from './interfaces/AutoCompleteResponse';
import {
  GetImageListResponse,
  GetSingleImageResponse,
} from './interfaces/GetImageListResponse';

const PER_PAGE = 16;

export function buildPath(path: string, withApiKey = false): string {
  if (withApiKey) {
    return `${API_BASE_URL}${path}?api_key=${API_KEY}&limit=${PER_PAGE}`;
  }
  return `${API_BASE_URL}${path}`;
}

export function getAutoCompleteSuggestion(
  query: string
): Promise<AutoCompleteResponse> {
  const completePath = `${buildPath(`/search/tags`, true)}&q=${query}`;
  return fetch(completePath).then((res) => res.json());
}

export function getRandomGiphyData(
  offset: number
): Promise<GetImageListResponse> {
  if (!offset || offset === 0) {
    return fetch(buildPath('/trending', true)).then((res) => res.json());
  }
  const completePath = `${buildPath(`/trending`, true)}&offset=${offset}`;
  return fetch(completePath).then((res) => res.json());
}

export function searchGiphyData(
  query: string,
  offset: number
): Promise<GetImageListResponse> {
  if (!offset || offset === 0) {
    const completePath = `${buildPath(`/search`, true)}&q=${query}`;
    return fetch(completePath).then((res) => res.json());
  }
  const completePath = `${buildPath(
    `/search`,
    true
  )}&q=${query}&offset=${offset}`;
  return fetch(completePath).then((res) => res.json());
}

export function getGiphyDetail(id: string): Promise<GetSingleImageResponse> {
  return fetch(buildPath(`/${id}`, true)).then((res) => res.json());
}

export async function uploadGiphy(
  fileItem: File
): Promise<{
  data: {
    id: string;
  };
}> {
  const formData = new FormData();
  formData.append('api_key', API_KEY);
  formData.append('file', fileItem, fileItem.name);
  const fileText = await fileItem.text();
  return fetch(`https://upload.giphy.com/v1/gifs`, {
    method: 'POST',
    body: formData,
  }).then((response) => response.json());
}
