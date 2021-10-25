import { Component, OnInit, ViewChild } from '@angular/core';
import { Estudiante } from 'src/app/models/estudiante';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Carrera } from 'src/app/models/carrera';
import { Paralelo } from 'src/app/models/paralelo';
import { Ciclo } from 'src/app/models/ciclo';
import { CarreraService } from 'src/app/services/carrera.service';
import { LocalService } from 'src/app/services/local.service';
import { MatriculaService } from 'src/app/services/matricula.service';
import { Matricula } from 'src/app/models/matricula';
import { ModalDetalleMatriculaComponent } from './modal-detalle-matricula/modal-detalle-matricula.component';
import { Location } from "@angular/common";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-matriculas',
  templateUrl: './matriculas.component.html',
  styleUrls: ['./matriculas.component.css']
})
export class MatriculasComponent implements OnInit {


  @ViewChild(ModalDetalleMatriculaComponent) modalComponent: ModalDetalleMatriculaComponent;

  titulo: string = "MATRICULADOS";
  cedula: string = "";
  estudiante: Estudiante;
  carreras: Carrera[];
  carrera: Carrera;
  ciclo: Ciclo;
  paralelo: Paralelo;
  nomPeriodo: string;
  busqueda: string;
  idP: number;
  matriculas: Matricula[];
  mensaje: string;
  busquedaParalelo: string;
  idParalelo: number;


  constructor(private toastr: ToastrService, private location: Location, private serviceMatricula: MatriculaService, private localService: LocalService, private serviceCarrera: CarreraService, private spinnerService: NgxSpinnerService, private serviceEstudiante: EstudianteService,
    private activatedRoute: ActivatedRoute) {
    this.estudiante = new Estudiante();
    this.estudiante.matriculas = [];
    this.carreras = [];
    this.carrera = new Carrera();
    this.ciclo = new Ciclo();
    this.paralelo = new Paralelo();
    this.nomPeriodo = this.localService.getJsonValue('nomP');
    this.idP = this.localService.getJsonValue('idP');
    this.busqueda = "ciclo";
    this.matriculas = [];
    this.mensaje = "No ha realizado ninguna búsqueda";
    this.idParalelo = 0;


  }

  ngOnInit() {
    this.serviceCarrera.listar().subscribe(c => {
      this.carreras = c;
    });


    /*
    this.activatedRoute.paramMap.subscribe(params => {
      const id: number = +params.get("id");
      if (id) {
        this.serviceEstudiante.ver(id).subscribe(est => {
          this.estudiante = est;
          this.cedula = this.estudiante.cedula;
        });
      }
    });*/
  }



  public buscarParalelo(): void {
    this.spinnerService.show();
    if (this.carrera.id == null || this.ciclo.id == null || this.busquedaParalelo == "" || this.busquedaParalelo == null) {
      this.toastr.error('Complete el formulario', 'Campos Obligatorios');
    } else {
      this.matriculas = [];

      if (this.busquedaParalelo != "Todos") {

        this.carrera.ciclos.forEach(c => {

          if (this.ciclo.id == c.id) {
            c.paralelos.forEach(p => {
              if (p.nombre == this.busquedaParalelo) {
                this.idParalelo = p.id;
                this.paralelo = p;
              }
            });
          }


        });

        this.serviceMatricula.listarMatriculaByPeriodoOrParaleloOrCiclo(this.idP, this.ciclo.id, this.idParalelo).subscribe(m => {
          this.matriculas = m;
          if (this.matriculas.length == 0) {
            this.mensaje = "No hay registros para el paralelo seleccionado";

          }
          this.spinnerService.hide();
        });
      } else if (this.busquedaParalelo == "Todos") {

        this.serviceMatricula.listarMatriculaByPeriodoOrParaleloOrCiclo(this.idP, this.ciclo.id, this.idParalelo).subscribe(m => {
          this.matriculas = m;
          if (this.matriculas.length == 0) {
            this.mensaje = "No hay registros para el ciclo seleccionado";
          }
          this.spinnerService.hide();
        });

      }
    }
  }


  public cambiarPanelParalelo() {
    this.busqueda = "ciclo";
  }



  public enviarHijo(m: Matricula) {
    this.modalComponent.recibirPadreHijo(m);
  }

  public fijarUrl(): void {
    if (this.location.path() != "") {
      this.localService.setJsonValue('url_anterior', this.location.path());
      //this.router.navigate(['/evaluar-docente/form']);
    }
  }

  cambiarCarrera(e) {
    this.ciclo = new Ciclo();
    this.paralelo = new Paralelo();
    this.busquedaParalelo = null;
    this.idParalelo = 0;
    this.matriculas = [];
  }

  cambiarParalelo(e) {
    this.matriculas = [];
  }

  exportar() {
    this.serviceMatricula.exportar(this.idP, this.ciclo.id, this.idParalelo, "no").subscribe((data) => {
      let bloB = new Blob([data], { type: "application/vnd.ms-excel" });
      var downloadURL = window.URL.createObjectURL(bloB);
      var link = document.createElement('a');
      link.href = downloadURL;
      if (this.idParalelo != 0) {
        link.download = this.ciclo.nombre + "_" + this.paralelo.nombre + ".xls";
      } else {
        link.download = this.ciclo.nombre + ".xls";
      }

      link.click();
    });
  }

  exportarDetalle() {
    this.serviceMatricula.exportar(this.idP, this.ciclo.id, this.idParalelo, "si").subscribe((data) => {
      let bloB = new Blob([data], { type: "application/vnd.ms-excel" });
      var downloadURL = window.URL.createObjectURL(bloB);
      var link = document.createElement('a');
      link.href = downloadURL;
      if (this.idParalelo != 0) {
        link.download = this.ciclo.nombre + "_" + this.paralelo.nombre + ".xls";
      } else {
        link.download = this.ciclo.nombre + ".xls";
      }

      link.click();
    });
  }


}


