import { Component, inject, Signal } from '@angular/core';

import { Tabs, TabsModule, TabsStyle } from 'primeng/tabs';

import { DateEventsService } from '../../services/date-events.service';
import { CommonModule } from '@angular/common';
import { DateEventDto } from '../../../../shared/models/api/dateEventDto';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule, RouterModule, TabsModule],
  providers: [Tabs, TabsStyle],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent {
  dateEventsService = inject(DateEventsService);
  route = inject(ActivatedRoute);

  events: Signal<DateEventDto[]>;
}
