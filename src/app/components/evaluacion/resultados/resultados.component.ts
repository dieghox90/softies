import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { Evaluacion } from 'src/app/models/evaluacion';
import { Respuesta } from 'src/app/models/respuesta';
import { EvaluacionService } from 'src/app/services/evaluacion.service';
import { RespuestaService } from 'src/app/services/respuesta.service';
import { DocenteService } from 'src/app/services/docente.service';
import { Docente } from 'src/app/models/docente';
import { ResultadoEvaluacion } from 'src/app/models/resultado-evaluacion';
import { Clasificacion } from 'src/app/models/clasificacion';
import { CriterioService } from 'src/app/services/criterio.service';
import { Criterio } from 'src/app/models/criterio';
import { DetalleModalComponent } from './detalle-modal/detalle-modal.component';
import { Pregunta } from 'src/app/models/pregunta';
import { Subcriterio } from 'src/app/models/subcriterio';
import { ContenedorResultadosEvaluacion } from 'src/app/models/contenedor-resultados-evaluacion';

import { Periodo } from 'src/app/models/periodo';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css']
})
export class ResultadosComponent implements OnInit {

  @ViewChild(DetalleModalComponent) modalComponent: DetalleModalComponent;

  nombre_periodo = this.localService.getJsonValue('nomP');
  evaluaciones: Evaluacion[];
  resultados: Evaluacion[];
  respuestas: Respuesta[];
  docentes: Docente[];
  docentesResultados: Docente[];
  criterios: Criterio[];
  criterio: Criterio;
  subcriterio: Subcriterio;
  pregunta: Pregunta;
  idP = this.localService.getJsonValue('idP');

  //Para el informe de Evaluacion
  contenedorResultados: ContenedorResultadosEvaluacion;


  constructor(public localService: LocalService, private spinnerService: NgxSpinnerService, private serviceCriterio: CriterioService, private serviceDocente: DocenteService, private serviceEvaluacion: EvaluacionService, private serviceRespuesta: RespuestaService,
    private docenteService: DocenteService) {
    this.evaluaciones = [];
    this.respuestas = [];
    this.docentes = [];
    this.docentesResultados = [];
    this.criterios = [];
    this.criterio = new Criterio();
    this.subcriterio = new Subcriterio();
    this.pregunta = new Pregunta();
    this.criterio.subcriterios = [];
    this.subcriterio.preguntas = [];
    this.contenedorResultados = new ContenedorResultadosEvaluacion();

  }


  ngOnInit() {
    this.spinnerService.show();

    this.docenteService.listar().subscribe(docentes => {
      this.docentes = docentes;
      this.docentes.forEach(doc => {
        let docente: Docente = new Docente();

        docente = doc;
        docente.evaluaciones = [];
        this.serviceEvaluacion.listar(this.idP).forEach(evaluaciones => {
          this.evaluaciones = evaluaciones;
          this.evaluaciones.forEach(ev => {

            let evaluacion: Evaluacion = new Evaluacion();
            evaluacion.periodo = new Periodo();
            evaluacion.resultados = [];
            evaluacion.clasificacion = new Clasificacion();
            let respuestas: Respuesta[] = [];

            this.serviceRespuesta.listarEvaluacion(doc.id, ev.id).subscribe(res => {
              respuestas = res;
              evaluacion.id = ev.id;
              evaluacion.periodo.id = ev.periodo.id;
              evaluacion.clasificacion.nombre = ev.clasificacion.nombre;
              evaluacion.nombre_evaluado = doc.nombre + " " + doc.apellido;
              evaluacion.numero_preguntas = ev.preguntas.length;

              respuestas.forEach(r => {
                evaluacion.id_evaluado = r.evaluado_id;
                let resultadoEvaluacion: ResultadoEvaluacion = new ResultadoEvaluacion();
                r.pregunta.tipo_pregunta.tipo_respuestas.forEach(tr => { //tipo de respuestas Siempre, Casi siempre....
                  if (tr.nombre == r.texto) { //texto =  siempre, casi siempre....
                    resultadoEvaluacion.nombre = tr.nombre;
                    resultadoEvaluacion.total++;
                  }
                });
                if (evaluacion.resultados.find(re => re.nombre == resultadoEvaluacion.nombre)) {
                  evaluacion.resultados.find(re => {
                    if (re.nombre == resultadoEvaluacion.nombre) {
                      re.total++;
                    }
                  });
                } else {
                  evaluacion.resultados.push(resultadoEvaluacion);
                }
              });

            });
            docente.evaluaciones.push(evaluacion);
          });
        });
        this.docentesResultados.push(docente);
      });

    });
    setTimeout(() => {
      this.spinnerService.hide();
    }, 800);
  }







