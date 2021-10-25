import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from '../models/usuario';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalService } from './local.service';
import { GlobalVariable } from '../Globals/variables';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public baseEndPoint = GlobalVariable.AUTH_ENDPOINT;

  public _usuario: Usuario; //_ porque va a tener un metodo accesso un metodo geter
  public _token: string;

  constructor(private localService: LocalService, private http: HttpClient) { }

  login(usuario: Usuario): Observable<any> {
    const credenciales = btoa('angularapp' + ':' + 'istpm2081');//encriptar
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + credenciales
    });

    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);
    return this.http.post<any>(this.baseEndPoint, params.toString(), { headers: httpHeaders });
  }


  guardarUsuario(accessToken: string): void {
    let payload = this.obtenerToken(accessToken);
    alert(payload.index);

    this._usuario = new Usuario();
    this._usuario.nombre = payload.nombre;
    this._usuario.index = payload.index;
    this._usuario.username = payload.user_name;
    this._usuario.rolesAuth = payload.authorities;
    this._usuario.completo = payload.completo;
    this.localService.setJsonValue('usuario_itspm', this._usuario);

    //sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }
  guardarToken(accessToken: string): void {
    this._token = accessToken;
    this.localService.setJsonValue('token_itspm', accessToken);
    //sessionStorage.setItem('token', accessToken);
  }


  obtenerToken(accessToken: string): any {
    if (accessToken != null) {
      return JSON.parse(atob(decodeURIComponent(accessToken.split(".")[1])));
    }

    return null;
  }


  public get usuario(): Usuario {
    if (this._usuario != null) {
      return this._usuario;
    } else if (this._usuario == null && this.localService.getJsonValue('usuario_itspm') != null) {
      //this._usuario = JSON.parse(this.localService.getJsonValue('usuario_itspm')) as Usuario;
      this._usuario = this.localService.getJsonValue('usuario_itspm') as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && this.localService.getJsonValue('token_itspm') != null) {
      this._token = this.localService.getJsonValue('token_itspm');
      return this._token;
    }
    return null;
  }

  isAuthenticated(): boolean {
    let payload = this.obtenerToken(this.token);

    if (payload != null && payload.user_name && payload.user_name.length > 0) {
      //if (payload != null && payload.completo && payload.completo.length > 0) {
      return true;
    }

    return false;
  }

  logout(): void {
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();
    this.localService.clearToken();
  }

  hasRole(role: String): boolean {
    if (this.usuario.rolesAuth.includes(role)) {
      return true;
    }

    return false;
  }


}
