import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { from } from 'rxjs';
import { UserProfile } from '../user-profile.payload';
import { UserProfileService } from '../user-profile.service';
import { PasswordChangePayload } from './password-change.payload';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent implements OnInit {

  passwordChangePayload: PasswordChangePayload = new PasswordChangePayload;
  passwordChangeForm: FormGroup;
  userProfile: UserProfile;
  isError: boolean;

  constructor(private userProfileService: UserProfileService, private router: Router, private toastr: ToastrService, private localStorage: LocalStorageService) {
    this.userProfileService.getUserByUsername(this.localStorage.retrieve('username')).subscribe(userProfile => {
      this.userProfile = userProfile;
    });

  }

  onPasswordChange() {
    if (this.confirm_password.value == this.password.value) {
      this.confirm_password.setErrors(null);
    } else {
      this.confirm_password.setErrors({ mismatch: true });
    }
  }

  // getting the form control elements
  get password(): AbstractControl {
    return this.passwordChangeForm.controls['newPassword'];
  }

  get confirm_password(): AbstractControl {
    return this.passwordChangeForm.controls['confirmNewPassword'];
  }

  ngOnInit(): void {
    this.passwordChangeForm = new FormGroup({
      oldPassword: new FormControl('', Validators.required),
      newPassword: new FormControl('', Validators.required),
      confirmNewPassword: new FormControl('', Validators.required)
    })
  }

  setNewPassword() {
    this.passwordChangePayload = this.passwordChangeForm.value;
    this.passwordChangePayload.password = this.passwordChangeForm.get('oldPassword').value;
    this.passwordChangePayload.newPassword = this.passwordChangeForm.get('newPassword').value;
    this.passwordChangePayload.confirmNewPassword = this.passwordChangeForm.get('confirmNewPassword').value;

    this.userProfileService.changePassword(this.localStorage.retrieve('username'), this.passwordChangePayload).subscribe(() => {
      this.isError = false;
      this.router.navigateByUrl('/profile');
      this.toastr.success('Password changed Successfuly');

    }, error => {
      this.isError = true;
      this.toastr.error('Please provide valid old password');
    });
  }
}
