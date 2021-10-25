import { Component, OnInit } from '@angular/core';
import { Clasificacion } from 'src/app/models/clasificacion';
import { ClasificacionService } from 'src/app/services/clasificacion.service';
import { Evaluacion } from 'src/app/models/evaluacion';
import { EvaluacionService } from 'src/app/services/evaluacion.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { PeriodoService } from 'src/app/services/periodo.service';
import { Periodo } from 'src/app/models/periodo';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { LocalService } from 'src/app/services/local.service';




@Component({
  selector: 'app-form-evaluacion',
  templateUrl: './form-evaluacion.component.html',
  styleUrls: ['./form-evaluacion.component.css']
})
export class FormEvaluacionComponent implements OnInit {



  clasificacion: Clasificacion;
  clasificaciones: Clasificacion[];
  evaluacion: Evaluacion;
  periodo: Periodo;
  periodos: Periodo[];
  fecha: Date;

  // Date time picker
  public minDate: Date = new Date ("05/07/2017 2:00 AM");
 
  public maxDate: Date = new Date ("05/27/2025 11:00 AM");

  

  constructor(private localService: LocalService, private datepipe: DatePipe, private spinnerService: NgxSpinnerService, private activatedRoute: ActivatedRoute, private servicePeriodo: PeriodoService, private router: Router, private service: EvaluacionService, private serviceClasificaion: ClasificacionService) {
    this.clasificacion = new Clasificacion();
    this.clasificaciones = [];
    this.evaluacion = new Evaluacion();
    this.periodo = new Periodo();
    this.periodos = [];
    this.fecha = new Date();

  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id: number = +params.get("id");
      if (id) {
        this.service.ver(id).subscribe(e => {

          this.evaluacion = e;
          this.fecha = new Date(e.fecha_fin);
          this.periodo = e.periodo;
          this.clasificacion = e.clasificacion;
        });
      } else {
        //Fijar Periodo
        if (this.localService.getJsonValue('idP') != null) {
          this.servicePeriodo.ver(this.localService.getJsonValue('idP')).subscribe(p => {
            this.periodo = p;
          });
        }
      }
    });
    this.serviceClasificaion.listar().subscribe(clas => {
      this.clasificaciones = clas;
    });






  }


  public crear(): void {
    this.spinnerService.show();
    this.evaluacion.periodo = this.periodo;
    this.evaluacion.fecha_fin = this.datepipe.transform(this.fecha, 'yyyy-MM-dd HH:mm:ss');
    this.service.crear(this.evaluacion).subscribe(
      est => {
        Swal.fire(
          "Nuevo Registro ",
          "Evalaución " + this.evaluacion.etiqueta + " <strong>Creada</strong> con éxito",
          "success"
        );
        this.evaluacion = new Evaluacion();

      });
    this.spinnerService.hide();
  }

  public editar(): void {
    this.spinnerService.show();
    this.evaluacion.fecha_fin = this.datepipe.transform(this.fecha, 'yyyy-MM-dd HH:mm:ss');

    this.service.editar(this.evaluacion).subscribe(est => {
      Swal.fire(
        "Edición ",
        "Evaluación " + this.evaluacion.etiqueta + " <strong>Actualizada</strong> con éxito",
        "success"
      );
      this.router.navigate(["/evaluaciones"]);
    });
    this.spinnerService.hide();
  }



  compararPeriodo(p1: Periodo, p2: Periodo): boolean {
    if (p1 === undefined && p2 === undefined) {
      return true;
    }
    return p1 === null || p2 === null || p1 === undefined || p2 === undefined ? false : p1.id === p2.id;
  }


  compararClasificacion(c1: Clasificacion, c2: Clasificacion): boolean {
    if (c1 === undefined && c2 === undefined) {
      return true;
    }
    return c1 === null || c2 === null || c1 === undefined || c2 === undefined ? false : c1.id === c2.id;
  }

}
