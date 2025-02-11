import { DatesService } from '../../services/dates.service';
import { DatePipe } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  Injector,
  input,
  OnInit,
  output,
  runInInjectionContext,
  Signal,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TextareaModule } from 'primeng/textarea';

import {
  Category,
  CategoryOption,
  DateEvent,
} from '../../models/dates-list.model';
import { CategoryPipe } from '../../../../core/pipes/category.pipe';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-date-add-edit',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    DatePickerModule,
    IftaLabelModule,
    InputTextModule,
    MultiSelectModule,
    ReactiveFormsModule,
    RouterModule,
    SkeletonModule,
    TextareaModule,
  ],
  providers: [CategoryPipe],
  templateUrl: './add-edit.component.html',
  styleUrl: './add-edit.component.scss',
})
export class DateAddEditComponent implements OnInit {
  readonly categoryPipe = inject(CategoryPipe);
  readonly datesService = inject(DatesService);
  readonly fb = inject(FormBuilder);
  readonly injector = inject(Injector);
  readonly messageService = inject(MessageService);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);

  initialValues!: Signal<DateEvent | undefined>;
  mode!: Signal<'edit' | 'create'>;

  categories: CategoryOption[] = [];
  form: FormGroup;
  isLoading = this.datesService.isLoading;
  isSaving = this.datesService.isSaving;
  willDateBeCompleted = false;

  ngOnInit() {
    this.initialValues = computed(() => {
      return !this.isLoading()
        ? this.datesService.getOne(+this.route.snapshot.params['id'])
        : undefined;
    });
    this.mode = computed(() => (this.initialValues() ? 'edit' : 'create'));

    this.form = this.fb.group({
      title: [this.initialValues()?.title, [Validators.required]],
      dateOfCompletion: [this.initialValues()?.dateOfCompletion],
      description: [this.initialValues()?.description],
      categories: [this.initialValues()?.categories],
    });

    runInInjectionContext(this.injector, () => {
      effect(
        () => {
          const values = this.initialValues();
          if (values) this.form.patchValue(values);
        },
        { allowSignalWrites: true },
      );
    });

    this.form.get('dateOfCompletion')?.valueChanges.subscribe((value) => {
      this.willDateBeCompleted = value <= new Date();
    });

    Object.values(Category)
      .filter((x) => typeof x !== 'string')
      .forEach((value) => {
        this.categories.push({
          label: this.categoryPipe.transform(value),
          value: value as Category,
        });
      });
  }

  save() {
    const updatedEvent = <DateEvent>{
      ...this.initialValues(),
      ...this.form.value,
      completed:
        (this.form.get('dateOfCompletion')?.value as Date) <= new Date(),
    };
    this.isSaving.set(true);

    this.datesService
      .updateEvent(updatedEvent)
      ?.pipe(
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sukces!',
            detail: 'Edytowano wydarzenie',
          });
          this.router.navigate(['/']);
        }),
      )
      .subscribe();
  }

  create() {
    let newId =
      this.datesService.allData()[this.datesService.allData().length - 1].id +
      1;
    while (this.datesService.allData().find((x) => x.id === newId)) newId++;

    this.isSaving.set(true);

    const newEvent = <DateEvent>{
      id: newId,
      completed:
        (this.form.get('dateOfCompletion')?.value as Date) <= new Date(),
      dateAdded: new Date(),
      ...this.form.value,
    };
    this.datesService
      .createEvent(newEvent)
      .pipe(
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sukces!',
            detail: 'Stworzono nowe wydarzenie',
          });
          this.router.navigate(['/']);
        }),
      )
      .subscribe();
  }
}
