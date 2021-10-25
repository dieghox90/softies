import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatriculaService } from 'src/app/services/matricula.service';
import { Matricula } from 'src/app/models/matricula';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { Estudiante } from 'src/app/models/estudiante';
import { CarreraService } from 'src/app/services/carrera.service';
import { Carrera } from 'src/app/models/carrera';
import { Ciclo } from 'src/app/models/ciclo';
import { Paralelo } from 'src/app/models/paralelo';
import Swal from 'sweetalert2';
import { MatriculaAsignatura } from 'src/app/models/matricula-asignatura';
import { PeriodoService } from 'src/app/services/periodo.service';
import { Periodo } from 'src/app/models/periodo';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalService } from 'src/app/services/local.service';
import { SolicitudMatricula } from 'src/app/models/solicitud-matricula';
import { SolicitudMatriculaService } from 'src/app/services/solicitud-matricula.service';


import { Location } from "@angular/common";
import { ToastrService } from 'ngx-toastr';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';



@Component({
  selector: 'app-form-matricula',
  templateUrl: './form-matricula.component.html',
  styleUrls: ['./form-matricula.component.css']
})
export class FormMatriculaComponent implements OnInit {

  matricula: Matricula;
  estudiante: Estudiante;
  carreras: Carrera[];
  carrera: Carrera;
  ciclo: Ciclo;
  paralelo: Paralelo;
  periodo: Periodo;
  periodos: Periodo[] = [];
  matriculaAsignatura: MatriculaAsignatura[];
  actividad: string;
  solicitud: SolicitudMatricula;
  id_solicitud: number;



  asignaturasSeleccionadas: string[] = [];

  constructor(private toastr: ToastrService, private router: Router, private location: Location, private serviceSolictud: SolicitudMatriculaService, private localService: LocalService, private spinnerService: NgxSpinnerService, private activatedRoute: ActivatedRoute,
    private serviceEstudiante: EstudianteService,
    private serviceMatricula: MatriculaService,
    private serviceCarrera: CarreraService,
    private servicePeriodo: PeriodoService) {
    this.matricula = new Matricula();
    this.matricula.perdida_gratuidad = false;
    this.estudiante = new Estudiante();
    this.estudiante.matriculas = [];
    this.carrera = new Carrera();
    this.ciclo = new Ciclo();
    this.paralelo = new Paralelo();
    this.periodo = new Periodo();
    this.matriculaAsignatura = [];
    this.actividad = "";
    this.solicitud = new SolicitudMatricula();
    this.id_solicitud = 0;

  }

