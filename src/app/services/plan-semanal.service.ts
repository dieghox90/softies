import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlanSemanal } from '../models/plan-semanal';
import { GlobalVariable } from '../Globals/variables';

@Injectable({
  providedIn: 'root'
})
export class PlanSemanalService {

  public baseEndPoint = GlobalVariable.API_ENDPOINT + "planes-semanales";

  private cabeceras: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  constructor(private http: HttpClient) { }

  public listar(): Observable<PlanSemanal[]> {
    return this.http.get<PlanSemanal[]>(this.baseEndPoint);
  }

  public crear(plan: PlanSemanal): Observable<PlanSemanal> {
    console.log("Enviando " + plan)
    return this.http.post<PlanSemanal>(this.baseEndPoint, plan, { headers: this.cabeceras });
  }

  public ver(id: number): Observable<PlanSemanal> {

    return this.http.get<PlanSemanal>(this.baseEndPoint + "/" + id);
  }


  public editar(plan: PlanSemanal): Observable<PlanSemanal> {
    return this.http.put<PlanSemanal>(this.baseEndPoint + "/" + plan.id, plan, { headers: this.cabeceras });
  }


  public eliminar(id: number): Observable<PlanSemanal> {
    return this.http.delete<PlanSemanal>(this.baseEndPoint + "/" + id);
  }

  subirFoto(archivo: File, id, documento: string): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);
    formData.append("documento", documento);

    const req = new HttpRequest('POST', `${this.baseEndPoint}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req);
  }
}
