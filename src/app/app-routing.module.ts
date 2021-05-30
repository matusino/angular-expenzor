import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { TestComponent } from './test/test.component';
import { PasswordChangeComponent } from './user/password-change/password-change.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';

const routes: Routes = [
  { path:'home', component: HomeComponent },
  { path: 'sign-up', component: SignupComponent },
  { path: '', component: LoginComponent },
  { path: 'test', component:TestComponent},
  { path : 'profile', component:UserProfileComponent},
  { path : 'password', component:PasswordChangeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
