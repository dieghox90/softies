import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { PlanificacionAcademica } from '../models/planificacion-academica';
import { Observable } from 'rxjs';
import { GlobalVariable } from '../Globals/variables';

@Injectable({
  providedIn: 'root'
})
export class PlanificacionAcademicaService {

  public baseEndPoint = GlobalVariable.API_ENDPOINT + "planificaciones-academicas";

  private cabeceras: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  constructor(private http: HttpClient) { }

  public listar(): Observable<PlanificacionAcademica[]> {
    return this.http.get<PlanificacionAcademica[]>(this.baseEndPoint);
  }

  public listarFiltrado(periodo:number, ciclo:number): Observable<PlanificacionAcademica[]> {
    let params = new HttpParams()
    .set('periodo', periodo + "")
    .set('ciclo', ciclo + "")
  return this.http.get<PlanificacionAcademica[]>(this.baseEndPoint + "-repositorio/", { params: params });
    
  }


  public crear(planificacion: PlanificacionAcademica): Observable<PlanificacionAcademica> {
    return this.http.post<PlanificacionAcademica>(this.baseEndPoint, planificacion);
  }

  public ver(id: number): Observable<PlanificacionAcademica> {
    return this.http.get<PlanificacionAcademica>(this.baseEndPoint + "/" + id);
  }


  public editar(planificacion: PlanificacionAcademica): Observable<PlanificacionAcademica> {
    return this.http.put<PlanificacionAcademica>(this.baseEndPoint + "/" + planificacion.id, planificacion);
  }
}
