import { DatePipe } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { TagModule } from 'primeng/tag';

import { Category, DateEvent } from '../../models/dates-list.model';
import { RouterModule } from '@angular/router';
import { CategoryPipe } from '../../../../core/pipes/category.pipe';
import { ConfirmationService } from 'primeng/api';
import { DatesService } from '../../services/dates.service';

@Component({
  selector: 'app-date-item',
  standalone: true,
  imports: [
    CategoryPipe,
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
  datesService = inject(DatesService);

  event = input.required<DateEvent>();

  completed = output<number>();
  deleted = output<number>();
  editing = output<DateEvent>();

  isSaving = signal(false);
  isDeleting = signal(false);

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
        this.isDeleting.set(true);
        this.datesService.isDeleting.set(true);
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
        this.isSaving.set(true);
        this.datesService.isSaving.set(true);
        this.completed.emit(this.event().id);
      },
      reject: () => {},
    });
  }
}
