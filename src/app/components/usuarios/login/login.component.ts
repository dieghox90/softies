import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  titulo: String = "Iniciar Session";
  usuario: Usuario;

  constructor(private spinnerService: NgxSpinnerService, public authService: AuthService, private router: Router) {
    this.usuario = new Usuario();
  }

  ngOnInit() {

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }

  }



  login(): void {
    this.spinnerService.show();
    if (this.usuario.username == null || this.usuario.password == null) {
      this.spinnerService.hide();
      Swal.fire('Error Login', 'Username o password vacias!', 'error');
      return;
    }

    this.authService.login(this.usuario).subscribe(response => {
      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);

      let usuario = this.authService.usuario; //metod get usaurio
      this.router.navigate(['home']);
      Swal.fire('Login', 'Hola ' + usuario.username + ' has iniciado session', 'success');
      this.spinnerService.hide();
    }, err => {
      this.spinnerService.hide();
      if (err.status == 400) {
        Swal.fire('Error Login', 'Usuario o clave incorrectas', 'error');
      };

    });
  }



}
