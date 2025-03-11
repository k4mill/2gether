import { inject, Injectable } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';

import { filter, finalize, pairwise, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PreviousRouteService {
  private readonly router = inject(Router);

  private _previousUrl = '';
  private _routingInProgress = false;

  get previousUrl() {
    return this._previousUrl;
  }

  get routingInProgress() {
    return this._routingInProgress;
  }

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof RoutesRecognized),
        pairwise(),
        tap(() => (this._routingInProgress = true)),
      )
      .subscribe((urls) => {
        this._previousUrl = urls[0].urlAfterRedirects;
        this._routingInProgress = false;
      });
  }
}