  ngOnInit() {

    this.spinnerService.show();
    this.activatedRoute.paramMap.subscribe(params => {
      const id_estudiante: number = +params.get("id_estudiante");
      const id_matricula: number = +params.get("id_matricula");
      this.id_solicitud = +params.get("id_solicitud");
      if (id_estudiante > 0) {//para creacion

        this.serviceCarrera.listar().subscribe(carreras => {
          this.carreras = carreras;
        });

        this.serviceEstudiante.ver(id_estudiante).subscribe(est => {
          this.estudiante = est;
          this.actividad = "nuevo";

          // ---- VER ULTIMA MATRICULA ---

          let id = 0;
          this.serviceEstudiante.buscarEstudiante(this.estudiante.cedula).subscribe(est => {
            this.estudiante = est;
            if (this.estudiante.matriculas.length > 0) {

              if (this.estudiante.matriculas.length == 1) {
                id = this.estudiante.matriculas[0].periodo_lectivo.id;
              } else {
                for (let i = 0; i < this.estudiante.matriculas.length; i++) {
                  let fecha1 = new Date(this.estudiante.matriculas[i].periodo_lectivo.fecha_fin);
                  for (let j = 1; j < this.estudiante.matriculas.length; j++) {
                    let fecha2 = new Date(this.estudiante.matriculas[j].periodo_lectivo.fecha_fin);


                    if (fecha1 > fecha2) {

                      id = this.estudiante.matriculas[i].periodo_lectivo.id;
                    } else {

                      id = this.estudiante.matriculas[j].periodo_lectivo.id;
                    }
                  }
                }
              }
            }

            //ultima matricula
            this.estudiante.matriculas = this.estudiante.matriculas.filter(ma => ma.periodo_lectivo.id === id);
          });
          // ---- FIN ULTIMA MATRICULA ----


        });
      }

      // ----- FIJAR PERIODO ------

      if (this.localService.getJsonValue('idP') != null) {
        this.servicePeriodo.ver(this.localService.getJsonValue('idP')).subscribe(p => {
          this.periodo = p;

        });
      }


      // --- PARA EDICION -----
      if (id_matricula > 0) {
        this.serviceMatricula.ver(id_matricula).subscribe(mat => {
          this.matriculaAsignatura = mat.matriculas_asignaturas;
          this.matricula = mat;
          this.periodo = this.matricula.periodo_lectivo;
          this.estudiante = this.matricula.estudiante;
          this.carrera = this.matricula.paralelo.ciclo.carrera;
          this.ciclo = this.matricula.paralelo.ciclo;
          this.paralelo = this.matricula.paralelo;
          this.actividad = "edicion";
          this.cargarCarreras();
        });
      }

      // ------- PARA SOLICTUDES ONLINE -----
      if (this.id_solicitud > 0) {
        this.serviceSolictud.ver(this.id_solicitud).subscribe(s => {
          this.solicitud = s;
          this.serviceEstudiante.buscarEstudiante(this.solicitud.cedula).subscribe(est => {
            this.estudiante = est;
          });

          this.serviceCarrera.ver(this.solicitud.carrera_id).subscribe(c => {
            this.carrera = c;
            this.carrera.ciclos.forEach(ci => {
              if (ci.id == this.solicitud.ciclo_id) {
                this.ciclo = ci;
              }
            });
          });
        });

        this.actividad = "nuevo";
        this.cargarCarreras();
      }

    });

    setTimeout(() => {
      this.spinnerService.hide();
    }, 800);

  }

  public cargarCarreras(): void {
    this.serviceCarrera.listar().subscribe(carreras => {
      this.carreras = carreras;
      if (this.carrera.id) {

        this.carreras.forEach(c => {
          if (this.carrera.id === c.id) {
            this.carrera.ciclos = c.ciclos;
            this.carrera.ciclos.forEach(ciclo => {

              if (this.ciclo.id === ciclo.id) {
                this.ciclo.asignaturas = ciclo.asignaturas;
                this.ciclo.paralelos = ciclo.paralelos;
                this.ciclo.asignaturas.forEach(a => {

                  this.matriculaAsignatura.forEach(asig => {
                    if (asig.asignatura.nombre === a.nombre) {
                      a.estado_asig_mat = true;
                      this.asignaturasSeleccionadas.push(a.nombre);

                    }
                  });
                });

              }
            });
          }
        });
      }
    });
  }



  compararPeriodo(o1: Periodo, o2: Periodo): boolean {

    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }

  compararCarrera(o1: Carrera, o2: Carrera): boolean {

    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }


  compararCiclo(o1: Ciclo, o2: Ciclo): boolean {

    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }

  compararParalelo(o1: Paralelo, o2: Paralelo): boolean {
    // alert(this.paralelo.nombre);
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }


  cambiar(asd) {
    this.matricula.paralelo = this.paralelo;

  }


  seleccionarMateria(event: any, nombreAsig: string) {
    if (event.currentTarget.checked) {
      this.asignaturasSeleccionadas.push(nombreAsig);
    } else {
      let index = this.asignaturasSeleccionadas.indexOf(nombreAsig);
      this.asignaturasSeleccionadas.splice(index, 1);
    }

  }

