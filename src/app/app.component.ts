import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { Aura } from 'primeng/themes/aura';
import { ToastModule } from 'primeng/toast';
import { DatesService } from './features/dates-list/services/dates.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, ToastModule],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  datesService = inject(DatesService);

  title = '2gether';

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

  ngOnInit() {
    this.datesService.getAll().subscribe();
  }
}
