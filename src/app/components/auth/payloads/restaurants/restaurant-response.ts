import { Restaurant } from '../../restaurant';

export interface RestaurantResponse {
  content: Restaurant[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: any; // definire una interfaccia specifica per la proprietà 'pageable' se necessario
  size: number;
  sort: any; // definire una interfaccia specifica per la proprietà 'sort' se necessario
  totalElements: number;
  totalPages: number;
}
