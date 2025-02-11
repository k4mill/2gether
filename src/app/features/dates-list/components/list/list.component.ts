import { Component, inject, input, output, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DatesService } from '../../services/dates.service';
import { DateEvent } from '../../models/dates-list.model';
import { RouterModule } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { tap } from 'rxjs/operators';
import { DateItemComponent } from '../item/item.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-date-list',
  standalone: true,
  imports: [ButtonModule, DateItemComponent, TabsModule, RouterModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class DateListComponent {
  readonly datesService = inject(DatesService);
  readonly messageService = inject(MessageService);

  completed = input(false);
  events = input.required<DateEvent[]>();

  eventsUpdate = output<boolean>();

  loadEvents() {
    this.eventsUpdate.emit(this.completed());
  }

  onComplete(id: number) {
    const event = this.datesService.getOne(id);
    if (!event) return;

    event.completed = true;

    this.datesService
      .updateEvent(event)
      ?.pipe(
        tap(() => {
          this.loadEvents();
          this.messageService.add({
            severity: 'success',
            summary: 'Sukces!',
            detail: 'Zakończono wydarzenie',
          });
        }),
      )
      .subscribe();
  }

  onDelete(id: number) {
    this.datesService
      .deleteEvent(id)
      ?.pipe(
        tap(() => {
          this.loadEvents();
          this.messageService.add({
            severity: 'success',
            summary: 'Sukces!',
            detail: 'Usunięto wydarzenie',
          });
        }),
      )
      .subscribe();
  }
}
