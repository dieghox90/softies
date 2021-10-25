import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { Evaluacion } from 'src/app/models/evaluacion';
import { Clasificacion } from 'src/app/models/clasificacion';
import { DatosEvaluacionService } from 'src/app/services/datos-evaluacion.service';
import { EvaluacionService } from 'src/app/services/evaluacion.service';
import { Criterio } from 'src/app/models/criterio';
import { Subcriterio } from 'src/app/models/subcriterio';
import { Pregunta } from 'src/app/models/pregunta';
import { Respuesta } from 'src/app/models/respuesta';
import { PreguntaService } from 'src/app/services/pregunta.service';
import Swal from 'sweetalert2';
import { TipoRespuesta } from 'src/app/models/tipo-respuesta';
import { RespuestaService } from 'src/app/services/respuesta.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-form-evaluar',
  templateUrl: './form-evaluar.component.html',
  styleUrls: ['./form-evaluar.component.css']
})
export class FormEvaluarComponent implements OnInit {

  evaluacion: Evaluacion;
  criterio: Criterio;
  subcriterio: Subcriterio;
  criterios: Criterio[];
  criteriosAux: Criterio[];
  subcriterios: Subcriterio[];
  pregunta: Pregunta;
  respuesta: Respuesta;
  respuestas: Respuesta[];
  tipoRespuestas: TipoRespuesta[];
  estado: boolean;
  estadoEdicion: boolean;
  fechaActual: Date;
  habilitado: boolean;
  cargando: boolean;


  constructor(private localService: LocalService, public authService: AuthService, private spinnerService: NgxSpinnerService, private serviceRespuesta: RespuestaService, private servicePregunta: PreguntaService, private service: EvaluacionService, private router: Router, private serviceDatosEvaluacion: DatosEvaluacionService) {
    this.cargando = true;
    this.evaluacion = new Evaluacion();
    this.evaluacion.clasificacion = new Clasificacion();
    this.criterio = new Criterio();
    this.subcriterio = new Subcriterio();
    this.subcriterio.preguntas = [];
    this.criterios = [];
    this.criteriosAux = [];
    this.subcriterios = [];
    this.pregunta = new Pregunta();
    this.respuesta = new Respuesta();
    this.respuestas = [];
    this.tipoRespuestas = [];
    this.estado = false;
    this.estadoEdicion = true;
    this.fechaActual = new Date();
    this.habilitado = true;
  }

