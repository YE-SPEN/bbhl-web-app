import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftSimulatorComponent } from './draft-simulator.component';

describe('DraftSimulatorComponent', () => {
  let component: DraftSimulatorComponent;
  let fixture: ComponentFixture<DraftSimulatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DraftSimulatorComponent]
    });
    fixture = TestBed.createComponent(DraftSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
