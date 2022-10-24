import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsectionListComponent } from './subsection-list.component';

describe('SubsectionListComponent', () => {
  let component: SubsectionListComponent;
  let fixture: ComponentFixture<SubsectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubsectionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubsectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
