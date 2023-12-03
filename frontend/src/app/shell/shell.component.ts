import { Component } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.less'],
})
export class ShellComponent {
  email: string = '';
  verificationCode: string = '';
  jwtToken: string = ''; // New property to store the JWT token

  sendEmail() {
    axios
      .get('http://' + environment.apiUrl + ':5000/auth/get', {
        params: { email: this.email },
      })
      .then((response) => {
        // Handle success, e.g., display a message to the user
        console.log(response.data);
      })
      .catch((error) => {
        // Handle error, e.g., display an error message
        console.error(error);
      });
  }

  checkCode() {
    axios
      .get('http://' + environment.apiUrl + ':5000/auth/checkcode', {
        params: { email: this.email, code: this.verificationCode },
      })
      .then((response) => {
        // Handle success, e.g., store the JWT token
        this.jwtToken = response.data.access_token;
        console.log('JWT Token:', this.jwtToken);
      })
      .catch((error) => {
        // Handle error, e.g., display an error message
        console.error(error);
      });
  }

  openNewTab() {
    console.log(this.jwtToken);
    const jwtTokenString = this.jwtToken ? String(this.jwtToken) : ''; // Convert to string if it's an object
  
    const url = `http://` + environment.apiUrl + `:3000/?email=${this.email}&jwtToken=${jwtTokenString}`;
    window.open(url, '_blank');
  }
}
