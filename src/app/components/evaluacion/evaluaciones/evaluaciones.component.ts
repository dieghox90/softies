import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { EvaluacionService } from 'src/app/services/evaluacion.service';
import { Evaluacion } from 'src/app/models/evaluacion';
import { DatosEvaluacionService } from 'src/app/services/datos-evaluacion.service';
import { Clasificacion } from 'src/app/models/clasificacion';
import { AuthService } from 'src/app/services/auth.service';
import { MatriculaService } from 'src/app/services/matricula.service';
import { CargaHorariaService } from 'src/app/services/carga-horaria.service';
import { CargaHoraria } from 'src/app/models/carga-horaria';
import { Matricula } from 'src/app/models/matricula';
import { RespuestaService } from 'src/app/services/respuesta.service';
import { NgxSpinnerService } from 'ngx-spinner';

import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import { LocalService } from 'src/app/services/local.service';
import { Location } from "@angular/common";


@Component({
  selector: 'app-evaluaciones',
  templateUrl: './evaluaciones.component.html',
  styleUrls: ['./evaluaciones.component.css']
})
export class EvaluacionesComponent implements OnInit {

  evaluacion: Evaluacion;
  evaluacionDocente: Evaluacion;
  evaluaciones: Evaluacion[];
  nombrePeriodo = this.localService.getJsonValue('nomP');
  idP = this.localService.getJsonValue('idP');
  id: number;
  habilitado = false;

  constructor(private location: Location, private localService: LocalService, private spinnerService: NgxSpinnerService, private respuestaService: RespuestaService, private cargaService: CargaHorariaService, private matriculaService: MatriculaService, public authService: AuthService, private serviceDatosEvaluacion: DatosEvaluacionService, private router: Router, private activatedRoute: ActivatedRoute, private serviceEvaluacion: EvaluacionService) {
    this.evaluacionDocente = new Evaluacion();
    this.evaluacionDocente.clasificacion = new Clasificacion();
    this.evaluaciones = [];
  }

