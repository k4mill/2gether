import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { map, Observable, take, tap } from 'rxjs';

import { BinResponse, DateEvent } from '../models/dates-list.model';
import { env } from '../../../env/env';

@Injectable({
  providedIn: 'root',
})
export class DatesService {
  private readonly http = inject(HttpClient);

  readonly isLoading = signal(false);
  readonly isSaving = signal(false);
  readonly isDeleting = signal(false);

  allData = signal<DateEvent[]>([]);

  put() {
    return this.http.put<BinResponse>(env.root + env.bin, this.allData()).pipe(
      take(1),
      tap(() => {
        this.isLoading.set(false);
        this.isSaving.set(false);
        this.isDeleting.set(false);
      }),
      map((response) => response.record),
    );
  }

  getAll() {
    this.isLoading.set(true);
    return this.http.get<BinResponse>(env.root + env.bin).pipe(
      take(1),
      map((response) => response.record),
      tap((events) => {
        events.forEach(
          (x) => (x.dateOfCompletion = new Date(x.dateOfCompletion)),
        );
        this.allData.set(events);
        this.isLoading.set(false);
      }),
    );
  }

  getOne(id: number) {
    return this.allData().find((x) => x.id === id);
  }

  getPlanned() {
    return signal(this.allData().filter((x) => x.completed != true));
  }

  getCompleted() {
    return signal(this.allData().filter((x) => x.completed == true));
  }

  updateEvent(event: DateEvent) {
    const existingEvent = this.allData().find((x) => x.id === event.id);
    if (!existingEvent) return;
    this.allData()[this.allData().indexOf(existingEvent)] = {
      ...existingEvent,
      ...event,
    };

    return this.put();
  }

  createEvent(event: DateEvent) {
    this.allData.set([...this.allData(), event]);

    return this.put();
  }

  deleteEvent(id: number) {
    const existingEvent = this.allData().find((x) => x.id === id);
    if (!existingEvent) return;

    return this.http
      .put<BinResponse>(
        env.root + env.bin,
        this.allData().filter((x) => x.id !== id),
      )
      .pipe(
        take(1),
        map((response) => response.record),
        tap((data) => {
          this.isLoading.set(false);
          this.isSaving.set(false);
          this.isDeleting.set(false);
          this.allData.set(data);
        }),
      );
  }
}
