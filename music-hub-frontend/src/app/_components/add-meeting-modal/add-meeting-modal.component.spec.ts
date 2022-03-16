import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMeetingModalComponent } from './add-meeting-modal.component';

describe('AddMeetingModalComponent', () => {
  let component: AddMeetingModalComponent;
  let fixture: ComponentFixture<AddMeetingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMeetingModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMeetingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
