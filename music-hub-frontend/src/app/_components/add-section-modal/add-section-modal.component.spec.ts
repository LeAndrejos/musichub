import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSectionModalComponent } from './add-section-modal.component';

describe('AddSectionModalComponent', () => {
  let component: AddSectionModalComponent;
  let fixture: ComponentFixture<AddSectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSectionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
