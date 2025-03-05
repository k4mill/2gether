import { inject, Injectable, signal } from '@angular/core';
import { take, catchError, EMPTY, tap } from 'rxjs';
import { extractErrorMessages } from '../../../shared/helpers/error-messages.helper';
import {
  ApiResponse,
  ApiErrorResponse,
} from '../../../shared/models/api/apiResponse';
import { DateEventDetailsDto } from '../../../shared/models/api/dateEventDetailsDto';
import { UpdateDateEventDto } from '../../../shared/models/api/updateDateEventDto';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { env } from '../../../env/env';
import { IEntityService } from '../../../core/interfaces/entity-service.interface';
import { CreateDateEventDto } from '../../../shared/models/api/createDateEventDto';
import { DateEventsService } from './date-events.service';
import { DEFAULT_PAGINATION } from '../../../shared/constants/pagination.const';

@Injectable({
  providedIn: 'platform',
})
export class DateEventService
  implements
    IEntityService<CreateDateEventDto, UpdateDateEventDto, DateEventDetailsDto>
{
  private readonly http = inject(HttpClient);
  private readonly messageService = inject(MessageService);
  private readonly dateEventsService = inject(DateEventsService);

  private readonly baseUrl = `${env.apiBaseUrl}/date-event`;

  private readonly _entity = signal<DateEventDetailsDto | null>(null);

  get entity() {
    return this._entity;
  }

  getOne(id: number) {
    return this.http
      .get<ApiResponse<DateEventDetailsDto>>(`${this.baseUrl}/${id}`)
      .pipe(
        take(1),
        tap((response) => this._entity.set(response.data)),
        catchError((error: ApiErrorResponse) => {
          this.messageService.add({
            severity: 'error',
            summary: error.error,
            detail: extractErrorMessages(error.message),
          });
          return EMPTY;
        }),
      );
  }

  update(id: number, updatedDateEvent: UpdateDateEventDto) {
    return this.http
      .put<
        ApiResponse<DateEventDetailsDto>
      >(`${this.baseUrl}/${id}`, updatedDateEvent)
      .pipe(
        take(1),
        tap((response) => this._entity.set(response.data)),
        catchError((error: ApiErrorResponse) => {
          this.messageService.add({
            severity: 'error',
            summary: error.error,
            detail: extractErrorMessages(error.message),
          });
          return EMPTY;
        }),
      );
  }

  create(newDateEvent: CreateDateEventDto) {
    return this.http
      .post<
        ApiResponse<DateEventDetailsDto>
      >(`${this.baseUrl}/create`, newDateEvent)
      .pipe(
        take(1),
        tap((response) => this._entity.set(response.data)),
        catchError((error: ApiErrorResponse) => {
          this.messageService.add({
            severity: 'error',
            summary: error.error,
            detail: extractErrorMessages(error.message),
          });
          return EMPTY;
        }),
      );
  }

  complete(id: number) {
    return this.http
      .put<
        ApiResponse<DateEventDetailsDto>
      >(`${this.baseUrl}/complete/${id}`, {})
      .pipe(
        take(1),
        tap((response) => {
          this._entity.set(response.data);
          this.dateEventsService.deleteEvent(id);
        }),
        catchError((error: ApiErrorResponse) => {
          this.messageService.add({
            severity: 'error',
            summary: error.error,
            detail: extractErrorMessages(error.message),
          });
          return EMPTY;
        }),
      );
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      take(1),
      tap(() => {
        this._entity.set(null);
        this.dateEventsService.deleteEvent(id);
      }),
      catchError((error: ApiErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: error.error,
          detail: extractErrorMessages(error.message),
        });
        return EMPTY;
      }),
    );
  }
}
