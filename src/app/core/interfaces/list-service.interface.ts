import { Signal } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiResponse } from '../../shared/models/api/apiResponse';

// D = Data
export interface IListService<D> {
  allData: Signal<D[] | null>;
  isLoading: Signal<boolean>;

  getAll(): Observable<ApiResponse<D[]>>;
}
