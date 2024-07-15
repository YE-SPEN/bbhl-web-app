import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulePageComponent } from './schedule-page.component';

describe('SchedulePageComponent', () => {
  let component: SchedulePageComponent;
  let fixture: ComponentFixture<SchedulePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchedulePageComponent]
    });
    fixture = TestBed.createComponent(SchedulePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
