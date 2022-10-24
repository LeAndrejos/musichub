import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './home';
import {AuthGuard} from './_helpers';
import {CoursesLayoutComponent} from '@app/_components/courses/courses-layout/courses-layout.component';
import {CourseComponent} from '@app/_components/courses/course/course.component';
import {CourseCreateEditComponent} from '@app/_components/courses/course-create-edit/course-create-edit.component';
import {AccountComponent} from '@app/_components/account/account.component';
import {MeetingComponent} from '@app/_components/meeting/meeting.component';
import {UserManagerComponent} from '@app/_components/user-manager/user-manager.component';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);

const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'account/edit', component: AccountComponent, canActivate: [AuthGuard]},
  {path: 'account', loadChildren: accountModule},
  {path: 'courses', component: CoursesLayoutComponent, canActivate: [AuthGuard]},
  {path: 'course/create', component: CourseCreateEditComponent, canActivate: [AuthGuard]},
  {path: 'course/:id', component: CourseComponent, canActivate: [AuthGuard]},
  {path: 'course/edit/:id', component: CourseCreateEditComponent, canActivate: [AuthGuard]},
  {path: 'meeting/:id', component: MeetingComponent, canActivate: [AuthGuard]},
  {path: 'manage-users', component: UserManagerComponent, canActivate: [AuthGuard]},

  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy', useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
