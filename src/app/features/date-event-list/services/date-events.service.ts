import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';

import { catchError, EMPTY, finalize, map, Observable, take, tap } from 'rxjs';

import { env } from '../../../env/env';
import {
  ApiErrorResponse,
  ApiResponse,
} from '../../../shared/models/api/apiResponse';
import { DateEventDto } from '../../../shared/models/api/dateEventDto';
import { MessageService } from 'primeng/api';
import { extractErrorMessages } from '../../../shared/helpers/error-messages.helper';
import { IListService } from '../../../core/interfaces/list-service.interface';

@Injectable({
  providedIn: 'root',
})
export class DateEventsService implements IListService<DateEventDto> {
  private readonly http = inject(HttpClient);
  private readonly messageService = inject(MessageService);

  private readonly baseUrl = `${env.apiBaseUrl}/date-event`;

  private readonly _isLoading = signal(false);
  private readonly _allCount = signal(0);
  private readonly _allData = signal<DateEventDto[]>([]);

  get isLoading() {
    return this._isLoading;
  }

  get allCount() {
    return this._allCount;
  }

  get allData() {
    return this._allData;
  }

  getAll(completed = false) {
    this.isLoading.set(true);
    return this.http
      .get<ApiResponse<DateEventDto[]>>(this.baseUrl, {
        params: {
          completed: completed.toString(),
        },
      })
      .pipe(
        take(1),
        tap((response) => {
          this._allCount.set(response.total);
          this._allData.set(response.data);
        }),
        catchError((error: ApiErrorResponse) => {
          this.messageService.add({
            severity: 'error',
            summary: error.error,
            detail: extractErrorMessages(error.message),
          });
          return EMPTY;
        }),
        finalize(() => this.isLoading.set(false)),
      );
  }

  getPlanned() {
    return this.getAll();
  }

  getCompleted() {
    return this.getAll(true);
  }

  deleteEvent(id: number) {
    this._allData.set(this._allData().filter((event) => event.id !== id));
  }
}
