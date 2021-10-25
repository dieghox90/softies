import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Respuesta } from '../models/respuesta';
import { GlobalVariable } from '../Globals/variables';

@Injectable({
  providedIn: 'root'
})
export class RespuestaService {

  public baseEndPoint = GlobalVariable.API_ENDPOINT + "respuestas";

  private cabeceras: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  constructor(private http: HttpClient) { }

  public listar(): Observable<Respuesta[]> {
    return this.http.get<Respuesta[]>(this.baseEndPoint);
  }

  public listarByEvaluacion(id: number): Observable<Respuesta[]> {
    return this.http.get<Respuesta[]>(this.baseEndPoint + "-lista/" + id);
  }

  public crear(respuesta: Respuesta): Observable<Respuesta> {
    return this.http.post<Respuesta>(this.baseEndPoint, respuesta, { headers: this.cabeceras });
  }

  public crear_listado(respuesta: Respuesta[]): Observable<Respuesta[]> {
    return this.http.post<Respuesta[]>(this.baseEndPoint + '-lista', respuesta, { headers: this.cabeceras });
  }

  public ver(id: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(this.baseEndPoint + "/" + id);
  }


  public editar(respuesta: Respuesta): Observable<Respuesta> {
    return this.http.put<Respuesta>(this.baseEndPoint + "/" + respuesta.id, respuesta, { headers: this.cabeceras });
  }


  /* Para los resultados visualizados por le administrador */
  public listarEvaluacion(evaluado_id: number, evaluacion_id: number): Observable<Respuesta[]> {
    let params = new HttpParams()
      .set('evaluado', evaluado_id + "")
      .set('evaluacion', evaluacion_id + "")
    return this.http.get<Respuesta[]>(this.baseEndPoint + "/evaluacion/", { params: params });

  }


  /* Para ver el avanse de la realizacion de la evaluacion por los evaluadores */
  public listarRespuestas(evaluado_id: number, evaluacion_id: number, evaluador_id: number): Observable<Respuesta[]> {
    let params = new HttpParams()
      .set('evaluado', evaluado_id + "")
      .set('evaluacion', evaluacion_id + "")
      .set('evaluador', evaluador_id + "")
    return this.http.get<Respuesta[]>(this.baseEndPoint + "/admin/", { params: params });

  }
}
