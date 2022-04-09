import { request } from './request';
type BodyData = {
  [key: string]: any;
};
export const columnApi = {
  getList (page = 1, pageSize = 10) {
    return request.get(`/api/columns?currentPage=${page}&pageSize=${pageSize}`);
  },
  getDetail (id: string) {
    return request.get(`/api/columns/${id}`);
  },
  update (id:string, data: BodyData) {
    return request.patch(`/api/columns/${id}`, data);
  }
};