  public crear(): void {

    if (this.carrera.id == null || this.ciclo.id == null || this.paralelo.id == null
      || this.matricula.numero_matricula == null || this.matricula.perdida_gratuidad
      || this.matricula.numero == null || this.matricula.tipo_matricula == null) {
      this.toastr.error('Complete el formulario', 'Campos Obligatorios');


    } else if (this.asignaturasSeleccionadas.length == 0) {
      this.toastr.error('Seleccione al menos una asignatura ', 'Asignaturas');
    } else {


      this.serviceMatricula.listarMatriculaByPeriodoAndCicloAndEstudiante(this.localService.getJsonValue('idP'), this.ciclo.id, this.estudiante.id).subscribe(m => {
        //alert(m.length);
        if (m.length != 0) {
          Swal.fire('Error: ', 'El estudiante ya esta matricula en el ciclo y periodo seleccionado', 'error');
        } else {

          this.spinnerService.show();
          this.matricula.paralelo = this.paralelo;
          this.matricula.estudiante = this.estudiante;
          this.matricula.periodo_lectivo = this.periodo;
          this.matricula.matriculas_asignaturas = [];
          this.ciclo.asignaturas.forEach(asig => {
            this.asignaturasSeleccionadas.forEach(a => {
              if (asig.nombre == a) {
                let mat_asig = new MatriculaAsignatura();
                mat_asig.asignatura = asig;
                this.matricula.matriculas_asignaturas.push(mat_asig);
              }
            });
          });

          //let ma: Matricula = new Matricula(); /////  -----esto aumente 15 -06 -2020

          this.serviceMatricula.crear(this.matricula).subscribe(
            matricula => {
              Swal.fire(
                "Nuevo Registro ",
                "Matricula <strong>Creada</strong> con exito",
                "success"
              );
              this.matricula = new Matricula();
              this.paralelo = new Paralelo();
              this.carrera = new Carrera();
              this.ciclo = new Ciclo();
              this.paralelo = new Paralelo();
              this.asignaturasSeleccionadas = [];

              // ---- si es mediante solicitud, debemos actualizar la solcitud a matriculado ----

              if (this.id_solicitud > 0) {
                this.solicitud.tipo = "Matriculado";
                this.solicitud.observaciones = "Ninguna";
                this.serviceSolictud.editar(this.solicitud).subscribe(s => {
                  this.solicitud = s;
                  if (this.location.path() != "") {
                    //this.localService.setJsonValue('url_anterior', this.location.path());
                    this.router.navigate([this.localService.getJsonValue('url_anterior')]);
                  }
                });
              }
            });
          this.spinnerService.hide();
        }

      });


    }

  }


  public editar(): void {
    this.spinnerService.show();
    this.matricula.paralelo = this.paralelo;
    this.matricula.estudiante = this.estudiante;
    this.matricula.periodo_lectivo = this.periodo;
    this.matricula.matriculas_asignaturas = [];
    this.ciclo.asignaturas.forEach(asig => {
      this.asignaturasSeleccionadas.forEach(a => {
        if (asig.nombre == a) {
          let mat_asig = new MatriculaAsignatura();
          mat_asig.asignatura = asig;
          mat_asig.estado = false;
          this.matricula.matriculas_asignaturas.push(mat_asig);
        }
      });
    });
    this.serviceMatricula.editar(this.matricula).subscribe(
      matricula => {
        Swal.fire(
          "Nuevo Registro ",
          "Matricula " + matricula.paralelo + " <strong>Actualizada</strong> con exito",
          "success"
        );
        this.matricula = new Matricula();
        this.paralelo = new Paralelo();
        this.carrera = new Carrera();
        this.ciclo = new Ciclo();
        this.paralelo = new Paralelo();
        this.asignaturasSeleccionadas = [];

      });
    this.spinnerService.hide();
  }

  regresar(): void {

    if (this.location.path() != "") {
      //this.localService.setJsonValue('url_anterior', this.location.path());
      this.router.navigate([this.localService.getJsonValue('url_anterior')]);
    }
  }

}
