import { Injectable } from '@angular/core';
import { GlobalVariable } from '../Globals/variables';
import { HttpClient } from '@angular/common/http';
import { ConfiguracionPlanes } from '../models/configuracion-planes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionPlanesService {

  public baseEndPoint = GlobalVariable.API_ENDPOINT + "configuraciones-planes";
  constructor(private http: HttpClient) { }


  public listar(periodo_id): Observable<ConfiguracionPlanes[]> {
    return this.http.get<ConfiguracionPlanes[]>(this.baseEndPoint + "/" + periodo_id);
  }

  public crear(configuracion: ConfiguracionPlanes): Observable<ConfiguracionPlanes> {
    return this.http.post<ConfiguracionPlanes>(this.baseEndPoint, configuracion);
  }

  public editar(configuracion: ConfiguracionPlanes): Observable<ConfiguracionPlanes> {
    return this.http.put<ConfiguracionPlanes>(this.baseEndPoint, configuracion);
  }

  public eliminar(id: number): Observable<ConfiguracionPlanes> {
    return this.http.delete<ConfiguracionPlanes>(this.baseEndPoint + "/" + id);
  }

}
