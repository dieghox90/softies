import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";

import { map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Docente } from '../models/docente';
import { GlobalVariable } from '../Globals/variables';


@Injectable({
  providedIn: 'root'
})
export class DocenteService {

  public baseEndPoint = GlobalVariable.API_ENDPOINT + "docentes";
  docente: Docente;

  private cabeceras: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });


  constructor(private http: HttpClient) { }

  public listarActivos(page: string, size: string): Observable<any> {
    //any es un tipo generico
    const params = new HttpParams().set("page", page).set("size", size); //es inmutable
    return this.http.get<any>(this.baseEndPoint + "-activos/pagina", {
      params: params
    });
  }

  public listarInactivos(page: string, size: string): Observable<any> {
    //any es un tipo generico
    const params = new HttpParams().set("page", page).set("size", size); //es inmutable
    return this.http.get<any>(this.baseEndPoint + "-inactivos/pagina", {
      params: params
    });
  }

  public crear(docente: Docente): Observable<Docente> {
    return this.http.post<Docente>(this.baseEndPoint, docente)
      .pipe(
        map((response: any) => response.docente as Docente),
        catchError(e => {
          if (e.status == 400) {
            return throwError(e);
          }
          if (e.error.mensaje) {
            console.error(e.error.mensaje);
          }
          return throwError(e);
        }));
  }

  public listar(): Observable<Docente[]> {
    return this.http.get<Docente[]>(this.baseEndPoint);
  }

  public ver(id: number): Observable<Docente> {
    return this.http.get<Docente>(this.baseEndPoint + "/" + id);
  }

  public editar(docente: Docente): Observable<Docente> {
    return this.http.put<Docente>(this.baseEndPoint + "/" + docente.id, docente, { headers: this.cabeceras });
  }

  public inactivar(docente: Docente): Observable<Docente> {
    return this.http.put<Docente>(this.baseEndPoint + "/inactivar/" + docente.id, { headers: this.cabeceras });
  }

  public activar(docente: Docente): Observable<Docente> {
    return this.http.put<Docente>(this.baseEndPoint + "/activar/" + docente.id, { headers: this.cabeceras });
  }


  public listarCargaHoraria(docente_id: number, periodo_id: number): Observable<Docente> {
    let params = new HttpParams()
      .set('docente', docente_id + "")
      .set('periodo', periodo_id + "")
    return this.http.get<Docente>(this.baseEndPoint + "/carga-horaria/", { params: params });

  }

}
