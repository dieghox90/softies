import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Clasificacion } from '../models/clasificacion';
import { Observable } from 'rxjs';
import { Route } from '@angular/compiler/src/core';
import { GlobalVariable } from '../Globals/variables';

@Injectable({
  providedIn: 'root'
})
export class ClasificacionService {

  public baseEndPoint = GlobalVariable.API_ENDPOINT + "clasificaciones";

  private cabeceras: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  constructor(private http: HttpClient) { }

  public listar(): Observable<Clasificacion[]> {
    return this.http.get<Clasificacion[]>(this.baseEndPoint);
  }

  public crear(clasificacion: Clasificacion): Observable<Clasificacion> {
    return this.http.post<Clasificacion>(this.baseEndPoint, clasificacion, { headers: this.cabeceras });
  }

  public ver(id: number): Observable<Clasificacion> {
    return this.http.get<Clasificacion>(this.baseEndPoint + "/" + id);
  }


  public editar(clasificacion: Clasificacion): Observable<Clasificacion> {
    return this.http.put<Clasificacion>(this.baseEndPoint + "/" + clasificacion.id, clasificacion, { headers: this.cabeceras });
  }
}
