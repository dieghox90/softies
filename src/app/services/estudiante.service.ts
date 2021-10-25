import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Estudiante } from "../models/estudiante";
import { GlobalVariable } from '../Globals/variables';

@Injectable({
  providedIn: "root"
})
export class EstudianteService {
  public baseEndPoint = GlobalVariable.API_ENDPOINT + "estudiantes";

  private cabeceras: HttpHeaders = new HttpHeaders({
    "Contentt-Type": "application/json"
  });

  constructor(private http: HttpClient) { }

  public listar(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(this.baseEndPoint);
  }

  public listarPaginas(page: string, size: string): Observable<any> {
    //any es un tipo generico
    const params = new HttpParams().set("page", page).set("size", size); //es inmutable
    return this.http.get<any>(this.baseEndPoint + "/pagina", {
      params: params
    });
  }


  public crear(estudiante: Estudiante): Observable<Estudiante> {
    return this.http.post<Estudiante>(this.baseEndPoint, estudiante);
  }

  public ver(id: number): Observable<Estudiante> {
    return this.http.get<Estudiante>(this.baseEndPoint + "/" + id);
  }

  public editar(estudiante: Estudiante): Observable<Estudiante> {
    return this.http.put<Estudiante>(this.baseEndPoint + "/" + estudiante.id, estudiante);
  }


  public buscarEstudiante(cedula: string): Observable<Estudiante> {
    return this.http.get<Estudiante>(this.baseEndPoint + "/busqueda/" + cedula);
  }
  /*
  public editar(estudiante: Estudiante): Observable<Estudiante> {
    return this.http.put<Estudiante>(this.baseEndPoint + "/" + estudiante.id, estudiante, { headers: this.cabeceras });
  }
*/
}
