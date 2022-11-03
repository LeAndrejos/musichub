import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoContentCreateEditComponent } from './video-content-create-edit.component';

describe('VideoContentCreateEditComponent', () => {
  let component: VideoContentCreateEditComponent;
  let fixture: ComponentFixture<VideoContentCreateEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoContentCreateEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoContentCreateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
