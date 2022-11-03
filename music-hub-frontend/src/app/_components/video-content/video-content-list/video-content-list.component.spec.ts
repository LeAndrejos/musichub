import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoContentListComponent } from './video-content-list.component';

describe('VideoContentListComponent', () => {
  let component: VideoContentListComponent;
  let fixture: ComponentFixture<VideoContentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoContentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoContentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
