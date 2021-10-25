import { Injectable } from '@angular/core';
import { Evaluacion } from '../models/evaluacion';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalVariable } from '../Globals/variables';
import { Docente } from '../models/docente';
import { Criterio } from '../models/criterio';
import { ContenedorResultadosEvaluacion } from '../models/contenedor-resultados-evaluacion';

@Injectable({
  providedIn: 'root'
})
export class EvaluacionService {

  public baseEndPoint = GlobalVariable.API_ENDPOINT + "evaluaciones";

  private cabeceras: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  constructor(private http: HttpClient) { }


  public listar(id: number): Observable<Evaluacion[]> {
    return this.http.get<Evaluacion[]>(this.baseEndPoint + "/periodo/" + id);
  }

  public crear(evaluacion: Evaluacion): Observable<Evaluacion> {
    return this.http.post<Evaluacion>(this.baseEndPoint, evaluacion, { headers: this.cabeceras });
  }

  public crearList(evaluaciones: Evaluacion[]): Observable<Evaluacion[]> {
    return this.http.post<Evaluacion[]>(this.baseEndPoint + "-lista", evaluaciones, { headers: this.cabeceras });
  }

  public ver(id: number): Observable<Evaluacion> {
    return this.http.get<Evaluacion>(this.baseEndPoint + "/" + id);
  }

  public verPeriodo(evaluacion_id: number, periodo_id: number): Observable<Evaluacion> {
    let params = new HttpParams()
      .set('evaluacion', evaluacion_id + "")
      .set('periodo', periodo_id + "")
    return this.http.get<Evaluacion>(this.baseEndPoint + "/periodo/", { params: params });
  }



  public editar(evaluacion: Evaluacion): Observable<Evaluacion> {
    return this.http.put<Evaluacion>(this.baseEndPoint + "/" + evaluacion.id, evaluacion, { headers: this.cabeceras });
  }


  public exportarAll(resultadosDocentes: ContenedorResultadosEvaluacion) {
    return this.http.post<any>(this.baseEndPoint + "/export-all", resultadosDocentes, { headers: this.cabeceras, responseType: 'blob' as 'json' });
  }


}
