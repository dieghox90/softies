import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Carrera } from '../models/carrera';
import { GlobalVariable } from '../Globals/variables';

@Injectable({
  providedIn: 'root'
})
export class CarreraService {

  public baseEndPoint = GlobalVariable.API_ENDPOINT + "carreras";

  private cabeceras: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  constructor(private http: HttpClient) { }


  public listar(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(this.baseEndPoint);
  }

  public crear(carrera: Carrera): Observable<Carrera> {
    return this.http.post<Carrera>(this.baseEndPoint, carrera, { headers: this.cabeceras });
  }

  public ver(id: number): Observable<Carrera> {
    return this.http.get<Carrera>(this.baseEndPoint + "/" + id);
  }


  public editar(carrera: Carrera): Observable<Carrera> {
    return this.http.put<Carrera>(this.baseEndPoint + "/" + carrera.id, carrera, { headers: this.cabeceras });
  }
}
