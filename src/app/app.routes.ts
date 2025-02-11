import { Routes } from '@angular/router';
import { DateAddEditComponent } from './features/dates-list/components/add-edit/add-edit.component';
import { TabsComponent } from './features/dates-list/components/tabs/tabs.component';

export const routes: Routes = [
  {
    path: 'add',
    component: DateAddEditComponent,
  },
  {
    path: 'edit/:id',
    component: DateAddEditComponent,
  },
  {
    path: '',
    component: TabsComponent,
  },
];
