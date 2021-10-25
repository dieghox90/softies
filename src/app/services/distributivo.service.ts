import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Distributivo } from '../models/distributivo';
import { Observable } from 'rxjs';
import { GlobalVariable } from '../Globals/variables';

@Injectable({
  providedIn: 'root'
})
export class DistributivoService {

  public baseEndPoint = GlobalVariable.API_ENDPOINT + "distributivos";

  private cabeceras: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  constructor(private http: HttpClient) { }

  public listar(): Observable<Distributivo[]> {
    return this.http.get<Distributivo[]>(this.baseEndPoint);
  }

  public crear(distributivo: Distributivo): Observable<Distributivo> {
    return this.http.post<Distributivo>(this.baseEndPoint, distributivo, { headers: this.cabeceras });
  }

  public ver(id: number): Observable<Distributivo> {
    return this.http.get<Distributivo>(this.baseEndPoint + "/" + id);
  }

  public verByPeriodo(id: number): Observable<Distributivo> {
    return this.http.get<Distributivo>(this.baseEndPoint + "/periodo/" + id);
  }



  public editar(distributivo: Distributivo): Observable<Distributivo> {
    return this.http.put<Distributivo>(this.baseEndPoint + "/" + distributivo.id, distributivo, { headers: this.cabeceras });
  }
}
