import { Component, OnInit } from '@angular/core';
import {JwtClientService} from '..//jwt-client.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  authRequest:any={
    "userName":"jano",
  	"password":"jano"
  }


  constructor(private service: JwtClientService) { }

  ngOnInit(): void {
    this.getAccessToken(this.authRequest);
  }

  public getAccessToken(request){
    let resp=this.service.generateToken(this.authRequest);
    resp.subscribe(data=>console.log("Token "+data));
  }

}
