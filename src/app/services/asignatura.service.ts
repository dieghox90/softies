import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Asignatura } from '../models/asignatura';
import { GlobalVariable } from '../Globals/variables';


@Injectable({
  providedIn: 'root'
})
export class AsignaturaService {

  public baseEndPoint = GlobalVariable.API_ENDPOINT + "asignaturas";


  private cabeceras: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  constructor(private http: HttpClient) { }


  public listar(id: number): Observable<Asignatura[]> {
    return this.http.get<Asignatura[]>(this.baseEndPoint + "/busqueda/" + id);
  }

  public crear(asignatura: Asignatura): Observable<Asignatura> {

    return this.http.post<Asignatura>(this.baseEndPoint, asignatura, { headers: this.cabeceras });
  }

  public ver(id: number): Observable<Asignatura> {
    return this.http.get<Asignatura>(this.baseEndPoint + "/" + id);
  }

  public editar(asignatura: Asignatura): Observable<Asignatura> {
    return this.http.put<Asignatura>(this.baseEndPoint + "/" + asignatura.id, asignatura, { headers: this.cabeceras });
  }

}
