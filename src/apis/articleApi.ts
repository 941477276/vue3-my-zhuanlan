import { request } from './request';
type BodyData = {
  [key: string]: any;
};
export const articleApi = {
  getListByColumnId (columnId = '', page = 1, pageSize = 10): Promise<any> {
    return request.get(`/api/columns/${columnId}/posts?currentPage=${page}&pageSize=${pageSize}`);
  },
  getDetail (id: string): Promise<any> {
    return request.get(`/api/posts/${id}`);
  },
  create (data: BodyData): Promise<any> {
    return request.post('/api/posts', data);
  },
  update (id: string, data: BodyData): Promise<any> {
    return request.patch(`/api/posts/${id}`, data);
  },
  delete (id: string): Promise<any> {
    return request.delete(`/api/posts/${id}`);
  }
};
