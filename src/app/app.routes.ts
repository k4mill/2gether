import { Routes } from '@angular/router';
import { DateAddEditComponent } from './features/date-event-list/components/add-edit/add-edit.component';
import { TabsComponent } from './features/date-event-list/components/tabs/tabs.component';
import { DateListComponent } from './features/date-event-list/components/list/list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dates',
    pathMatch: 'full',
  },
  {
    path: 'dates',
    component: TabsComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'planned',
      },
      {
        path: 'planned',
        component: DateListComponent,
        data: { completed: false },
      },
      {
        path: 'completed',
        component: DateListComponent,
        data: { completed: true },
      },
    ],
  },
  {
    path: 'add',
    component: DateAddEditComponent,
    pathMatch: 'full',
  },
  {
    path: 'edit/:id',
    component: DateAddEditComponent,
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'dates',
  },
];
