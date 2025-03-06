import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ViewChild,
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
import {
  FileBeforeUploadEvent,
  FileSelectEvent,
  FileUploadEvent,
  FileUploadModule,
} from 'primeng/fileupload';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TextareaModule } from 'primeng/textarea';

import { CategoryPipe } from '../../../../core/pipes/category.pipe';
import { finalize, map, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';
import { mapEnumToOptions } from '../../../../shared/helpers/enum.helper';
import { SelectOption } from '../../../../shared/models/select/select-option.model';
import { CreateDateEventDto } from '../../../../shared/models/api/createDateEventDto';
import { UpdateDateEventDto } from '../../../../shared/models/api/updateDateEventDto';
import { Category } from '../../../../shared/models/select/enums.model';
import { DateEventService } from '../../services/date-event.service';
import { CheckboxModule } from 'primeng/checkbox';
import { Tooltip, TooltipModule } from 'primeng/tooltip';
import { Entity } from '../../../../core/interfaces/entity.interface';
import { DateEventsService } from '../../services/date-events.service';
import { PreviousRouteService } from '../../../../core/services/previous-route.service';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-date-add-edit',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    CheckboxModule,
    CommonModule,
    DatePickerModule,
    FileUploadModule,
    IftaLabelModule,
    InputTextModule,
    MultiSelectModule,
    ProgressSpinnerModule,
    ReactiveFormsModule,
    RouterModule,
    SkeletonModule,
    TextareaModule,
    TooltipModule,
  ],
  providers: [CategoryPipe],
  templateUrl: './add-edit.component.html',
  styleUrl: './add-edit.component.scss',
})
export class DateAddEditComponent implements OnInit, Entity {
  readonly categoryPipe = inject(CategoryPipe);
  readonly dateEventService = inject(DateEventService);
  readonly dateEventsService = inject(DateEventsService);
  readonly fb = inject(FormBuilder);
  readonly messageService = inject(MessageService);
  readonly previousRouteService = inject(PreviousRouteService);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);

  @ViewChild(Tooltip) surpriseInfoTooltip!: Tooltip;

  entityLoading = signal(false);
  entityDeleting = signal(false);
  entitySaving = signal(false);
  entity = computed(() => this.dateEventService.entity());

  categories: SelectOption<typeof Category>[] = [];
  eventId: number;
  form: FormGroup;
  imageLoading = false;
  imageUrl: string;
  mode: 'edit' | 'create';
  willDateBeCompleted = false;

  ngOnInit() {
    this.eventId = this.route.snapshot.params['id'];

    this.form = this.fb.group({
      title: ['', [Validators.required]],
      date_completion: [[], [Validators.required]],
      description: [''],
      categories: [[], [Validators.required, Validators.minLength(1)]],
      photo: [null],
      is_surprise: [false],
      completed: [false],
    });

    this.mode = this.eventId ? 'edit' : 'create';
    if (this.mode === 'edit') this.fetchEvent();

    this.form
      .get('date_completion')
      ?.valueChanges.subscribe(
        (value) => (this.willDateBeCompleted = value <= new Date()),
      );

    this.categories = mapEnumToOptions(Category, this.categoryPipe);
  }

  fetchEvent() {
    this.entityLoading.set(true);
    this.dateEventService
      .getOne(+this.route.snapshot.params['id'])
      .pipe(
        map((response) => response.data),
        tap((data) => {
          this.form.patchValue({
            ...data,
            date_completion: new Date(data.date_completion),
          });

          if (data.photo) {
            const buffer = new Uint8Array((data.photo as any).data).buffer;
            const blob = new Blob([buffer], { type: 'image/jpeg' });
            this.imageUrl = URL.createObjectURL(blob);
          }
          if (data.completed) this.form.get('date_completion')?.disable();
          this.toggleForm();
        }),
        finalize(() => this.entityLoading.set(false)),
      )
      .subscribe();
  }

  save() {
    const updatedEvent = <UpdateDateEventDto>{
      ...this.form.getRawValue(),
      completed: !this.entity()?.completed ? this.willDateBeCompleted : true,
    };

    this.entitySaving.set(true);
    this.dateEventService
      .update(this.eventId, updatedEvent)
      ?.pipe(
        tap((response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sukces!',
            detail: 'Edytowano wydarzenie',
          });

          this.form.patchValue({
            ...response.data,
            date_completion: new Date(response.data.date_completion),
          });

          this.toggleForm();

          this.entitySaving.set(false);
        }),
      )
      .subscribe();
  }

  create() {
    const newEvent = <CreateDateEventDto>{
      ...this.form.value,
      completed: this.willDateBeCompleted,
    };
    this.entitySaving.set(true);
    this.dateEventService
      .create(newEvent)
      .pipe(
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sukces!',
            detail: 'Stworzono nowe wydarzenie',
          });
          this.entitySaving.set(false);
        }),
      )
      .subscribe();
  }

  toggleForm() {
    Object.keys(this.form.controls)
      .filter((key) => key !== 'is_surprise')
      .forEach((key) => {
        if (this.entity()?.completed) return;
        this.entity()?.is_surprise
          ? this.form.controls[key].disable()
          : this.form.controls[key].enable();
      });
  }

  async onImageSelect(event: FileSelectEvent) {
    this.imageLoading = true;
    const file = event.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const blob = new Blob([reader.result as any], { type: file.type });
      this.imageUrl = URL.createObjectURL(blob);

      const buffer = reader.result as ArrayBuffer;
      this.form.patchValue({ photo: Array.from(new Uint8Array(buffer)) });

      this.imageLoading = false;
    };

    reader.readAsArrayBuffer(file);
  }

  onImageError() {
    this.form.patchValue({ photo: null });
    this.form.updateValueAndValidity();
  }

  showSurpriseInfo() {
    this.surpriseInfoTooltip.activate();
  }
}