  public irDetalle(ev: Evaluacion) {
    this.spinnerService.show();

    let respuestas: Respuesta[] = [];
    let evaluaciones: Evaluacion[] = [];


    this.serviceEvaluacion.listar(ev.periodo.id).subscribe(e => {

      evaluaciones = e;
      let evaluacion: Evaluacion = new Evaluacion();
      evaluaciones.find(evalu => {
        if (evalu.id == ev.id) {
          evaluacion = evalu;
          evaluacion.id_evaluado = ev.id_evaluado;
          evaluacion.preguntas.forEach(p => p.resultados = []);
        }
      });




      this.serviceRespuesta.listarEvaluacion(evaluacion.id_evaluado, evaluacion.id).subscribe((res: Respuesta[]) => {
        respuestas = res;

        //aumente el id
        this.serviceCriterio.listar(this.localService.getJsonValue('idP')).subscribe(c => {

          this.criterios = c;

          this.criterios.forEach(cri => {
            cri.subcriterios.forEach(sub => {
              sub.preguntas.forEach(pregunta => {
                pregunta.resultados = [];
                respuestas.forEach(res => {
                  if (res.pregunta.id == pregunta.id) {
                    let resultado: ResultadoEvaluacion = new ResultadoEvaluacion();
                    resultado.nombre = res.texto;
                    resultado.total++;

                    if (pregunta.resultados.length == 0) {
                      pregunta.resultados.push(resultado);
                    } else {
                      pregunta.resultados.forEach(r => {
                        if (r.nombre == res.texto) {
                          r.total++;
                        } else {
                          pregunta.resultados.push(resultado);
                        }
                      });
                    }

                  }
                });
              });
            });
          });


          /// ----- eliminando las preguntas que no corresponden  a la evaluacion ----

          let indexPreguntas: number[] = [];
          console.log(evaluacion.etiqueta);
          this.criterios.forEach(criterio => {
            criterio.subcriterios.forEach(s => {
              s.preguntas.forEach((p, index) => {
                p.evaluaciones.forEach(e => {
                  const cont = 0;
                  if (e.id == evaluacion.id) {
                    indexPreguntas.push(p.id);
                  }
                });
              });
            });
          });

          /*
          
                    const indexSinRepetido = [...new Set(indexPreguntas)]
          
                    console.log(indexSinRepetido);
          
                    indexSinRepetido.forEach(i => {
                      this.criterios.forEach(c => {
                        c.subcriterios.forEach(s => {
                          s.preguntas.forEach(p => {
                            if (p.id == i) {
          
          
                            }
                          });
          
                        });
                      });
                    });
          */

          this.modalComponent.recibirEvaluacionPadre(this.criterios);
        });


      });

    });
    this.spinnerService.hide();
  }



  generarInforme() {

    this.contenedorResultados.resultadosDocentes = this.docentesResultados;
    this.contenedorResultados.resultadosDetalle = this.criterios;

    console.log(this.contenedorResultados);

    this.serviceEvaluacion.exportarAll(this.contenedorResultados).subscribe((data) => {
      let bloB = new Blob([data], { type: "application/pdf" });
      var downloadURL = window.URL.createObjectURL(bloB);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "archivo.pdf";

      link.click();
    });
  }

}