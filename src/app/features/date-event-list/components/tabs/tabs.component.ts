import { Component, inject, Signal } from '@angular/core';

import { Tabs, TabsModule, TabsStyle } from 'primeng/tabs';

import { CommonModule } from '@angular/common';
import { DateEventDto } from '../../../../shared/models/api/dateEventDto';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PreviousRouteService } from '../../../../core/services/previous-route.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule, RouterModule, TabsModule],
  providers: [Tabs, TabsStyle],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent {
  previousRouteService = inject(PreviousRouteService);
  route = inject(ActivatedRoute);

  events: Signal<DateEventDto[]>;
}
