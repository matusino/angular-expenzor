import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PasswordChangePayload } from './password-change/password-change.payload';
import { UserProfile } from './user-profile.payload'
import { UserDTO } from './user-profile/user.payload';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(private http: HttpClient) { }

  getUserByUsername(username: string): Observable<UserProfile>{
    return this.http.get<UserProfile>('http://localhost:8080/users/' + username);
  }

  updateUserProfile(username: string, userProfile: UserProfile): Observable<UserProfile>{
    return this.http.patch<UserProfile>('http://localhost:8080/users/' + username, userProfile);
  }

  changePassword(username: string, passwordChangePayload: PasswordChangePayload): Observable<PasswordChangePayload>{
    return this.http.patch<PasswordChangePayload>('http://localhost:8080/users/password/' + username, passwordChangePayload);
  }


}
