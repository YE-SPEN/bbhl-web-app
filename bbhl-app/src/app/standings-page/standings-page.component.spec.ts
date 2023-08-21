import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandingsPageComponent } from './standings-page.component';

describe('StandingsPageComponent', () => {
  let component: StandingsPageComponent;
  let fixture: ComponentFixture<StandingsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StandingsPageComponent]
    });
    fixture = TestBed.createComponent(StandingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
