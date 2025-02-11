import { Component, computed, inject, OnInit, Signal } from '@angular/core';

import { MessageService } from 'primeng/api';
import { Tabs, TabsModule, TabsStyle } from 'primeng/tabs';
import { SkeletonModule } from 'primeng/skeleton';
import { tap } from 'rxjs';

import { DateListComponent } from '../list/list.component';
import { DatesService } from '../../services/dates.service';
import { DateEvent } from '../../models/dates-list.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule, DateListComponent, SkeletonModule, TabsModule],
  providers: [Tabs, TabsStyle],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent implements OnInit {
  datesService = inject(DatesService);

  events: Signal<DateEvent[]>;
  isLoading = this.datesService.isLoading;

  ngOnInit() {
    this.events = computed(() => this.datesService.getPlanned()());
  }

  onTabChange(value: string | number) {
    if (!value) return;
    this.events =
      +value === 1
        ? this.datesService.getCompleted()
        : this.datesService.getPlanned();
  }

  onEventsUpdate(completed: boolean) {
    this.events = completed
      ? this.datesService.getCompleted()
      : this.datesService.getPlanned();
  }
}
