import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { Aura } from 'primeng/themes/aura';
import { ToastModule } from 'primeng/toast';
import { DateEventsService } from './features/date-event-list/services/date-events.service';
import { DateEventService } from './features/date-event-list/services/date-event.service';
import { PreviousRouteService } from './core/services/previous-route.service';
import { PushNotificationService } from './core/services/push-notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, ToastModule],
  providers: [
    MessageService,
    DateEventsService,
    DateEventService,
    PreviousRouteService,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly dateEventsService = inject(DateEventsService);
  readonly previousRouteService = inject(PreviousRouteService);
  readonly pushNotificationService = inject(PushNotificationService);

  constructor(private config: PrimeNGConfig) {
    // Default theme configuration
    this.config.theme.set({
      preset: {
        ...Aura,
        semantic: {
          ...Aura.semantic,
          primary: {
            50: '{violet.50}',
            100: '{violet.100}',
            200: '{violet.200}',
            300: '{violet.300}',
            400: '{violet.400}',
            500: '{violet.500}',
            600: '{violet.600}',
            700: '{violet.700}',
            800: '{violet.800}',
            900: '{violet.900}',
            950: '{violet.950}',
          },
        },
      },
      options: {
        prefix: 'p',
        darkModeSelector: 'system',
        cssLayer: false,
      },
    });
  }
}