  ngOnInit() {





    this.evaluacion = this.serviceDatosEvaluacion.evaluacion;
    this.service.ver(this.evaluacion.id).subscribe(ev => {
      this.evaluacion.preguntas = ev.preguntas;

      let c = []; //criterios
      let s = []; //subcriterios
      this.evaluacion.preguntas.forEach(p => {
        //  p.respuestas = [];/// ESTO PUSE EL 9 NOVIMEBRE 2020

        c.push(p.subcriterio.criterio.id);
        s.push(p.subcriterio.id);
      });

      const cri = Array.from(new Set(c));
      const sub = Array.from(new Set(s));

      // ----- LLENAMOS LAS PREGUNTAS -----------

      sub.forEach(id => {
        let s: Subcriterio = new Subcriterio();
        s.preguntas = [];
        s.criterio = new Criterio();
        s.id = id;
        this.evaluacion.preguntas.forEach(p => {

          // p.respuestas = []; /// ESTO PUSE EL 9 NOVIMEBRE 2020

          if (id == p.subcriterio.id) {
            s.preguntas.push(p);
            s.criterio.id = p.subcriterio.criterio.id;
            s.nombre = p.subcriterio.nombre;
            s.criterio.nombre = p.subcriterio.criterio.nombre;

          }
        });
        this.subcriterios.push(s);
      });

      cri.forEach(id => {
        let crit: Criterio = new Criterio();
        crit.subcriterios = [];
        this.subcriterios.forEach(s => {
          if (id == s.criterio.id) {
            crit.id = s.criterio.id;
            crit.nombre = s.criterio.nombre;
            // crit.nombre = s.nombre;
            crit.subcriterios.push(s);
          }
        });
        this.criterios.push(crit);
      });



      //---------- FILTRANDO COEVALUACION DIRECTIVOS A DOCENTES - POR COORDINACION ------

      if (this.authService.hasRole('ROLE_COORD_INVESTIGACION') && this.evaluacion.clasificacion.nombre == "Coevaluación - Directivos a Docentes") {
        this.criterios = this.criterios.filter(c => c.nombre == "Investigación");
      }

      if (this.authService.hasRole('ROLE_COORD_VINCULACION') && this.evaluacion.clasificacion.nombre == "Coevaluación - Directivos a Docentes") {
        this.criterios = this.criterios.filter(c => c.nombre == "Vinculación con la Sociedad");
      }

      if (this.authService.hasRole('ROLE_COORD_CARRERA') && this.evaluacion.clasificacion.nombre == "Coevaluación - Directivos a Docentes") {
        this.criterios = this.criterios.filter(c => c.nombre == "Docencia");
      }


      if (this.authService.hasRole('ROLE_RECTOR') && this.evaluacion.clasificacion.nombre == "Coevaluación - Directivos a Docentes") {

        if (this.evaluacion.nombre_evaluado == 'Diego Vicente Guamán Jima') {
          this.criterios = this.criterios.filter(c => c.nombre == "Gestión Académica" || c.nombre == "Investigación");
        } else if (this.evaluacion.nombre_evaluado == 'Juan Carlos Guarinda Castillo') {
          this.criterios = this.criterios.filter(c => c.nombre == "Gestión Académica" || c.nombre == "Vinculación con la Sociedad");
        } else if (this.evaluacion.nombre_evaluado == 'Nelly Elizabeth Cueva Reategui') {
          this.criterios = this.criterios.filter(c => c.nombre == "Gestión Académica" || c.nombre == "Docencia");
        } else if (this.evaluacion.nombre_evaluado == 'DIANA ELSA PAUCAR ORDOÑEZ') {
          this.criterios = this.criterios.filter(c => c.nombre == "Gestión Académica" || c.nombre == "Docencia");
        } else {
          this.criterios = this.criterios.filter(c => c.nombre == "Gestión Académica");
        }

      }



      //------- FIN FILTRO ---------------


      // --------------- Cargar respuestas --------------------- ///

      this.serviceRespuesta.listarByEvaluacion(this.evaluacion.id,this.evaluacion.id_evaluador,this.evaluacion.id_evaluado).subscribe(res => {

        console.log("EVALUADOR "+this.evaluacion.id_evaluador +" --- "+" EEVALUADO "+this.evaluacion.id_evaluado);
        

        this.respuestas = res;
        this.respuestas.forEach(res => {

          this.criterios.forEach(cri => {

            cri.subcriterios.forEach(sub => {
              sub.preguntas.forEach(p => {
                if (res.evaluador_id == this.evaluacion.id_evaluador && res.asignatura_id == this.evaluacion.id_asignatura && p.id == res.pregunta.id && res.subcriterio_id == sub.id && res.evaluado_id == this.evaluacion.id_evaluado) {
                  p.tipo_pregunta.tipo_respuestas.forEach(tr => {
                    tr.estado = false;
                    this.estadoEdicion = false;
                    if (tr.nombre == res.texto) {
                      tr.estado = true;
                      sub.numero_respondidas = sub.numero_respondidas + 1;
                    }
                  });
                }

            
              });
            });
          });


        });

      });


      this.cargando = false;




    }, err => {
      this.cargando = false;
    });


  }



