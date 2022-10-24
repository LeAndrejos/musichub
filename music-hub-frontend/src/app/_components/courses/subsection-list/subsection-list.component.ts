import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Section} from '@app/_models/section';
import {CourseInfo} from '@app/_models/course-info';
import {CourseService} from '@app/_services/course.service';
import {AccountService} from '@app/_services';

@Component({
  selector: 'app-subsection-list',
  templateUrl: './subsection-list.component.html',
  styleUrls: ['./subsection-list.component.less']
})
export class SubsectionListComponent implements OnInit {

  @Input() sections: Section[] = [];
  @Input() course: CourseInfo;
  @Input() section: Section;
  @Output() subsectionCreate: EventEmitter<Section> = new EventEmitter<Section>();

  constructor(private courseService: CourseService, private accountService: AccountService) {
  }

  ngOnInit(): void {
    this.getSubsections();
  }

  addSection(section: Section) {
    this.courseService.createSection(section, this.course.courseId).subscribe(s => {
      this.sections.push(s);
    });
  }

  isOwner(): boolean {
    return this.course?.teacher?.userId === this.accountService.userValue.userId;
  }

  getSubsections() {
    this.courseService.getSubsections(this.course.courseId, this.section.sectionId).subscribe(subsections => {
      this.sections = subsections;
    });
  }

  deleteSubsection(sectionId: string) {
    this.sections = this.sections.filter(section => section.sectionId !== sectionId);
  }

}
