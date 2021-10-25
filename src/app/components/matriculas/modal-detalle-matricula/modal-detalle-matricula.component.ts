import { Component, OnInit } from '@angular/core';
import { Matricula } from 'src/app/models/matricula';
import { Estudiante } from 'src/app/models/estudiante';
import { Paralelo } from 'src/app/models/paralelo';
import { Periodo } from 'src/app/models/periodo';

@Component({
  selector: 'app-modal-detalle-matricula',
  templateUrl: './modal-detalle-matricula.component.html',
  styleUrls: ['./modal-detalle-matricula.component.css']
})
export class ModalDetalleMatriculaComponent implements OnInit {

  matriculaDetalle: Matricula;

  constructor() {
    this.matriculaDetalle = new Matricula();
    this.matriculaDetalle.estudiante = new Estudiante();
    this.matriculaDetalle.matriculas_asignaturas = [];
    this.matriculaDetalle.paralelo = new Paralelo();
    this.matriculaDetalle.periodo_lectivo = new Periodo();
  }

  ngOnInit() {

  }


  recibirPadreHijo(m: Matricula): void {
    console.log(m);
    this.matriculaDetalle = m;
  }

}
