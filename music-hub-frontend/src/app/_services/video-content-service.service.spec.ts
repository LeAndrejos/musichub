import { TestBed } from '@angular/core/testing';

import { VideoContentServiceService } from './video-content-service.service';

describe('VideoContentServiceService', () => {
  let service: VideoContentServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoContentServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
