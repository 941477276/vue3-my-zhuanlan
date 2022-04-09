import { request } from './request';
export function uploadFile (file: Blob) {
  return request.post('/api/upload', {
    file
  });
}
