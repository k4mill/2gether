import { inject, Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { env } from '../../env/env';
import { HttpClient } from '@angular/common/http';
import { ConfirmationService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  confirmationService = inject(ConfirmationService);
  http = inject(HttpClient);
  swPush = inject(SwPush);

  creatingSubscription = false;

  private _subscription: PushSubscription | null;

  get subscription() {
    return this._subscription;
  }

  constructor() {
    this.swPush.messages.subscribe();

    this.swPush.subscription.subscribe((subscription) => {
      if (!subscription) {
        this.confirmationService.confirm({
          header: 'Powiadomienia',
          closable: true,
          closeOnEscape: true,
          icon: 'pi pi-bell',
          rejectButtonProps: {
            label: 'Nie',
            severity: 'danger',
            outlined: true,
          },
          rejectButtonStyleClass: 'm-4',
          acceptButtonProps: { label: 'Tak', severity: 'success' },
          acceptButtonStyleClass: '!p-4',
          message: 'Czy chcesz otrzymywać powiadomienia?',
          accept: () => {
            this.requestPermission();
          },
        });
      } else {
        this._subscription = subscription;
        if (!this.creatingSubscription)
          this.checkExistingSubscription(subscription);
      }
    });
  }

  private requestPermission() {
    this.creatingSubscription = true;
    this.swPush
      .requestSubscription({
        serverPublicKey: env.vapidPublicKey,
      })
      .then((subscription: PushSubscription) => {
        this.createNewSubscription(subscription);
      });
  }

  private createNewSubscription(subscription: PushSubscription) {
    this.http
      .post(env.apiBaseUrl + '/push-subscriptions', subscription)
      .subscribe(() => (this.creatingSubscription = false));
  }

  checkExistingSubscription(subscription: PushSubscription) {
    this.http
      .post(env.apiBaseUrl + '/push-subscriptions/check', subscription)
      .subscribe();
  }

  unsubscribe() {
    this.swPush.unsubscribe();
  }
}
