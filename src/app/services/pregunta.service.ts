import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pregunta } from '../models/pregunta';
import { GlobalVariable } from '../Globals/variables';

@Injectable({
  providedIn: 'root'
})
export class PreguntaService {

  public baseEndPoint = GlobalVariable.API_ENDPOINT + "preguntas";

  private cabeceras: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  constructor(private http: HttpClient) { }


  public listar(): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(this.baseEndPoint);
  }


  public listarSubcriterio(id: number): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(this.baseEndPoint + "-subcriterio/" + id);
  }

  public crear(pregunta: Pregunta): Observable<Pregunta> {
    return this.http.post<Pregunta>(this.baseEndPoint, pregunta, { headers: this.cabeceras });
  }

  public crearLista(preguntas: Pregunta[]): Observable<Pregunta[]> {
    return this.http.post<Pregunta[]>(this.baseEndPoint + "-lista", preguntas, { headers: this.cabeceras });
  }

  public ver(id: number): Observable<Pregunta> {
    return this.http.get<Pregunta>(this.baseEndPoint + "/" + id);
  }


  public editar(pregunta: Pregunta): Observable<Pregunta> {
    return this.http.put<Pregunta>(this.baseEndPoint + "/" + pregunta.id, pregunta, { headers: this.cabeceras });
  }
}
