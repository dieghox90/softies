import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Rol } from '../models/rol';
import { Observable } from 'rxjs';
import { GlobalVariable } from '../Globals/variables';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  public baseEndPoint = GlobalVariable.API_ENDPOINT + "roles";

  private cabeceras: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  constructor(private http: HttpClient) { }

  public listar(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.baseEndPoint);
  }

}
