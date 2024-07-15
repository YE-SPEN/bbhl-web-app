import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerStatsPageComponent } from './player-stats-page.component';

describe('PlayerStatsPageComponent', () => {
  let component: PlayerStatsPageComponent;
  let fixture: ComponentFixture<PlayerStatsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerStatsPageComponent]
    });
    fixture = TestBed.createComponent(PlayerStatsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
