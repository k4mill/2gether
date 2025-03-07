import { inject, Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { env } from '../../env/env';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  http = inject(HttpClient);
  swPush = inject(SwPush);

  test = new BehaviorSubject<any>(null);

  requestPermission() {
    this.swPush.messages.subscribe((message) => {
      console.log(message);
      this.test.next(message);
    });

    this.swPush.subscription.subscribe((subscription) => {
      if (!subscription) this.subscribe();
      else this.checkExisting(subscription);
    });
  }

  private checkExisting(subscription: PushSubscription) {
    this.http
      .post(env.apiBaseUrl + '/push-subscriptions/check', subscription)
      .subscribe();
  }

  private subscribe() {
    this.swPush
      .requestSubscription({
        serverPublicKey: env.vapidPublicKey,
      })
      .then((subscription: PushSubscription) => {
        this.saveSubscription(subscription);
      });
  }

  private saveSubscription(subscription: PushSubscription) {
    this.http
      .post(env.apiBaseUrl + '/push-subscriptions', subscription)
      .subscribe();
  }

  unsubscribe() {
    this.swPush.unsubscribe();
  }
}
