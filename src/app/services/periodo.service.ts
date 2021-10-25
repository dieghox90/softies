import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Periodo } from '../models/periodo';
import { Observable } from 'rxjs';
import { GlobalVariable } from '../Globals/variables';

@Injectable({
  providedIn: 'root'
})
export class PeriodoService {

  public baseEndPoint = GlobalVariable.API_ENDPOINT + "periodos";


  private cabeceras: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  constructor(private http: HttpClient) { }

  public listar(): Observable<Periodo[]> {
    return this.http.get<Periodo[]>(this.baseEndPoint);
  }

  public listarShort(): Observable<Periodo[]> {
    return this.http.get<Periodo[]>(this.baseEndPoint + "-findAllShort");
  }

  public crear(periodo: Periodo): Observable<Periodo> {
    return this.http.post<Periodo>(this.baseEndPoint, periodo, { headers: this.cabeceras });
  }

  public ver(id: number): Observable<Periodo> {
    return this.http.get<Periodo>(this.baseEndPoint + "/" + id);
  }


  public editar(periodo: Periodo): Observable<Periodo> {
    return this.http.put<Periodo>(this.baseEndPoint + "/" + periodo.id, periodo, { headers: this.cabeceras });
  }
}
