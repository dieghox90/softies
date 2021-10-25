import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpEvent, HttpRequest, HttpParams } from '@angular/common/http';
import { CargaHoraria } from '../models/carga-horaria';
import { Observable } from 'rxjs';
import { GlobalVariable } from '../Globals/variables';

@Injectable({
  providedIn: 'root'
})
export class CargaHorariaService {

  public baseEndPoint = GlobalVariable.API_ENDPOINT + "cargas-horarias";

  private cabeceras: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  constructor(private http: HttpClient) { }

  public listar(): Observable<CargaHoraria[]> {
    return this.http.get<CargaHoraria[]>(this.baseEndPoint);
  }

  public crear(cargaHoraria: CargaHoraria): Observable<CargaHoraria> {
    return this.http.post<CargaHoraria>(this.baseEndPoint, cargaHoraria, { headers: this.cabeceras });
  }

  public ver(id: number): Observable<CargaHoraria> {
    return this.http.get<CargaHoraria>(this.baseEndPoint + "/" + id);
  }

  public verCargaHorariaMatricula(periodo_id: number, paralelo_id: number, asginatura_id: number): Observable<CargaHoraria> {
    let params = new HttpParams()
      .set('periodo', periodo_id + "")
      .set('paralelo', paralelo_id + "")
      .set('asignatura', asginatura_id + "")
    return this.http.get<CargaHoraria>(this.baseEndPoint + "/matricula/", { params: params });

  }


  public editar(cargaHoraria: CargaHoraria): Observable<CargaHoraria> {
    return this.http.put<CargaHoraria>(this.baseEndPoint + "/" + cargaHoraria.id, cargaHoraria, { headers: this.cabeceras });
  }


  // buscar carga horaria por id del perioro e id del paralelo
  public listarCargaPeriodoParalelo(periodo_id: number, paralelo_id: number): Observable<CargaHoraria[]> {
    let params = new HttpParams()
      .set('periodo', periodo_id + "")
      .set('paralelo', paralelo_id + "")
    return this.http.get<CargaHoraria[]>(this.baseEndPoint + "/periodo-paralelo/", { params: params });

  }


  // buscar carga horaria por id del perioro e id del docente
  public listarCargaPeriodoDocente(periodo_id: number, docente_id: number): Observable<CargaHoraria[]> {
    alert("periodo " + periodo_id + "   " + " paralelo :" + docente_id);
    let params = new HttpParams()
      .set('periodo', periodo_id + "")
      .set('docente', docente_id + "")
    return this.http.get<CargaHoraria[]>(this.baseEndPoint + "/periodo-docente/", { params: params });

  }

  subirFoto(archivo: File, id, documento: string): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);
    formData.append("documento", documento);

    console.log(formData);
    console.log(archivo)
    const req = new HttpRequest('POST', `${this.baseEndPoint}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req);
  }
}
