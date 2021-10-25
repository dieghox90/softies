import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalService } from 'src/app/services/local.service';
import { SolicitudMatriculaService } from 'src/app/services/solicitud-matricula.service';
import { SolicitudMatricula } from 'src/app/models/solicitud-matricula';
import { CarreraService } from 'src/app/services/carrera.service';
import { Carrera } from 'src/app/models/carrera';
import { Ciclo } from 'src/app/models/ciclo';
import { ModalCorreccionComponent } from './modal-correccion/modal-correccion.component';
import { Location } from "@angular/common";
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {

  @ViewChild(ModalCorreccionComponent, { static: true }) modalComponent: ModalCorreccionComponent;

  idP: number;
  solicitudes: SolicitudMatricula[];
  carreras: Carrera[];
  carrera: Carrera;
  ciclo: Ciclo;
  carreraError: boolean = false;
  cicloError: boolean = false;
  busqueda: string = "";
  totalSolicitudes: number = 0;
  totalRevision: number = 0;
  totalCorregir: number = 0;
  totalCorregidos: number = 0;
  totalAprobados: number = 0;
  totalMatriculados: number = 0;

  constructor(private spinnerService: NgxSpinnerService, private router: Router, public authService: AuthService, private location: Location, private serviceCarrera: CarreraService, private localService: LocalService, private solicitudService: SolicitudMatriculaService) {
    this.idP = this.localService.getJsonValue('idP');
    this.carrera = new Carrera();
    this.ciclo = new Ciclo();
    this.solicitudes = [];
  }

  ngOnInit() {
    this.serviceCarrera.listar().subscribe(c => {
      this.carreras = c;

      if (localStorage.getItem('idCarrera') != null && localStorage.getItem('idCiclo') != null) {
        this.carreras.forEach(ca => {
          if (ca.id == parseInt(localStorage.getItem('idCarrera'))) {
            this.carrera = ca;
            this.carrera.ciclos.forEach(ciclo => {
              if (ciclo.id == parseInt(localStorage.getItem('idCiclo'))) {
                this.ciclo = ciclo;
                this.buscar();

              }
            });
          }

        });
      }
      localStorage.removeItem('idCarrera');
      localStorage.removeItem('idCiclo');
    });



  }



  cambiarCarrera(e) {
    this.ciclo = new Ciclo();
    this.solicitudes = [];
  }

  buscar(): void {
    this.spinnerService.show();

    if (this.carrera.id == null || this.ciclo.id == null) {

      if (this.carrera.id == null) {
        this.carreraError = true;
      } else {
        this.carreraError = false;
      }

      if (this.ciclo.id == null) {
        this.cicloError = true;
      } else {
        this.cicloError = false;
      }
      this.spinnerService.hide();

    } else {

      this.cicloError = false;
      this.carreraError = false;
      this.solicitudService.listarByCicloId(this.ciclo.id).subscribe(s => {
        this.solicitudes = s;
        this.totalSolicitudes = 0;
        this.totalRevision = 0;
        this.totalCorregidos = 0;
        this.totalCorregir = 0;
        this.totalMatriculados = 0;

        this.totalSolicitudes = this.solicitudes.length;
        this.solicitudes.forEach(sol => {
          if (sol.tipo == "En revisión") {
            this.totalRevision++;
          } else if (sol.tipo == "Documentos Aprobados") {
            this.totalAprobados++;
          } else if (sol.tipo == "Corregir") {
            this.totalCorregir++;
          } else if (sol.tipo == "Corregido") {
            this.totalCorregidos++;
          } else if (sol.tipo == "Matriculado") {
            this.totalMatriculados++;
          }

        });
        this.spinnerService.hide();
      });
    }

  }


  public enviarHijo(s: SolicitudMatricula) {
    this.modalComponent.recibirPadreHijo(s);
  }


  public recibirSolicitudHijo(s: SolicitudMatricula) {
    this.solicitudes.forEach(so => {
      if (so.id == s.id) {
        so.observaciones = s.observaciones;
        so.fecha_modificacion = s.fecha_modificacion;
      }
    });
  }


  public fijarUrl(): void {
    if (this.location.path() != "") {
      this.localService.setJsonValue('url_anterior', this.location.path());
      localStorage.setItem('idCarrera', this.carrera.id + "");
      localStorage.setItem('idCiclo', this.ciclo.id + "");
      //this.router.navigate(['/evaluar-docente/form']);
    }
  }

  public eliminar(s: SolicitudMatricula): void {

    Swal.fire({
      title: "Confirmación Eliminación",
      html: "Está seguro de eliminar la solicitud de " + s.estudiante,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí"
    }).then(result => {
      if (result.value) {
        this.solicitudService.eliminar(s.id).subscribe(s => {
          this.solicitudService.listarByCicloId(this.ciclo.id).subscribe(s => {
            this.solicitudes = s;
            Swal.fire('Exito: ', 'Se ha eliminado correctamente', 'success');
          });
        });
      }

    });
  }


  aprobarDocs(s: SolicitudMatricula): void {
    Swal.fire({
      title: "Confirmación de Aprobación",
      html: "Está seguro de aprobar toda la Documentación de " + s.estudiante + ". <strong>Si hubieron correcciones, se eliminará el texto de correcciones que ingresó</strong>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
    }).then(result => {
      if (result.value) {
        s.tipo = "Documentos Aprobados";
        s.observaciones = '';
        this.solicitudService.editar(s).subscribe(so => {
          Swal.fire('Aprobación de Documentos: ', 'Documentos aprobados con éxito', 'success');
          this.solicitudes.forEach(sol => {
            if (sol.id == so.id) {
              sol.fecha_modificacion = so.fecha_modificacion;
              sol.observaciones = so.observaciones;
            }
          });
        });
      }

    });
  }

}