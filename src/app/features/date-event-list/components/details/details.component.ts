import { Component, inject, input, signal, Signal } from '@angular/core';

import { DateEventService } from '../../services/date-event.service';
import { SkeletonModule } from 'primeng/skeleton';
import { DateEventDetailsDto } from '../../../../shared/models/api/dateEventDetailsDto';
import { finalize, map, switchMap, tap, timer } from 'rxjs';
import { Entity } from '../../../../core/interfaces/entity.interface';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-date-event-details',
  standalone: true,
  imports: [SkeletonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  animations: [
    trigger('expand', [
      transition(':enter', [
        style({ height: '0', opacity: 0 }),
        animate('0.15s ease-in-out', style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1 }),
        animate('0.15s ease-in-out', style({ height: '0', opacity: 0 })),
      ]),
    ]),
  ],
})
export class DateEventDetailsComponent implements Entity {
  readonly dateEventService = inject(DateEventService);

  eventId = input.required<number>();
  entityLoading = signal(false);

  entity: DateEventDetailsDto | undefined;
  expanded = false;
  imageUrl = '';

  toggleDetails(id: number) {
    this.expanded = !this.expanded;

    if (!this.expanded || this.entity) return;

    this.entityLoading.set(true);
    this.dateEventService
      .getOne(id)
      .pipe(
        map((response) => response.data),
        tap((entity) => {
          this.entity = entity;

          if (entity.photo) {
            const buffer = new Uint8Array((entity.photo as any).data).buffer;
            const blob = new Blob([buffer], { type: 'image/jpeg' });
            this.imageUrl = URL.createObjectURL(blob);
          }
        }),
        finalize(() => this.entityLoading.set(false)),
      )
      .subscribe();
  }
}
