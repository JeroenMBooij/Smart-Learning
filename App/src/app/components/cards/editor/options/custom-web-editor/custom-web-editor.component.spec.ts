import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomWebEditorComponent } from './custom-web-editor.component';

describe('CustomWebEditorComponent', () => {
  let component: CustomWebEditorComponent;
  let fixture: ComponentFixture<CustomWebEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomWebEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomWebEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
