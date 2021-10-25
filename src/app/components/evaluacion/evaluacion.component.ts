import { Component, OnInit, ViewChild } from '@angular/core';
import { Evaluacion } from 'src/app/models/evaluacion';
import { EvaluacionService } from 'src/app/services/evaluacion.service';
import { Periodo } from 'src/app/models/periodo';
import { PeriodoService } from 'src/app/services/periodo.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalService } from 'src/app/services/local.service';
import { ModalCopiarEvaluacionComponent } from './modal-copiar-evaluacion/modal-copiar-evaluacion.component';

@Component({
  selector: 'app-evaluacion',
  templateUrl: './evaluacion.component.html',
  styleUrls: ['./evaluacion.component.css']
})
export class EvaluacionComponent implements OnInit {

  @ViewChild(ModalCopiarEvaluacionComponent) modalComponent: ModalCopiarEvaluacionComponent;

  evaluacion: Evaluacion;
  evaluaciones: Evaluacion[];
  periodos: Periodo[];
  periodo: Periodo;
  idP = this.localService.getJsonValue('idP');
  constructor(private localService: LocalService, private spinnerService: NgxSpinnerService, private servicePeriodo: PeriodoService, private service: EvaluacionService) {
    this.evaluacion = new Evaluacion();
    this.evaluaciones = [];
    this.periodos = [];
    this.periodo = new Periodo();
    this.evaluacion.preguntas = [];
  }

  ngOnInit() {
    this.spinnerService.show();
    this.servicePeriodo.listar().subscribe(p => {
      this.periodos = p;
    });


    this.buscar(this.idP);

    setTimeout(() => {
      this.spinnerService.hide();
    }, 800);

  }

  public buscar(id: number): void {
    this.spinnerService.show();
    this.service.listar(id).subscribe(e => {
      this.evaluaciones = e;
    });
    this.spinnerService.hide();
  }


  public recibirClasificacionesHijo(e: Evaluacion[]) {
    this.evaluaciones = e;
  }


}
