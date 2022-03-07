import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartLearnDeckComponent } from './start-learn-deck.component';

describe('StartLearnDeckComponent', () => {
  let component: StartLearnDeckComponent;
  let fixture: ComponentFixture<StartLearnDeckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartLearnDeckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartLearnDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
