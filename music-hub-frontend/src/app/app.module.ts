import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {MatTooltipModule} from '@angular/material/tooltip';

import {AppRoutingModule} from './app-routing.module';
import {JwtInterceptor, ErrorInterceptor} from './_helpers';
import {AppComponent} from './app.component';
import {AlertComponent} from './_components';
import {HomeComponent} from './home';
import {CoursesLayoutComponent} from './_components/courses/courses-layout/courses-layout.component';
import {MatCardModule} from '@angular/material/card';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CourseComponent} from './_components/courses/course/course.component';
import {NgChatModule} from 'ng-chat';
import {ChatComponent} from './_components/chat/chat.component';
import {HeaderComponent} from '@app/_components/header/header.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatButtonModule} from '@angular/material/button';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSelectModule} from '@angular/material/select';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';


import {MatIconModule} from '@angular/material/icon';

import {CourseCreateEditComponent} from './_components/courses/course-create-edit/course-create-edit.component';


import {SectionComponent} from './_components/courses/section/section.component';
import {MatExpansionModule} from '@angular/material/expansion';


import {AddSectionModalComponent} from './_components/add-section-modal/add-section-modal.component';
import {SectionListComponent} from './_components/courses/section-list/section-list.component';

import {AccountComponent} from './_components/account/account.component';
import {MeetingComponent} from './_components/meeting/meeting.component';
import {AddMeetingModalComponent} from './_components/add-meeting-modal/add-meeting-modal.component';
import {MatOptionModule} from '@angular/material/core';
import {SendRecordingModalComponent} from './_components/send-recording-modal/send-recording-modal.component';
import {AddUserModalComponent} from './_components/add-user-modal/add-user-modal.component';
import {MatListModule} from '@angular/material/list';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatCardModule,
    FlexLayoutModule,
    NgChatModule,
    FormsModule,
    NgbModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    BrowserAnimationsModule,
    MatOptionModule,
    MatSelectModule,
    NgxMaterialTimepickerModule,
    MatListModule,
    MatToolbarModule,
    MDBBootstrapModule,
    MatTooltipModule
  ],
  declarations: [
    AppComponent,
    AlertComponent,
    HomeComponent,
    CoursesLayoutComponent,
    CourseComponent,
    ChatComponent,
    HeaderComponent,
    CourseCreateEditComponent,
    SectionComponent,
    AddSectionModalComponent,
    SectionListComponent,
    AccountComponent,
    MeetingComponent,
    AddMeetingModalComponent,
    SendRecordingModalComponent,
    AddUserModalComponent],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
