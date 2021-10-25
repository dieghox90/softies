import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Evaluador } from '../models/evaluador';
import { Observable } from 'rxjs';
import { GlobalVariable } from '../Globals/variables';

@Injectable({
  providedIn: 'root'
})
export class EvaluadorService {

  public baseEndPoint = GlobalVariable.API_ENDPOINT + "evaluadores";

  private cabeceras: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  constructor(private http: HttpClient) { }

  public listar(): Observable<Evaluador[]> {
    return this.http.get<Evaluador[]>(this.baseEndPoint);
  }

  public crear(evaluador: Evaluador): Observable<Evaluador> {
    return this.http.post<Evaluador>(this.baseEndPoint, evaluador, { headers: this.cabeceras });
  }

  public ver(id: number): Observable<Evaluador> {
    return this.http.get<Evaluador>(this.baseEndPoint + "/" + id);
  }


  public editar(evaluador: Evaluador): Observable<Evaluador> {
    return this.http.put<Evaluador>(this.baseEndPoint + "/" + evaluador.id, evaluador, { headers: this.cabeceras });
  }


  public delete(id: number): Observable<Evaluador> {
    return this.http.delete<Evaluador>(this.baseEndPoint + "/" + id, { headers: this.cabeceras });
  }
}
