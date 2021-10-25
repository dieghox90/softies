import { Component, OnInit, ɵConsole } from '@angular/core';
import { PeriodoService } from 'src/app/services/periodo.service';
import { Periodo } from 'src/app/models/periodo';
import { EvaluacionService } from 'src/app/services/evaluacion.service';
import { Evaluacion } from 'src/app/models/evaluacion';
import { LocalService } from 'src/app/services/local.service';
import { CriterioService } from 'src/app/services/criterio.service';
import { Criterio } from 'src/app/models/criterio';
import { Pregunta } from 'src/app/models/pregunta';
import { PreguntaService } from 'src/app/services/pregunta.service';
import { Subcriterio } from 'src/app/models/subcriterio';

@Component({
  selector: 'app-modal-copiar-evaluacion',
  templateUrl: './modal-copiar-evaluacion.component.html',
  styleUrls: ['./modal-copiar-evaluacion.component.css']
})
export class ModalCopiarEvaluacionComponent implements OnInit {

  periodos: Periodo[];
  periodo: Periodo;
  evaluaciones: Evaluacion[];
  criterios: Criterio[];
  criteriosPreguntas: Criterio[];
  preguntas: Pregunta[];

  constructor(private preguntaService: PreguntaService, private criterioService: CriterioService, private localService: LocalService, private servicePeriodo: PeriodoService, private serviceEvaluacion: EvaluacionService) {
    this.periodos = [];
    this.periodo = new Periodo();
    this.criterios = [];
    this.criteriosPreguntas = [];
    this.preguntas = [];
  }

  ngOnInit() {
    this.servicePeriodo.listar().subscribe(p => {
      this.periodos = p;
    });
  }

  public cargarEvaluaciones(): void {
    this.evaluaciones = [];
    this.serviceEvaluacion.listar(this.periodo.id).subscribe(e => {
      this.evaluaciones = e;
    });
  }

  public guardarEvaluaciones(): void {





    let citeriosGuardados: Criterio[] = [];
    let evaluacionesGuardadas: Evaluacion[] = [];


    // ----- Guardamos las evaluaciones ------
    this.evaluaciones.forEach(e => {
      e.id = null;
      e.periodo = new Periodo();
      e.periodo.id = this.localService.getJsonValue('idP');
      e.preguntas = [];
      e.evaluadores = [];

    });



    this.serviceEvaluacion.crearList(this.evaluaciones).subscribe(e => {
      // alert('Evaluaciones guardadas ' + e.length);
      evaluacionesGuardadas = e;


      // ----- Guardamos los criterios y subcriterios ------
      this.criterioService.listar(this.periodo.id).subscribe(cri => {
        this.criterios = cri;


        this.criterios.forEach(c => {
          c.id = null;
          c.periodo_id = this.localService.getJsonValue('idP');
          c.subcriterios.forEach(s => {
            s.preguntas = [];

            s.id = null;
          });
        });



        this.criterioService.crearLita(this.criterios).subscribe(crit => {
          //alert('cRITERIOS GUARDADOS guardadas ');
          citeriosGuardados = crit;



          // ----- Guardamos las preguntas ------

          this.criterioService.listar(this.periodo.id).subscribe(cri => {
            this.criteriosPreguntas = cri;

            this.criteriosPreguntas.forEach(c => {
              c.subcriterios.forEach(s => {
                this.preguntaService.listarSubcriterio(s.id).forEach(p => {
                  this.preguntas = p;

                  this.preguntas.forEach(pre => {
                    pre.id = null;
                    pre.resultados = [];
                    citeriosGuardados.forEach(cri => {
                      cri.subcriterios.forEach(sub => {
                        if (pre.subcriterio.nombre == sub.nombre) {
                          pre.subcriterio.criterio.id = null;
                          pre.subcriterio.criterio.id = cri.id;
                          pre.subcriterio.id = null;
                          pre.subcriterio.id = sub.id;
                        }
                      });
                    });



                    pre.evaluaciones.forEach(e => {
                      evaluacionesGuardadas.forEach(ev => {
                        if (e.etiqueta == ev.etiqueta) {
                          e.id = null;
                          e.id = ev.id;
                          e.periodo = new Periodo();
                          e.evaluadores = [];
                          e.preguntas = [];
                        }
                      });
                    });
                  });


                  console.log("Preguntas");
                  console.log(this.preguntas);

                  this.preguntaService.crearLista(this.preguntas).subscribe(pre => {
                    alert('Preguntas Guardadas guardadas ');
                    console.log("Guardadas");
                    console.log(pre);
                  });
                  this.preguntas = [];

                });
              });
            });


          });


        });



      });



    });









  }

}
