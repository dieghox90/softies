import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Criterio } from '../models/criterio';
import { Observable } from 'rxjs';
import { GlobalVariable } from '../Globals/variables';

@Injectable({
  providedIn: 'root'
})
export class CriterioService {

  public baseEndPoint = GlobalVariable.API_ENDPOINT + "criterios";

  private cabeceras: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  constructor(private http: HttpClient) { }

  public listar(id: number): Observable<Criterio[]> {
    return this.http.get<Criterio[]>(this.baseEndPoint + "-periodo/" + id);
  }

  public crear(criterio: Criterio): Observable<Criterio> {
    return this.http.post<Criterio>(this.baseEndPoint, criterio, { headers: this.cabeceras });
  }

  public crearLita(criterios: Criterio[]): Observable<Criterio[]> {
    return this.http.post<Criterio[]>(this.baseEndPoint + "-lista", criterios, { headers: this.cabeceras });
  }

  public ver(id: number): Observable<Criterio> {
    return this.http.get<Criterio>(this.baseEndPoint + "/" + id);
  }


  public editar(criterio: Criterio): Observable<Criterio> {
    return this.http.put<Criterio>(this.baseEndPoint + "/" + criterio.id, criterio, { headers: this.cabeceras });
  }


  public eliminar_subcriterio(id: number): Observable<Criterio> {
    return this.http.delete<Criterio>(this.baseEndPoint + "/subcriterio/" + id, { headers: this.cabeceras });
  }
}
