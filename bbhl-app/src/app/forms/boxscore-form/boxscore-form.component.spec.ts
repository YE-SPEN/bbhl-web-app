import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxscoreFormComponent } from './boxscore-form.component';

describe('BoxscoreFormComponent', () => {
  let component: BoxscoreFormComponent;
  let fixture: ComponentFixture<BoxscoreFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoxscoreFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoxscoreFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
