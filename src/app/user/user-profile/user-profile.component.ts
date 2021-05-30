import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { UserProfile } from '../user-profile.payload';
import { UserProfileService } from '../user-profile.service'
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { UserDTO } from './user.payload';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  userDTO: UserProfile;
  userProfile: UserProfile;
  userProfileForm: FormGroup;
  profileChange = true;
  faUser = faUser;
  userNameTest: String;

  constructor(private userProfileService: UserProfileService, private router: Router, private toastr: ToastrService, private localStorage: LocalStorageService) {
    this.userProfileService.getUserByUsername(this.localStorage.retrieve('username')).subscribe(data => {
      this.userProfile = data;
    });
  }

  profileEnable() {
    this.userProfileForm.get('firstName').enable();
    this.userProfileForm.get('lastName').enable();
    this.userProfileForm.get('gender').enable();
    this.userProfileForm.get('city').enable();
    this.userProfileForm.get('phoneNumber').enable();
    this.userProfileForm.get('age').enable();
  }


  ngOnInit(): void {
    this.userProfileForm = new FormGroup({
      firstName: new FormControl({ value: '', disabled: true }, Validators.required),
      lastName: new FormControl({ value: '', disabled: true }, [Validators.required]),
      gender: new FormControl({ value: '', disabled: true }, Validators.required),
      city: new FormControl({ value: '', disabled: true }, Validators.required),
      phoneNumber: new FormControl({ value: '', disabled: true }, Validators.required),
      age: new FormControl({ value: '', disabled: true }, Validators.required)
    })


  }

  updateProfile() {
    if (this.userProfileForm.get('firstName').value !== '') {
      this.userProfile.firstName = this.userProfileForm.get('firstName').value;
    }
    if (this.userProfileForm.get('lastName').value !== '') {
      this.userProfile.lastName = this.userProfileForm.get('lastName').value;
    }
    if (this.userProfileForm.get('gender').value !== '') {
      this.userProfile.gender = this.userProfileForm.get('gender').value;
    }
    if (this.userProfileForm.get('phoneNumber').value !== '') {
      this.userProfile.phoneNumber = this.userProfileForm.get('phoneNumber').value;
    }
    if (this.userProfileForm.get('age').value !== '') {
      this.userProfile.age = this.userProfileForm.get('age').value;
    }
    if (this.userProfileForm.get('city').value !== '') {
      this.userProfile.city = this.userProfileForm.get('city').value;
    }

    this.userProfileService.updateUserProfile(this.localStorage.retrieve('username'), this.userProfile)
      .subscribe(data => {

        this.router.navigateByUrl('/test', { skipLocationChange: true }).then(() =>
          this.router.navigate(['/profile']));
        this.toastr.show('User Profile updated!');
      });

  }

  profileToggle() {
    this.profileChange = !this.profileChange;
  }


}