  ngOnInit() {
    this.spinnerService.show();
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = +params.get("id");
      if (this.id) {
        this.evaluaciones = [];
        this.serviceEvaluacion.verPeriodo(this.id, this.idP).subscribe(ev => {
          this.evaluacion = ev;
          console.log(this.evaluacion);
          if (this.evaluacion != null) {

            //------ Autoevaluacion -------
            if (this.evaluacion.clasificacion.nombre == "Autoevaluación" && this.authService.hasRole('ROLE_DOCENTE')) {
              this.evaluacionDocente = new Evaluacion();
              this.evaluacionDocente.clasificacion = new Clasificacion();
              this.evaluacionDocente.id = this.evaluacion.id;
              this.evaluacionDocente.fecha_fin = this.evaluacion.fecha_fin;
              this.evaluacionDocente.id_evaluado = this.authService.usuario.index;//index traemos el id del usuario logueado
              this.evaluacionDocente.id_evaluador = this.authService.usuario.index;
              this.evaluacionDocente.nombre_evaluado = this.authService.usuario.completo;
              this.evaluacionDocente.numero_preguntas = this.evaluacion.preguntas.length;
              this.evaluacionDocente.clasificacion.nombre = this.evaluacion.clasificacion.nombre;

              this.evaluaciones.push(this.evaluacionDocente);

              this.evaluaciones.forEach(e => {
                // *** AGREGANDO AVANCE ***/
                this.respuestaService.listarRespuestas(e.id_evaluado, this.evaluacion.id, this.authService.usuario.index).subscribe(resp => {
                  if (resp.length != 0) {
                    e.avance = resp.length;
                  }
                });// *** FIN AVANCE ***/
              });


              //----Coevaluacion - Pares Academicos ----
            } else if (this.evaluacion.clasificacion.nombre == "Coevaluación - Pares Académicos" && this.authService.hasRole('ROLE_DOCENTE')) {
              if (this.evaluacion.evaluadores.length > 0) {
                this.evaluacion.evaluadores.forEach(ev => {
                  if (ev.id_evaluador == this.authService.usuario.index) {
                    ev.evaluados.forEach(evaluado => {
                      console.log(evaluado);
                      this.evaluacionDocente = new Evaluacion();
                      this.evaluacionDocente.clasificacion = new Clasificacion();
                      this.evaluacionDocente.id = this.evaluacion.id;
                      this.evaluacionDocente.fecha_fin = this.evaluacion.fecha_fin;
                      this.evaluacionDocente.id_evaluador = ev.id_evaluador;
                      this.evaluacionDocente.nombre_evaluado = evaluado.nombre_evaluado;
                      this.evaluacionDocente.numero_preguntas = this.evaluacion.preguntas.length;
                      this.evaluacionDocente.clasificacion.nombre = this.evaluacion.clasificacion.nombre;
                      this.evaluacionDocente.id_evaluado = evaluado.id_evaluado;
                      this.evaluaciones.push(this.evaluacionDocente);
                    });
                  }

                  this.evaluaciones.forEach(e => {
                    // *** AGREGNADO AVANCE ***/
                    this.respuestaService.listarRespuestas(e.id_evaluado, this.evaluacion.id, this.authService.usuario.index).subscribe(resp => {
                      if (resp.length != 0) {
                        e.avance = resp.length;
                      }
                    });// *** FIN AVANCE ***/
                  });



                });
              }
            } else if (this.evaluacion.clasificacion.nombre == "Heteroevaluación" && this.authService.hasRole('ROLE_ESTUDIANTE')) {
              this.matriculaService.listarMatriculaEvaluacion(this.authService.usuario.index, this.idP).subscribe(m => {
                let matriculas: Matricula[];
                matriculas = m;
                console.log(matriculas);
                if (matriculas != null) {
                  matriculas.forEach(mat => {

                    this.cargaService.listarCargaPeriodoParalelo(mat.periodo_lectivo.id, mat.paralelo.id).forEach(c => {
                      let cargas: CargaHoraria[];
                      cargas = c;
                      if (cargas != null) {
                        console.log(cargas);
                        cargas.forEach(ch => {
                          this.evaluacionDocente = new Evaluacion();
                          this.evaluacionDocente.clasificacion = new Clasificacion();
                          this.evaluacionDocente.id = this.evaluacion.id;
                          this.evaluacionDocente.fecha_fin = this.evaluacion.fecha_fin;
                          this.evaluacionDocente.id_evaluador = this.authService.usuario.index;
                          this.evaluacionDocente.nombre_evaluado = ch.docente.nombre + " " + ch.docente.apellido;
                          this.evaluacionDocente.numero_preguntas = this.evaluacion.preguntas.length;
                          this.evaluacionDocente.clasificacion.nombre = this.evaluacion.clasificacion.nombre;
                          this.evaluacionDocente.id_evaluado = ch.docente.id;
                          this.evaluacionDocente.asignatura = ch.asignatura.nombre;
                          this.evaluacionDocente.id_asignatura = ch.asignatura.id;
                          this.evaluacionDocente.id_paralelo = ch.paralelo.id;
                          this.evaluacionDocente.paralelo = ch.paralelo.nombre;
                          this.evaluaciones.push(this.evaluacionDocente);
                        });



                        this.evaluaciones.forEach(e => {
                          // *** AGREGNADO AVANCE ***/

                          this.respuestaService.listarRespuestas(e.id_evaluado, this.evaluacion.id, this.authService.usuario.index).subscribe(resp => {
                            if (resp.length != 0) {
                              resp.forEach(r => {
                                if (r.asignatura_id == e.id_asignatura && r.paralelo_id == e.id_paralelo) {
                                  e.avance++;
                                }
                              });
                            }
                          });// *** FIN AVANCE ***/

                        });
                      }
                    });

                  });
                }

              });

            } else if (this.evaluacion.clasificacion.nombre == "Coevaluación - Directivos a Docentes" && this.authService.hasRole('ROLE_DOCENTE')) {

              if (this.evaluacion.evaluadores.length > 0) {
                this.evaluacion.evaluadores.forEach(ev => {
                  if (ev.id_evaluador == this.authService.usuario.index) {
                    ev.evaluados.forEach(evaluado => {
                      this.evaluacionDocente = new Evaluacion();

                      this.evaluacionDocente.clasificacion = new Clasificacion();
                      this.evaluacionDocente.id = this.evaluacion.id;
                      this.evaluacionDocente.fecha_fin = this.evaluacion.fecha_fin;
                      this.evaluacionDocente.id_evaluador = ev.id_evaluador;
                      this.evaluacionDocente.nombre_evaluado = evaluado.nombre_evaluado;
                      this.evaluacionDocente.numero_preguntas = this.evaluacion.preguntas.length;
                      this.evaluacionDocente.clasificacion.nombre = this.evaluacion.clasificacion.nombre;
                      this.evaluacionDocente.id_evaluado = evaluado.id_evaluado;
                      this.evaluacionDocente.id_paralelo = this.evaluacion.id_paralelo;
                      this.evaluacionDocente.id_asignatura = this.evaluacion.id_asignatura;
                      this.evaluaciones.push(this.evaluacionDocente);

                    });
                  }
                });

                this.evaluaciones.forEach(e => {
                  // *** AGREGNADO AVANCE ***/
                  this.respuestaService.listarRespuestas(e.id_evaluado, this.evaluacion.id, this.authService.usuario.index).subscribe(resp => {
                    if (resp.length != 0) {
                      e.avance = resp.length;
                    }
                  });// *** FINA AVANCE ***/
                });
              }

            } else {
              //no tienes acceso a este recurso
              this.evaluacion = null;
              this.spinnerService.hide();
            }

            // ------ Desahabilitar la Fecha --------

            if (new Date() > new Date(this.evaluacion.fecha_fin)) {
              this.habilitado = false;
            } else if ((new Date() == new Date(this.evaluacion.fecha_fin)) || (new Date() < new Date(this.evaluacion.fecha_fin))) {
              this.habilitado = true;
            }

          }

          this.spinnerService.hide();
        });
      }
    });


  }

  evaluar(e: Evaluacion): void {
    //console.log(this.location.path());
    /*
    this.router.events.subscribe(event => {

      if (event instanceof NavigationEnd) {
        this.localService.setJsonValue('url_anterior', event.url + "/" + event.id);
      }
    });*/

    if (this.location.path() != "") {
      this.localService.setJsonValue('url_anterior', this.location.path());
    }
    this.serviceDatosEvaluacion.fijarValores(e);
    this.router.navigate(['/evaluar-docente/form']);
  }


  generarPdf(): void {

    let doc = new jsPDF();
    // var imgData = 'data:image/jpeg;base64,' + Base64.encode('Koala.jpeg');
    // doc.addImage('', "JPEG", 7, 7, 5, 5);
    doc.text("Instituto Superior Tecnológico Primero de Mayo", 105, 20, null, null, "center");
    doc.text("Forjando un Mejor Futuro", 105, 30, null, null, "center");
    doc.save('postres.pdf');



    /*html2canvas(document.getElementById('logo'), {
      // Opciones
      //allowTaint: true,
      //useCORS: false,
      // Calidad del PDF
      // scale: 1
    }).then(function (canvas) {
      // let img = canvas.toDataURL("image/png");



      //doc.addImage(img, 'PNG', 7, 20, 195, 105);


    });

    /*
    var headers = [
      "id",
      "coin",
      "game_group",
      "game_name",
      "game_version",
      "machine",
      "vlt"
    ];

    var doc = new jsPDF('pt', 'p', 'a4');
    doc.setFontSize(20);
    doc.table(1, 1, this.generateData(100), headers, { autoSize: true });

    // doc.save('a4.pdf');
    */
  }



  generateData(amount: number): any[] {



    var result = [];
    var data = {
      id: '0',
      coin: "100",
      game_group: "GameGroup",
      game_name: "XPTO2",
      game_version: "25",
      machine: "20485861",
      vlt: "0"
    };
    for (var i = 0; i < amount; i += 1) {
      data.id = (i + 1).toString();
      result.push(Object.assign({}, data));
    }
    console.log(result);
    return result;
  };


  public createHeaders(keys) {
    var result = [];
    for (var i = 0; i < keys.length; i += 1) {
      result.push({
        id: keys[i],
        name: keys[i],
        prompt: keys[i],
        width: 65,
        align: "center",
        padding: 0
      });
    }
    return result;
  }


}
