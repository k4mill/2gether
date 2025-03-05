import { Signal } from '@angular/core';

export interface Entity {
  entityLoading: Signal<boolean>;
  entitySaving?: Signal<boolean>;
  entityDeleting?: Signal<boolean>;
}
