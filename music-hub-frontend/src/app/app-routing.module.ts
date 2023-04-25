import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HomeComponent} from './home';
import {AuthGuard} from './_helpers';
import {CoursesLayoutComponent} from '@app/_components/courses/courses-layout/courses-layout.component';
import {CourseComponent} from '@app/_components/courses/course/course.component';
import {CourseCreateEditComponent} from '@app/_components/courses/course-create-edit/course-create-edit.component';
import {AccountComponent} from '@app/_components/account/account.component';
import {MeetingComponent} from '@app/_components/meeting/meeting.component';
import {UserManagerComponent} from '@app/_components/user-manager/user-manager.component';
import {VideoContentListComponent} from '@app/_components/video-content/video-content-list/video-content-list.component';
import {VideoContentCreateEditComponent} from '@app/_components/video-content/video-content-create-edit/video-content-create-edit.component';
import {VideoContentComponent} from '@app/_components/video-content/video-content/video-content.component';
import {ViewAttachmentComponent} from '@app/_components/view-attachment/view-attachment.component';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'account/edit', component: AccountComponent, canActivate: [AuthGuard]},
  {path: 'account', loadChildren: accountModule},
  {path: 'courses', component: CoursesLayoutComponent, canActivate: [AuthGuard]},
  {path: 'course/create', component: CourseCreateEditComponent, canActivate: [AuthGuard]},
  {path: 'course/:id', component: CourseComponent, canActivate: [AuthGuard]},
  {path: 'course/edit/:id', component: CourseCreateEditComponent, canActivate: [AuthGuard]},
  {path: 'meeting/:id', component: MeetingComponent, canActivate: [AuthGuard]},
  {path: 'manage-users', component: UserManagerComponent, canActivate: [AuthGuard]},
  {path: 'video-content', component: VideoContentListComponent, canActivate: [AuthGuard]},
  {path: 'video-content/create', component: VideoContentCreateEditComponent, canActivate: [AuthGuard]},
  {path: 'video-content/:id', component: VideoContentComponent, canActivate: [AuthGuard]},
  {path: 'view-attachment/:id', component: ViewAttachmentComponent, canActivate: [AuthGuard]},

  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy', useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
