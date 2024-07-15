import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BbhldokuComponent } from './bbhldoku.component';

describe('BbhldokuComponent', () => {
  let component: BbhldokuComponent;
  let fixture: ComponentFixture<BbhldokuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BbhldokuComponent]
    });
    fixture = TestBed.createComponent(BbhldokuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
