import { request } from './request';
export function uploadFile (file: Blob) {
  let formData = new FormData();
  formData.append('file', file);
  return request.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
