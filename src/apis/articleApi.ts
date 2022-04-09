import { request } from './request';
type BodyData = {
  [key: string]: any;
};
export const articleApi = {
  getListByColumnId (columnId = '', page = 1, pageSize = 10) {
    return request.get(`/api/columns/${columnId}/posts?currentPage=${page}&pageSize=${pageSize}`);
  },
  getDetail (id: string) {
    return request.get(`/api/posts/${id}`);
  },
  create (data: BodyData) {
    return request.patch(`/api/posts`, data);
  },
  update (id: string, data: BodyData) {
    return request.patch(`/api/posts/${id}`, data);
  },
  delete (id: string) {
    return request.delete(`/api/posts/${id}`);
  }
};
