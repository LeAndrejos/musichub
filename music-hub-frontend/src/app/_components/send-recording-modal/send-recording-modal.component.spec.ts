import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendRecordingModalComponent } from './send-recording-modal.component';

describe('SendRecordingModalComponent', () => {
  let component: SendRecordingModalComponent;
  let fixture: ComponentFixture<SendRecordingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendRecordingModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendRecordingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
