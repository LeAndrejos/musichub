import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Section} from '@app/_models/section';
import {CourseInfo} from '@app/_models/course-info';
import {CourseService} from '@app/_services/course.service';
import {AccountService} from '@app/_services';

@Component({
  selector: 'app-section-list',
  templateUrl: './section-list.component.html',
  styleUrls: ['./section-list.component.less']
})
export class SectionListComponent implements OnInit {

  @Input() sections: Section[] = [];
  @Input() course: CourseInfo;
  @Output() sectionCreate: EventEmitter<Section> = new EventEmitter<Section>();

  constructor(private courseService: CourseService, private accountService: AccountService) {
  }

  ngOnInit(): void {
    console.log(this.sections);
  }

  addSection(section: Section) {
    this.courseService.createSection(section, this.course.courseId).subscribe(s => {
      this.sections.push(s);
    });
  }

  isOwner(): boolean {
    return this.course?.teacher?.userId === this.accountService.userValue.userId;
  }

  deleteSection(sectionId: string) {
    this.sections = this.sections.filter(section => section.sectionId !== sectionId);
  }
}
