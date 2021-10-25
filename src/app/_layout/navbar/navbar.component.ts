import { Component, OnInit, OnDestroy } from '@angular/core';
import { Periodo } from 'src/app/models/periodo';
import { PeriodoService } from 'src/app/services/periodo.service';
import { Router } from '@angular/router';
import { DocenteService } from 'src/app/services/docente.service';
import { Docente } from 'src/app/models/docente';
import { Evaluacion } from 'src/app/models/evaluacion';
import { EvaluacionService } from 'src/app/services/evaluacion.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { LocalService } from 'src/app/services/local.service';
import { MatriculaService } from 'src/app/services/matricula.service';
import { Matricula } from 'src/app/models/matricula';
import { MatriculaAsignatura } from 'src/app/models/matricula-asignatura';
import { CargaHorariaService } from 'src/app/services/carga-horaria.service';
import { NgxSpinnerService } from 'ngx-spinner';


declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  periodos: Periodo[];
  periodo: Periodo;
  docenteLogin: Docente;
  evaluaciones: Evaluacion[];
  periodoActual: Periodo;
  asignaturas_matricula: MatriculaAsignatura[];
  constructor(private spinnerService: NgxSpinnerService,private cargaHorariaService: CargaHorariaService, private serviceMatricula: MatriculaService, private localService: LocalService, public authService: AuthService, private serviceEvaluacion: EvaluacionService, private router: Router, private servicePeriodo: PeriodoService, private serviceDocente: DocenteService) {
    this.periodos = [];
    this.periodo = new Periodo();
    this.docenteLogin = new Docente();
    this.docenteLogin.cargas_horarias = [];
    this.periodoActual = new Periodo();
    this.asignaturas_matricula = [];
  }
  ngOnDestroy(): void {
  }


  expandirMenu(): void {
  }


  ngOnInit() {
    this.servicePeriodo.listarShort().subscribe(p => {
      this.periodos = p;


      // esto solo es en evaluacion para eliminar el periodo actual ----- elminaaaar
      // this.periodos = this.periodos.filter(p => p.id != 3 && p.id != 4);

      if (this.localService.getJsonValue('idP') == null) {
        let arrayFechas = this.periodos.map((pe) => new Date(pe.fecha_fin));
        var max = new Date(Math.max.apply(null, arrayFechas));


        this.periodos.forEach(periodo => {
          if (new Date(periodo.fecha_fin).getTime() === max.getTime()) {
            this.periodo = periodo;
            this.localService.setJsonValue('idP', this.periodo.id);
            this.localService.setJsonValue('nomP', this.periodo.periodo_academico);
            this.periodoActual = this.periodo;
          }
        });
      } else {
        this.periodo = this.periodos.find(p => p.id === (this.localService.getJsonValue('idP')));
        this.periodoActual = this.periodo;
      }


      /*  Para cargar los datos del docente y estudiante logueado */
      if (this.authService.hasRole('ROLE_DOCENTE') || this.authService.hasRole('ROLE_ADMIN')
        || this.authService.hasRole('ROLE_ESTUDIANTE')) {

        if (this.authService.hasRole('ROLE_DOCENTE') || this.authService.hasRole('ROLE_ADMIN')) {
          this.serviceDocente.listarCargaHoraria(this.authService.usuario.index, this.localService.getJsonValue('idP')).subscribe(d => {
            this.docenteLogin = d;
          });
        } else if (this.authService.hasRole('ROLE_ESTUDIANTE')) {
          // es el mismo metodo que utilizamos en el proceso de evaluacion al docente
          this.serviceMatricula.listarMatriculaEvaluacion(this.authService.usuario.index, this.localService.getJsonValue('idP')).subscribe(m => {

            m.forEach(mat => {
              mat.matriculas_asignaturas.forEach(asig => {
                this.asignaturas_matricula.push(asig);
                asig.matricula = mat;

              });
            });
          });

        }



        /* -- Cargar las evaluaciones -- */
        this.serviceEvaluacion.listarSinRelaciones(this.localService.getJsonValue('idP')).subscribe(e => {
          this.evaluaciones = e;
        });
      }
    });


  }



  logout(): void {
    Swal.fire('Cierre de Sessión ', this.authService.usuario.completo + ' has cerrado la sessión con éxito', 'success');
    this.authService.logout();
    this.localService.clearToken();
    this.router.navigate(['/login']);
  }

  onChange(p: any) {
    //    this.localService.clearToken();
    this.spinnerService.show();
    this.localService.setJsonValue('idP', p.id);
    this.localService.setJsonValue('nomP', p.periodo_academico);


    if (this.authService.hasRole('ROLE_DOCENTE') || this.authService.hasRole('ROLE_ADMIN')
      || this.authService.hasRole('ROLE_ESTUDIANTE')) {

      if (this.authService.hasRole('ROLE_DOCENTE') || this.authService.hasRole('ROLE_ADMIN')) {

        this.serviceDocente.listarCargaHoraria(this.authService.usuario.index, this.localService.getJsonValue('idP')).subscribe(d => {
          this.docenteLogin = d;
          this.cargarEvaluaciones();
        });
      } else if (this.authService.hasRole('ROLE_ESTUDIANTE')) {
        // es el mismo metodo que utilizamos en el proceso de evaluacion al docente
        this.serviceMatricula.listarMatriculaEvaluacion(this.authService.usuario.index, this.localService.getJsonValue('idP')).subscribe(m => {

          m.forEach(mat => {
            mat.matriculas_asignaturas.forEach(asig => {
              this.asignaturas_matricula.push(asig);
              asig.matricula = mat;
              this.cargarEvaluaciones();

            });
          });
        });

      }

    }


  }


  // Cargar las evaluaciones

  public cargarEvaluaciones() {

    this.serviceEvaluacion.listarSinRelaciones(this.localService.getJsonValue('idP')).subscribe(e => {
      this.evaluaciones = e;
      this.router.navigate(['/home']);
      this.spinnerService.hide();
      Swal.fire('Información', 'Ha cambiado de periodo académico con éxito', 'info');
    });
  }



  // Esto es del estudiante
  irInformacionAsignatura(asignatura: MatriculaAsignatura): void {
    this.cargaHorariaService.verCargaHorariaMatricula(this.localService.getJsonValue('idP'), asignatura.matricula.paralelo.id, asignatura.asignatura.id).subscribe(ch => {
      if (ch != null) {
        this.router.navigate(['/informacion-asignatura', ch.id]);
      } else {
        this.router.navigate(['/informacion-asignatura', 0]);
      }
    });
  }

  // Esto es del estudiante
  irPlanesAsignatura(asignatura: MatriculaAsignatura): void {
    this.cargaHorariaService.verCargaHorariaMatricula(this.localService.getJsonValue('idP'), asignatura.matricula.paralelo.id, asignatura.asignatura.id).subscribe(ch => {
      if (ch != null) {
        this.router.navigate(['/planes-asignatura', ch.id]);
      } else {
        this.router.navigate(['/planes-asignatura', 0]);
      }
    });
  }

  compararPeriodo(o1: Periodo, o2: Periodo): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }

    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }

  removerFiltros(): void {
    localStorage.getItem('idCarrera');
    localStorage.getItem('idCiclo');
  }

}
