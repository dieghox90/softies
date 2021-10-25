import { Injectable } from '@angular/core';
import { GlobalVariable } from '../Globals/variables';
import { HttpHeaders, HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { SolicitudMatricula } from '../models/solicitud-matricula';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudMatriculaService {

  public baseEndPoint = GlobalVariable.API_ENDPOINT + "solicitudes";

  private cabeceras: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  constructor(private http: HttpClient) { }

  public listar(): Observable<SolicitudMatricula[]> {
    return this.http.get<SolicitudMatricula[]>(this.baseEndPoint);
  }


  public listarById(id: number): Observable<SolicitudMatricula[]> {
    return this.http.get<SolicitudMatricula[]>(this.baseEndPoint + "-estudiante" + "/" + id);
  }


  public listarByCicloId(id: number): Observable<SolicitudMatricula[]> {
    return this.http.get<SolicitudMatricula[]>(this.baseEndPoint + "-ciclo" + "/" + id);
  }


  public crear(solicitud: SolicitudMatricula): Observable<SolicitudMatricula> {
    return this.http.post<SolicitudMatricula>(this.baseEndPoint, solicitud, { headers: this.cabeceras });
  }

  public ver(id: number): Observable<SolicitudMatricula> {
    return this.http.get<SolicitudMatricula>(this.baseEndPoint + "/" + id);
  }


  public editar(solicitud: SolicitudMatricula): Observable<SolicitudMatricula> {
    return this.http.put<SolicitudMatricula>(this.baseEndPoint + "/" + solicitud.id, solicitud, { headers: this.cabeceras });
  }

  subirArchivo(archivo: File, id: number, tipo: string): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id + "");
    formData.append("tipo", tipo);

    const req = new HttpRequest('POST', `${this.baseEndPoint}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req);
  }


  public eliminar(id: number): Observable<SolicitudMatricula> {
    return this.http.delete<SolicitudMatricula>(this.baseEndPoint + "/" + id);
  }

}