import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Matricula } from '../models/matricula';
import { Observable } from 'rxjs';

import { GlobalVariable } from '../Globals/variables';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {


  public baseEndPoint = GlobalVariable.API_ENDPOINT + "matriculas";



  private cabeceras: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  constructor(private http: HttpClient) { }

  public listar(): Observable<Matricula[]> {
    return this.http.get<Matricula[]>(this.baseEndPoint);
  }


  public totalMatriculados(id: number): Observable<number> {
    return this.http.get<number>(this.baseEndPoint + "/total/" + id);
  }

  /*
  public crear(matricula: Matricula): Observable<Matricula> {
    return this.http.post<Matricula>(this.baseEndPoint, matricula, { headers: this.cabeceras });
  }
*/

  public crear(matricula: Matricula): Observable<Matricula> {
    return this.http.post<Matricula>(this.baseEndPoint, matricula);
  }

  public ver(id: number): Observable<Matricula> {
    return this.http.get<Matricula>(this.baseEndPoint + "/" + id);
  }
  /*
    public verMatriculaAsignatura(id: number): Observable<MatriculaAsignatura[]> {
      return this.http.get<MatriculaAsignatura[]>(this.baseEndPoint + "/matricula-asignatura/" + id);
    }
  */

  /*
   public editar(matricula: Matricula): Observable<Matricula> {
     return this.http.put<Matricula>(this.baseEndPoint + "/" + matricula.id, matricula, { headers: this.cabeceras });
   }
   */

  public editar(matricula: Matricula): Observable<Matricula> {
    return this.http.put<Matricula>(this.baseEndPoint + "/" + matricula.id, matricula);
  }

  public listarMatriculaByParalelo(periodo_id: number, paralelo_id: number): Observable<Matricula[]> {
    let params = new HttpParams()
      .set('periodo', periodo_id + "")
      .set('paralelo', paralelo_id + "")
    return this.http.get<Matricula[]>(this.baseEndPoint + "/paralelo/", { params: params });
  }


  public listarMatriculaByPeriodoOrParaleloOrCiclo(periodo_id: number, ciclo_id: number, paralelo_id: number): Observable<Matricula[]> {
    let params = new HttpParams()
      .set('periodo', periodo_id + "")
      .set('ciclo', ciclo_id + "")
      .set('paralelo', paralelo_id + "")
    return this.http.get<Matricula[]>(this.baseEndPoint + "/ciclo/", { params: params });

  }

  public listarMatriculaByPeriodoAndCicloAndEstudiante(periodo_id: number, ciclo_id: number, estudiante_id: number): Observable<Matricula[]> {
    let params = new HttpParams()
      .set('periodo', periodo_id + "")
      .set('ciclo', ciclo_id + "")
      .set('estudiante', estudiante_id + "")
    return this.http.get<Matricula[]>(this.baseEndPoint + "/ciclo-estudiante", { params: params });

  }


  public listarMatriculaByPeriodoAndPareleloAndEstudiante(periodo_id: number, paralelo_id: number, estudiante_id: number): Observable<Matricula[]> {
    let params = new HttpParams()
      .set('periodo', periodo_id + "")
      .set('paralelo', paralelo_id + "")
      .set('estudiante', estudiante_id + "")
    return this.http.get<Matricula[]>(this.baseEndPoint + "/paralelo", { params: params });

  }






  public listarMatriculaEvaluacion(estudiante_id, periodo_id: number): Observable<Matricula[]> {
    let params = new HttpParams()
      .set('estudiante', estudiante_id + "")
      .set('periodo', periodo_id + "")
    return this.http.get<Matricula[]>(this.baseEndPoint + "/evaluacion/", { params: params });

  }


  public exportar(periodo_id: number, ciclo_id: number, paralelo_id: number, detalle: string): Observable<any> {
    let params = new HttpParams()
      .set('periodo', periodo_id + "")
      .set('ciclo', ciclo_id + "")
      .set('paralelo', paralelo_id + "")
      .set('detalle', detalle + "")
    return this.http.get<any>(this.baseEndPoint + "/export", { params: params, responseType: 'blob' as 'json' });
  }

}
