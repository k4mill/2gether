import { Signal } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiResponseSingle } from '../../shared/models/api/apiResponse';

// C = Create, U = Update, D = Details
export interface IEntityService<C, U, D> {
  entity: Signal<D | null>;

  getOne(id: number): Observable<ApiResponseSingle<D>>;
  update(id: number, updatedEntity: U): Observable<ApiResponseSingle<D>>;
  create(newEntity: C): Observable<ApiResponseSingle<D>>;
  delete(id: number): Observable<void>;
}
