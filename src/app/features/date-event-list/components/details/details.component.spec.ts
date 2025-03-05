import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateEventDetails } from './details.component';

describe('DetailsComponent', () => {
  let component: DateEventDetails;
  let fixture: ComponentFixture<DateEventDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateEventDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(DateEventDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
