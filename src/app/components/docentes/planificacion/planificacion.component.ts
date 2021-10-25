import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CargaHoraria } from 'src/app/models/carga-horaria';
import { ActivatedRoute } from '@angular/router';
import { CargaHorariaService } from 'src/app/services/carga-horaria.service';
import { Distributivo } from 'src/app/models/distributivo';
import { Asignatura } from 'src/app/models/asignatura';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { PlanificacionAcademica } from 'src/app/models/planificacion-academica';
import { Ciclo } from 'src/app/models/ciclo';
import { Carrera } from 'src/app/models/carrera';
import { Paralelo } from 'src/app/models/paralelo';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariable } from 'src/app/Globals/variables';




@Component({
  selector: 'app-planificacion',
  templateUrl: './planificacion.component.html',
  styleUrls: ['./planificacion.component.css']
})
export class PlanificacionComponent implements OnInit {


  cargaHoraria: CargaHoraria;
  public archivoSeleccionado: File;

  public archivoSeleccionadoGuia: File;
  public archivoSeleccionadoSilabo: File;

  rutaArchivos: string;

  progreso: number = 0;
  progreso2: number = 0;
  tipoArchivo: string = "";


  @ViewChild('inputGuia')
  inputGuia: ElementRef;

  @ViewChild('inputSilabo')
  inputSilabo: ElementRef;

  constructor(private spinnerService: NgxSpinnerService, private service: CargaHorariaService, private activatedRoute: ActivatedRoute) {
    this.cargaHoraria = new CargaHoraria();
    this.cargaHoraria.distributivo = new Distributivo();
    this.cargaHoraria.asignatura = new Asignatura();
    this.cargaHoraria.paralelo = new Paralelo();
    this.cargaHoraria.asignatura.ciclo = new Ciclo();
    this.cargaHoraria.asignatura.ciclo.carrera = new Carrera();
    this.cargaHoraria.planificacion = new PlanificacionAcademica();
    this.rutaArchivos = GlobalVariable.URL_DOCS_PLANIFICACION;
  }

  ngOnInit() {
    this.spinnerService.show();

    this.activatedRoute.paramMap.subscribe(params => {
      const id: number = +params.get("id");
      if (id) {
        this.service.ver(id).subscribe(ch => {
          this.cargaHoraria = ch;
          if (this.cargaHoraria.planificacion == null) {
            this.cargaHoraria.planificacion = new PlanificacionAcademica();
          }
        })
      }
      this.spinnerService.hide();
    });



  }


  seleccionarArchivoGuia(event, tipoArchivo: string) {
    this.tipoArchivo = tipoArchivo;
    this.archivoSeleccionadoGuia = event.target.files[0];
    this.progreso = 0;
    this.archivoSeleccionadoGuia.name;
    let fileSize = event.target.files[0].size / 1024;
    if (this.archivoSeleccionadoGuia.type.indexOf('pdf') > 0) {
      if (fileSize < 10000) {
        this.archivoSeleccionadoGuia.name;

      } else {
        Swal.fire('Error tamaño archivo: ', 'El tamaño máximo permitido es de 10 MB', 'error');
        this.archivoSeleccionadoGuia = null;
      }

    } else {
      Swal.fire('Error Tipo Archivo: ', 'Solo se aceptan documentos extension .pdf', 'error');
      this.archivoSeleccionadoGuia = null;
    }

  }

  seleccionarArchivoSilabo(event, tipoArchivo: string) {
    this.tipoArchivo = tipoArchivo;
    this.archivoSeleccionadoSilabo = event.target.files[0];
    this.progreso = 0;
    this.archivoSeleccionadoSilabo.name;
    let fileSize = event.target.files[0].size / 1024;
    
      if (fileSize < 10000) {
        this.archivoSeleccionadoSilabo.name;

      } else {
        Swal.fire('Error tamaño archivo: ', 'El tamaño máximo permitido es de 10 MB', 'error');
        this.archivoSeleccionadoSilabo = null;
      }

  }

  subirGuia() {


    if (this.archivoSeleccionadoGuia != null) {
      this.archivoSeleccionado = this.archivoSeleccionadoGuia;
    } else if (this.archivoSeleccionadoSilabo != null) {
      this.archivoSeleccionado = this.archivoSeleccionadoSilabo;
    }

    if (!this.archivoSeleccionado) {
      Swal.fire('Error Upload: ', 'Debe seleccionar un archivo', 'error');
    } else {
      this.service.subirFoto(this.archivoSeleccionado, this.cargaHoraria.id, this.tipoArchivo)
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total) * 100);
          } else if (event.type === HttpEventType.Response) {
            let response: any = event.body;
            this.cargaHoraria = new CargaHoraria();
            this.cargaHoraria = response.cargaHoraria as CargaHoraria;
            Swal.fire('El archivo se ha subido completamente!', response.mensaje, 'success');
            this.progreso = 0;
            this.archivoSeleccionadoGuia = null;
            this.archivoSeleccionadoSilabo = null;
            this.archivoSeleccionado = null
            this.inputGuia.nativeElement.value = "";
          }
        });

    }


  }

  subirSilabo() {


    if (this.archivoSeleccionadoGuia != null) {
      this.archivoSeleccionado = this.archivoSeleccionadoGuia;
    } else if (this.archivoSeleccionadoSilabo != null) {
      this.archivoSeleccionado = this.archivoSeleccionadoSilabo;
    }

    if (!this.archivoSeleccionado) {
      Swal.fire('Error Upload: ', 'Debe seleccionar un archivo', 'error');
    } else {
      this.service.subirFoto(this.archivoSeleccionado, this.cargaHoraria.id, this.tipoArchivo)
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso2 = Math.round((event.loaded / event.total) * 100);
          } else if (event.type === HttpEventType.Response) {
            let response: any = event.body;
            this.cargaHoraria = new CargaHoraria();
            this.cargaHoraria = response.cargaHoraria as CargaHoraria;
            Swal.fire('El archivo se ha subido completamente!', response.mensaje, 'success');
            this.progreso2 = 0;
            this.archivoSeleccionadoGuia = null;
            this.archivoSeleccionadoSilabo = null;
            this.archivoSeleccionado = null
            this.inputSilabo.nativeElement.value = "";
          }
        });

    }

  }


}
