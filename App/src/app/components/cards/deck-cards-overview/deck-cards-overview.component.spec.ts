import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckCardsOverviewComponent } from './deck-cards-overview.component';

describe('DeckCardsOverviewComponent', () => {
  let component: DeckCardsOverviewComponent;
  let fixture: ComponentFixture<DeckCardsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeckCardsOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckCardsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
