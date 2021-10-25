import { Component, OnInit } from '@angular/core';
import { PeriodoService } from 'src/app/services/periodo.service';
import { Periodo } from 'src/app/models/periodo';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-form-periodo',
  templateUrl: './form-periodo.component.html',
  styleUrls: ['./form-periodo.component.css']
})
export class FormPeriodoComponent implements OnInit {

  periodo: Periodo;
  fechaInicio: Date;
  fechaFin: Date;
  estado: boolean;

  constructor(private datepipe: DatePipe, private spinnerService: NgxSpinnerService, private service: PeriodoService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.periodo = new Periodo();
    this.fechaInicio = new Date();
    this.fechaFin = new Date();
    this.estado = false;
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id: number = +params.get("id");
      if (id) {
        this.service.ver(id).subscribe(per => {
          this.periodo = per;
          //this.estado = this.periodo.estado;
          this.fechaInicio = new Date(this.periodo.fecha_inicio);
          this.fechaFin = new Date(this.periodo.fecha_fin);
        });
      }
    });
  }


  public crear(): void {
    this.spinnerService.show();
    this.periodo.fecha_inicio = this.datepipe.transform(this.fechaInicio, 'yyyy-MM-dd HH:mm:ss');
    this.periodo.fecha_fin = this.datepipe.transform(this.fechaFin, 'yyyy-MM-dd HH:mm:ss');
    this.service.crear(this.periodo).subscribe(
      per => {
        Swal.fire(
          "Nuevo Registro ",
          "Periodo " + per.periodo_academico + " <strong>Creado</strong> con exito",
          "success"
        );
        this.periodo = new Periodo();
        this.fechaInicio = new Date();
        this.fechaFin = new Date();

      });
    this.spinnerService.hide();
  }

  public editar(): void {
    this.spinnerService.show();
    this.periodo.fecha_inicio = this.datepipe.transform(this.fechaInicio, 'yyyy-MM-dd HH:mm:ss');
    this.periodo.fecha_fin = this.datepipe.transform(this.fechaFin, 'yyyy-MM-dd HH:mm:ss');
    console.log(this.estado);
    this.service.editar(this.periodo).subscribe(per => {
      Swal.fire(
        "Edicion",
        "Periodo " + per.periodo_academico + " <strong>Acualizado</strong> con exito",
        "success"
      );
      this.router.navigate(["/periodos"]);
      this.spinnerService.hide();
    });
    
  }

  eventChange($event) { 
    console.log($event);
  }
}
