import { Component, OnInit } from '@angular/core';
import { CargaHorariaService } from 'src/app/services/carga-horaria.service';
import { PlanSemanalService } from 'src/app/services/plan-semanal.service';
import { ActivatedRoute } from '@angular/router';
import { CargaHoraria } from 'src/app/models/carga-horaria';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { PlanSemanal } from 'src/app/models/plan-semanal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfiguracionPlanesService } from 'src/app/services/configuracion-planes.service';
import { LocalService } from 'src/app/services/local.service';
import { PlanificacionAcademica } from 'src/app/models/planificacion-academica';

@Component({
  selector: 'app-planes-semanales',
  templateUrl: './planes-semanales.component.html',
  styleUrls: ['./planes-semanales.component.css']
})
export class PlanesSemanalesComponent implements OnInit {

  cargaHoraria: CargaHoraria;
  public archivoSeleccionado: File;
  progreso: number = 0;
  tipoArchivo: string = "";
  planSemanal: PlanSemanal;
  idP: number;

  constructor(private spinnerService: NgxSpinnerService, private service: PlanSemanalService,
    private serviceCargaHoraria: CargaHorariaService,
    private activatedRoute: ActivatedRoute,
    private serviceConfiguracionPlanes: ConfiguracionPlanesService,
    private localService: LocalService,
    private servicePlanSemanal: PlanSemanalService) {
    this.idP = this.localService.getJsonValue('idP');
    this.planSemanal = new PlanSemanal();

  }

  ngOnInit() {
    this.spinnerService.show();
    this.activatedRoute.paramMap.subscribe(params => {
      const id: number = +params.get("id");
      if (id) {
        this.serviceCargaHoraria.ver(id).subscribe(ch => {
          this.cargaHoraria = ch;
          this.serviceConfiguracionPlanes.listar(this.idP).subscribe(config => {

            config.forEach(c => {
              this.cargaHoraria.planificacion.planes_semanales.forEach(planes => {
                if (planes.numero_semana == c.numero_semana) {
                  planes.fecha_inicio = c.fecha_inicio;
                  planes.fecha_fin = c.fecha_fin;
                }
              });
            });

          });

          this.spinnerService.hide();

        }, err => {
          this.spinnerService.hide();
        });
      }
    }, err => {
      this.spinnerService.hide();
    });
  }




  seleccionarArchivo(event, tipoArchivo: string, plan: PlanSemanal) {
    this.tipoArchivo = tipoArchivo;
    this.planSemanal = plan;
    this.archivoSeleccionado = event.target.files[0];
    this.progreso = 0;
    this.archivoSeleccionado.name;
    let fileSize = event.target.files[0].size / 1024;
    if (this.archivoSeleccionado.type.indexOf('pdf') > 0) {
      if (fileSize < 10000) {
        this.archivoSeleccionado.name;

      } else {
        Swal.fire('Error tamaño archivo: ', 'El tamaño máximo permitido es de 2 MB', 'error');
        this.archivoSeleccionado = null;
      }

    } else {
      Swal.fire('Error Tipo Archivo: ', 'Solo se aceptan documentos extension .pdf', 'error');
      this.archivoSeleccionado = null;
    }

  }

  subirArchivo() {
    this.spinnerService.show();
    if (!this.archivoSeleccionado) {
      Swal.fire('Error Upload: ', 'Debe seleccionar un archivo', 'error');
    } else {
      this.service.subirFoto(this.archivoSeleccionado, this.planSemanal.id, this.tipoArchivo)
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total) * 100);
          } else if (event.type === HttpEventType.Response) {
            let response: any = event.body;

            this.planSemanal = response.planSemanal as PlanSemanal;
            this.cargaHoraria.planificacion.planes_semanales.forEach(ps => {
              if (ps.id == this.planSemanal.id) {
                ps.plan = this.planSemanal.plan;
                ps.ruta = this.planSemanal.ruta;
                ps.plan = this.planSemanal.plan
              }
            });
            this.archivoSeleccionado = null;
            this.planSemanal = new PlanSemanal();

            Swal.fire('El archivo se ha subido completamente!', response.mensaje, 'success');

            this.progreso = 0;
          }
          this.spinnerService.hide();
        });

    }

  }



  incrementarSemana() {
    Swal.fire({
      title: "Confirmación",
      html: " ¿Está seguro de incrementar una semana mas?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí"
    }).then(result => {
      if (result.value) {
        this.spinnerService.show();
        this.planSemanal.planificacion = new PlanificacionAcademica();
        this.planSemanal.numero_semana = this.cargaHoraria.planificacion.planes_semanales.length + 1;
        this.planSemanal.planificacion.id = this.cargaHoraria.planificacion.id;
        this.planSemanal.creado_manual = true;
        this.servicePlanSemanal.crear(this.planSemanal).subscribe(p => {
          this.cargaHoraria.planificacion.planes_semanales.push(p);
          this.spinnerService.hide();
          console.log("guardado " + p.creado_manual);
          Swal.fire('Éxito: ', `Se ha incrementado la semana <strong>${this.planSemanal.numero_semana} <strong>`, 'success');
        });

      }

    });
  }


  eliminar(plan: PlanSemanal) {
    Swal.fire({
      title: "Confirmación Eliminación",
      html: "Está seguro de eliminar la configuración de la semana " + plan.numero_semana,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí"
    }).then(result => {
      if (result.value) {
        this.service.eliminar(plan.id).subscribe(() => {
          this.cargaHoraria.planificacion.planes_semanales = this.cargaHoraria.planificacion.planes_semanales.filter(c => c.id !== plan.id);
          Swal.fire('Éxito: ', 'Se ha eliminado correctamente', 'success');
        });
      }
    });
  }


}
