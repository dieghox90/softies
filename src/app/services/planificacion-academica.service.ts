import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
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
