import { Component, computed, inject, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { tap } from 'rxjs/operators';
import { DateItemComponent } from '../item/item.component';
import { ButtonModule } from 'primeng/button';
import { DateEventService } from '../../services/date-event.service';
import { DateEventsService } from '../../services/date-events.service';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-date-list',
  standalone: true,
  imports: [
    ButtonModule,
    DateItemComponent,
    TabsModule,
    RouterModule,
    SkeletonModule,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class DateListComponent implements OnInit {
  readonly dateEventService = inject(DateEventService);
  readonly dateEventsService = inject(DateEventsService);
  readonly messageService = inject(MessageService);
  readonly route = inject(ActivatedRoute);

  allData = computed(() => this.dateEventsService.allData());
  isLoading = computed(() => this.dateEventsService.isLoading());

  ngOnInit() {
    this.route.snapshot.url.toString().includes('planned')
      ? this.dateEventsService.getPlanned().subscribe()
      : this.dateEventsService.getCompleted().subscribe();
  }

  onComplete(id: number) {
    this.dateEventService
      .complete(id)
      .pipe(
        tap(() =>
          this.messageService.add({
            severity: 'success',
            summary: 'Sukces!',
            detail: 'Zmieniono status wydarzenia',
          }),
        ),
      )
      .subscribe();
  }

  onDelete(id: number) {
    this.dateEventService
      .delete(id)
      ?.pipe(
        tap(() => {
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
