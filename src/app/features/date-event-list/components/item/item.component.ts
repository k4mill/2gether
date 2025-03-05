import { DatePipe } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { TagModule } from 'primeng/tag';

import { RouterModule } from '@angular/router';
import { CategoryPipe } from '../../../../core/pipes/category.pipe';
import { ConfirmationService } from 'primeng/api';
import { DateEventsService } from '../../services/date-events.service';
import { DateEventDto } from '../../../../shared/models/api/dateEventDto';
import { Category } from '../../../../shared/models/select/enums.model';
import { UpdateDateEventDto } from '../../../../shared/models/api/updateDateEventDto';
import { DateEventDetailsDto } from '../../../../shared/models/api/dateEventDetailsDto';
import { DateEventDetailsComponent } from '../details/details.component';

@Component({
  selector: 'app-date-item',
  standalone: true,
  imports: [
    CategoryPipe,
    DateEventDetailsComponent,
    DatePipe,
    CardModule,
    ConfirmPopupModule,
    ButtonModule,
    RouterModule,
    TagModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
})
export class DateItemComponent {
  confirmationService = inject(ConfirmationService);
  dateEventsService = inject(DateEventsService);

  event = input.required<DateEventDto>();

  completed = output<number>();
  deleted = output<number>();

  Category = Category;

  delete(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Ta akcja jest nieodwracalna',
      dismissableMask: true,
      acceptButtonProps: {
        label: 'Usuń',
        severity: 'danger',
        outlined: true,
        icon: 'pi pi-check',
      },
      rejectButtonProps: {
        label: 'Anuluj',
        severity: 'secondary',
        outlined: true,
        icon: 'pi pi-times',
        styleClass: 'ml-0',
      },
      accept: () => {
        this.deleted.emit(this.event().id);
      },
      reject: () => {},
    });
  }

  finish(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Ta akcja jest nieodwracalna',
      dismissableMask: true,
      acceptButtonProps: {
        label: 'Zakończ',
        severity: 'danger',
        outlined: true,
        icon: 'pi pi-check',
      },
      rejectButtonProps: {
        label: 'Anuluj',
        severity: 'secondary',
        outlined: true,
        icon: 'pi pi-times',
        styleClass: 'ml-0',
      },
      accept: () => {
        this.completed.emit(this.event().id);
      },
      reject: () => {},
    });
  }
}
