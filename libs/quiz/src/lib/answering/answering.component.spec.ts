import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnsweringComponent } from './answering.component';

describe('AnsweringComponent', () => {
  let component: AnsweringComponent;
  let fixture: ComponentFixture<AnsweringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnsweringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnsweringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
