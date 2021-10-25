import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoPregunta } from '../models/tipo-pregunta';
import { GlobalVariable } from '../Globals/variables';

@Injectable({
  providedIn: 'root'
})
export class TipoPreguntaService {

  public baseEndPoint = GlobalVariable.API_ENDPOINT + "tipo-preguntas";

  private cabeceras: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  constructor(private http: HttpClient) { }


  public listar(): Observable<TipoPregunta[]> {
    return this.http.get<TipoPregunta[]>(this.baseEndPoint);
  }

  public crear(tipo_pregunta: TipoPregunta): Observable<TipoPregunta> {
    return this.http.post<TipoPregunta>(this.baseEndPoint, tipo_pregunta, { headers: this.cabeceras });
  }

  public ver(id: number): Observable<TipoPregunta> {
    return this.http.get<TipoPregunta>(this.baseEndPoint + "/" + id);
  }


  public editar(tipo_pregunta: TipoPregunta): Observable<TipoPregunta> {
    return this.http.put<TipoPregunta>(this.baseEndPoint + "/" + tipo_pregunta.id, tipo_pregunta, { headers: this.cabeceras });
  }

  public eliminar_tipo_respuesta(id: number): Observable<TipoPregunta> {
    return this.http.delete<TipoPregunta>(this.baseEndPoint + "/respuesta/" + id, { headers: this.cabeceras });
  }

}
