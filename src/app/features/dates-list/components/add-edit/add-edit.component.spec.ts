import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateAddEditComponent } from './add-edit.component';

describe('AddEditComponent', () => {
  let component: DateAddEditComponent;
  let fixture: ComponentFixture<DateAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateAddEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DateAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
