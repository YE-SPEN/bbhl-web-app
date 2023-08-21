import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamRosterPageComponent } from './team-roster-page.component';

describe('TeamRosterPageComponent', () => {
  let component: TeamRosterPageComponent;
  let fixture: ComponentFixture<TeamRosterPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamRosterPageComponent]
    });
    fixture = TestBed.createComponent(TeamRosterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
