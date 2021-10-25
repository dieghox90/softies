import { Injectable } from '@angular/core';
import { EvaluacionService } from './evaluacion.service';
import { Evaluacion } from '../models/evaluacion';
import { Clasificacion } from '../models/clasificacion';

@Injectable({
  providedIn: 'root'
})
export class DatosEvaluacionService {

  evaluacion: Evaluacion;

  constructor() {
    this.evaluacion = new Evaluacion();
    this.evaluacion.clasificacion = new Clasificacion();
  }

  public fijarValores(e: Evaluacion): void {
    this.evaluacion = new Evaluacion();
    this.evaluacion.clasificacion = new Clasificacion();
    this.evaluacion.id_evaluado = e.id_evaluado;
    this.evaluacion.id_evaluador = e.id_evaluador;
    this.evaluacion.id = e.id;
    this.evaluacion.asignatura = e.asignatura;
    this.evaluacion.nombre_evaluado = e.nombre_evaluado;
    this.evaluacion.clasificacion.nombre = e.clasificacion.nombre;
    this.evaluacion.id_asignatura = e.id_asignatura;
    this.evaluacion.id_paralelo = e.id_paralelo;
    this.evaluacion.paralelo = e.paralelo;
    this.evaluacion.id_paralelo = e.id_paralelo;

  }
}