  seleccionarRespuesta(event: any, tipoRespuesta: TipoRespuesta, pregunta: Pregunta) {
    let resp: Respuesta = new Respuesta();
    resp.pregunta = new Pregunta();
    resp.pregunta.id = pregunta.id;
    resp.texto = tipoRespuesta.nombre;
    resp.evaluado_id = this.evaluacion.id_evaluado;
    resp.evaluador_id = this.evaluacion.id_evaluador;
    resp.criterio_id = pregunta.subcriterio.criterio.id;
    resp.subcriterio_id = pregunta.subcriterio.id;
    resp.evaluacion_id = this.evaluacion.id;
    resp.asignatura_id = this.evaluacion.id_asignatura;
    resp.paralelo_id = this.evaluacion.id_paralelo;



    if (this.respuestas.length != 0) {
      this.respuestas.forEach(r => {
        if (r.pregunta.id == pregunta.id) {

          if (r.id != null) {//para editar
            if (r.evaluador_id == this.evaluacion.id_evaluador && r.paralelo_id == this.evaluacion.id_paralelo && r.evaluado_id == this.evaluacion.id_evaluado && r.asignatura_id == this.evaluacion.id_asignatura) {
              resp.id = r.id;
            }

          }
          let index = this.respuestas.indexOf(r);
          this.respuestas.splice(index, 1);

        }
      });
      resp.estado = true;
      this.estadoEdicion = true;
      this.respuestas.push(resp);
      this.estado = true;


    } else {
      this.estado = true;
      this.respuestas.push(resp);

    }

    console.log(resp);
  }


  public crear(): void {

    this.spinnerService.show();

    if (this.estado == false || this.estadoEdicion == false) {
      if (this.estado == false) {
        Swal.fire('Error', 'Debe responder por lo menos una pregunta', 'error');

      }

      if (this.estadoEdicion == false) {
        Swal.fire('Información', 'No ha realizado ningún cambio', 'info');
      }

      this.spinnerService.hide();

    } else {
      this.serviceRespuesta.crear_listado(this.respuestas).subscribe(
        respuestas => {
          this.spinnerService.show();

          this.respuestas = respuestas;
          this.criterios.forEach(cr => {
            cr.subcriterios.forEach(sub => sub.numero_respondidas = 0);
          });

          this.respuestas.forEach(res => {
            this.criterios.forEach(cri => {
              cri.subcriterios.forEach(sub => {
                sub.preguntas.forEach(p => {
                  if (res.paralelo_id == this.evaluacion.id_paralelo && res.evaluador_id == this.evaluacion.id_evaluador && res.asignatura_id == this.evaluacion.id_asignatura && p.id == res.pregunta.id && res.subcriterio_id == sub.id && res.evaluado_id == this.evaluacion.id_evaluado) {
                    p.tipo_pregunta.tipo_respuestas.forEach(tr => {
                      if (tr.nombre == res.texto) {
                        sub.numero_respondidas++;
                      }
                    });
                  }
                });
              });
            });
          });



          // ------ SABER EL NUMERO DE PREGUNTAS Y RESPUESTAS --------

          let respondidas = 0;
          let totalPreguntas = 0;
          this.criterios.forEach(c => {
            c.subcriterios.forEach(s => {
              respondidas = respondidas + s.numero_respondidas;
              totalPreguntas = totalPreguntas + s.preguntas.length;
            });
          });


          this.estadoEdicion = false; //esto es para el mensaje de que no ha hecho ningun cambio

          Swal.fire(
            "Registro",
            "Respuestas <strong>registradas</strong> con éxito",
            "success"
          );


          // en caso de que haya completado el cuestionario se redirecciona a la pagina de EVALUACIONES
          if (respondidas == totalPreguntas) {
            Swal.fire(
              "Completado",
              "Cuestionario <strong>completado</strong> con éxito",
              "info"
            );
            this.router.navigateByUrl(this.localService.getJsonValue('url_anterior'));
          }

          this.spinnerService.hide();
        });

    }
  }

  regresar(): void {

    this.router.navigateByUrl(this.localService.getJsonValue('url_anterior'));
  }
}