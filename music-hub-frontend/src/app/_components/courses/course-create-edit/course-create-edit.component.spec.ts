import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCreateEditComponent } from './course-create-edit.component';

describe('CourseCreateComponent', () => {
  let component: CourseCreateEditComponent;
  let fixture: ComponentFixture<CourseCreateEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseCreateEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseCreateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
