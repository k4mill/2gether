import { inject, Injectable } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';

import { filter, pairwise, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PreviousRouteService {
  private readonly router = inject(Router);

  private _previousUrl = '';

  get previousUrl() {
    return this._previousUrl;
  }

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof RoutesRecognized),
        pairwise(),
      )
      .subscribe((urls) => (this._previousUrl = urls[0].urlAfterRedirects));
  }
}
