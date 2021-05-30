import { HttpClient, HttpHeaders, HttpXsrfTokenExtractor } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SignupRequestPayload } from '../signup/signup-request.payload';
import { LoginRequestPayload } from '../login/login-request.payload';
import { LoginResponse } from '../login/login-response.payload';
import { map, tap } from 'rxjs/operators';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();
  @Output() username: EventEmitter<string> = new EventEmitter();

  isLoggedin: boolean = false;


  constructor(private httpClient: HttpClient, private localStorage: LocalStorageService, private tokenExtractor: HttpXsrfTokenExtractor) { }

  signup(signupRequestPayload: SignupRequestPayload): Observable<any> {
    return this.httpClient.post('http://localhost:8080/auth/registration', signupRequestPayload, { responseType: 'text' });
  }

  login(loginRequestPayload: LoginRequestPayload): Observable<any> {
    return this.httpClient.post<LoginResponse>('http://localhost:8080/auth/login',
      loginRequestPayload).pipe(map(data => {
        this.localStorage.store('authToken', data.authToken);
        this.localStorage.store('username', data.username);

        this.loggedIn.emit(true);
        this.username.emit(data.username);
        this.isLoggedin = true;
        return true;
      }));
  }


  getEmiter() {
    return this.username;
  }

  logout() {
    this.httpClient.post('logout', {}).subscribe(function () {
      this.app.authenticated = false;

    });
    this.localStorage.clear('username');
    this.localStorage.clear('authToken');
    this.isLoggedin = false;

  }


  getJwtToken() {
    return this.localStorage.retrieve('authToken');
  }

  isLoggedIn(): boolean {
    return this.getJwtToken() != null;
  }

  getUserName() {
    return this.localStorage.retrieve('username');
  }
}
