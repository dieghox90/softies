import { Component, OnInit, ViewChild } from '@angular/core';
import { PeriodoService } from 'src/app/services/periodo.service';
import { Periodo } from 'src/app/models/periodo';
import { Evaluacion } from 'src/app/models/evaluacion';
import { EvaluacionService } from 'src/app/services/evaluacion.service';
import { Evaluador } from 'src/app/models/evaluador';
import { ModalRestriccionComponent } from './modal-restriccion/modal-restriccion.component';
import { EvaluadorService } from 'src/app/services/evaluador.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-restricciones',
  templateUrl: './restricciones.component.html',
  styleUrls: ['./restricciones.component.css']
})
export class RestriccionesComponent implements OnInit {

  @ViewChild(ModalRestriccionComponent) modalComponent: ModalRestriccionComponent;
  periodo: Periodo;
  evaluacion: Evaluacion;
  evaluaciones: Evaluacion[];
  idP = this.localService.getJsonValue('idP');

  constructor(private localService: LocalService, private spinnerService: NgxSpinnerService, private service: EvaluadorService, private servicePeriodo: PeriodoService, private serviceEvaluaciones: EvaluacionService) { }

  ngOnInit() {
    if (this.idP != null) {
      this.servicePeriodo.ver(this.idP).subscribe(p => {
        this.periodo = p;
        this.serviceEvaluaciones.listar(this.periodo.id).subscribe(li => {
          this.evaluaciones = li;
        });
      });
    }
  }


  public eliminar(e: Evaluador): void {
    this.spinnerService.show();
    Swal.fire({
      title: 'Eliminación',
      html: `¿Seguro que desea eliminar la restricción de  <strong>  ${e.nombre_evaluador}?</strong>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      buttonsStyling: true,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.service.delete(e.id).subscribe(
          () => {
            this.evaluacion.evaluadores = this.evaluacion.evaluadores.filter(s => s.id !== e.id)
            Swal.fire(
              'Eliminación!',
              `Restricción eliminada con éxito.`,
              'success'
            )
          }
        )

      }
    });
    this.spinnerService.hide();
  }

  public recibirEvaluacionHijo(e: Evaluacion) {
    this.evaluacion = e;
  }

  public enviarHijo() {
    this.modalComponent.recibirEvaluacionPadreHijo(this.evaluacion);
  }


  public enviarEvaluadorHijo(e: Evaluador) {
    e.evaluacion = this.evaluacion;
    this.modalComponent.recibirEvaluadorPadreHijo(e);
  }

  compararEvaluacion(o1: Evaluacion, o2: Evaluacion): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }

}
