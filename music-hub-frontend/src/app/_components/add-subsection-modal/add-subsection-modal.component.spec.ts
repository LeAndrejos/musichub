import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubsectionModalComponent } from './add-subsection-modal.component';

describe('AddSubsectionModalComponent', () => {
  let component: AddSubsectionModalComponent;
  let fixture: ComponentFixture<AddSubsectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSubsectionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSubsectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
