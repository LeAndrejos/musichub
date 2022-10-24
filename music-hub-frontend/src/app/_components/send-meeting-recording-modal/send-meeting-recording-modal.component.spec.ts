import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendMeetingRecordingModalComponent } from './send-meeting-recording-modal.component';

describe('SendMeetingRecordingModalComponent', () => {
  let component: SendMeetingRecordingModalComponent;
  let fixture: ComponentFixture<SendMeetingRecordingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendMeetingRecordingModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendMeetingRecordingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
