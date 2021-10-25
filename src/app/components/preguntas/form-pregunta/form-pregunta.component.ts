import { Component, OnInit } from '@angular/core';
import { Evaluacion } from 'src/app/models/evaluacion';
import { Periodo } from 'src/app/models/periodo';
import { Criterio } from 'src/app/models/criterio';
import { Subcriterio } from 'src/app/models/subcriterio';
import { CriterioService } from 'src/app/services/criterio.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import { EvaluacionService } from 'src/app/services/evaluacion.service';
import { Pregunta } from 'src/app/models/pregunta';
import { PreguntaService } from 'src/app/services/pregunta.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { TipoPreguntaService } from 'src/app/services/tipo-pregunta.service';
import { TipoPregunta } from 'src/app/models/tipo-pregunta';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalService } from 'src/app/services/local.service';


@Component({
  selector: 'app-form-pregunta',
  templateUrl: './form-pregunta.component.html',
  styleUrls: ['./form-pregunta.component.css']
})
export class FormPreguntaComponent implements OnInit {


  evaluacionsSeleccionadas: string[];
  evaluaciones: Evaluacion[];
  evaluacionesPresentar: Evaluacion[];
  periodos: Periodo[];
  periodo: Periodo;
  criterio: Criterio;
  criterios: Criterio[];
  subcriterio: Subcriterio;
  subcriterios: Subcriterio[];
  pregunta: Pregunta;
  tipos_preguntas: TipoPregunta[];
  tipo_pregunta: TipoPregunta;
  idP = null;

  constructor(private localService: LocalService, private spinnerService: NgxSpinnerService, private serviceTipoPregunta: TipoPreguntaService, private service: PreguntaService, private serviceCriterio: CriterioService, private servicePeriodo: PeriodoService,
    private serviceEvaluacion: EvaluacionService,
    private activatedRoute: ActivatedRoute) {
    this.evaluacionsSeleccionadas = [];
    this.periodos = [];
    this.periodo = new Periodo();
    this.evaluaciones = [];
    this.criterio = new Criterio();
    this.criterio.subcriterios = [];
    this.criterios = [];
    this.subcriterio = new Subcriterio();
    this.subcriterios = [];
    this.pregunta = new Pregunta();
    this.pregunta.evaluaciones = [];
    this.evaluacionesPresentar = [];
    this.tipos_preguntas = [];
    this.tipo_pregunta = new TipoPregunta();
    this.pregunta.tipo_pregunta = new TipoPregunta();
    this.idP = this.localService.getJsonValue('idP');

  }

  ngOnInit() {
    this.spinnerService.show();
    this.activatedRoute.paramMap.subscribe(params => {
      const id: number = +params.get("id");
      if (id) {

        this.service.ver(id).subscribe(p => {
          console.log(p);
          this.pregunta = p;
          this.pregunta.tipo_pregunta = p.tipo_pregunta;
          this.tipo_pregunta = p.tipo_pregunta;
          this.subcriterio = p.subcriterio;
          this.criterio = p.subcriterio.criterio;
          this.periodo = p.evaluaciones[0].periodo;



          //Cargamos tipos de preguntas
          this.serviceTipoPregunta.listar().subscribe(tp => {
            this.tipos_preguntas = tp;
          });

          this.serviceCriterio.listar(this.localService.getJsonValue('idP')).subscribe(c => {
            this.criterios = c;
            this.criterios.forEach(cri => {
              if (cri.id == this.criterio.id) {
                this.criterio.subcriterios = cri.subcriterios;
              }
            });
          });

          //Presentar Evaluaciones
          if (this.periodo.id) {
            this.evaluacionsSeleccionadas = [];
            this.serviceEvaluacion.listar(this.periodo.id).subscribe(evas => {
              this.evaluacionesPresentar = evas;
              this.evaluacionesPresentar.forEach(e => {
                e.estado = false;
                this.pregunta.evaluaciones.forEach(eva => {
                  if (e.id == eva.id) {
                    e.estado = true;
                    this.evaluacionsSeleccionadas.push(e.etiqueta);
                  }
                });
              });
            });
          }
        });
      } else {

        // --- Cargar Periodo ----
        if (this.idP != null) {
          this.servicePeriodo.ver(this.idP).subscribe(p => {
            this.periodo = p;
          });

          // ---- cargar evaluaciones basandose al periodo ----
          this.cargarEvaluaciones(this.idP);
        }




        this.serviceCriterio.listar(this.localService.getJsonValue('idP')).subscribe(c => {
          this.criterios = c;
        });

        //Cargamos tipos de preguntas
        this.serviceTipoPregunta.listar().subscribe(tp => {
          this.tipos_preguntas = tp;
        });
      }
    });

    setTimeout(() => {
      this.spinnerService.hide();
    }, 800);

  }




  public crear(): void {
    this.spinnerService.show();
    this.evaluacionsSeleccionadas.forEach(e => {
      this.evaluacionesPresentar.forEach(ev => {
        if (e == ev.etiqueta) {
          this.pregunta.evaluaciones.push(ev);
        }
      });
    });

    this.pregunta.subcriterio = this.subcriterio;
    this.pregunta.tipo_pregunta = this.tipo_pregunta;
    console.log(this.pregunta);
    this.service.crear(this.pregunta).subscribe(
      cla => {
        Swal.fire(
          "Nueva Pregunta",
          "Pregunta  <strong>Creada</strong> con exito",
          "success"
        );
        this.pregunta = new Pregunta();
        this.pregunta.evaluaciones = [];
        this.tipo_pregunta = new TipoPregunta();
        this.evaluacionsSeleccionadas = [];
        this.evaluacionesPresentar = [];
        this.serviceEvaluacion.listar(this.periodo.id).subscribe(evas => {
          this.evaluacionesPresentar = evas;
          this.evaluacionesPresentar.forEach(e => {
            e.estado = false;
          });
        });
      });
    this.spinnerService.hide();
  }




  public editar(): void {
    this.spinnerService.show();
    this.pregunta.evaluaciones = [];
    this.evaluacionsSeleccionadas.forEach(e => {
      this.evaluacionesPresentar.forEach(ev => {
        if (e == ev.etiqueta) {
          this.pregunta.evaluaciones.push(ev);
        }
      });
    });
    this.pregunta.tipo_pregunta = this.tipo_pregunta;


    this.pregunta.subcriterio = this.subcriterio;
    console.log(this.pregunta);
    this.service.editar(this.pregunta).subscribe(
      cla => {
        Swal.fire(
          "Edición",
          "Pregunta  <strong>Actualizada</strong> con exito",
          "success"
        );
        this.pregunta = new Pregunta();
      });
    this.spinnerService.hide();
  }



  seleccionarEvaluacion(event: any, nombreEva: string) {
    if (event.currentTarget.checked) {
      this.evaluacionsSeleccionadas.push(nombreEva);
    } else {
      let index = this.evaluacionsSeleccionadas.indexOf(nombreEva);
      this.evaluacionsSeleccionadas.splice(index, 1);
    }



  }

  public cargarEvaluaciones(id: number) {
    this.serviceEvaluacion.listar(id).subscribe(e => {
      this.evaluacionesPresentar = e;
      this.evaluacionesPresentar.forEach(ev => {
        ev.estado = false;
      });
    });

  }


  compararCriterio(o1: Criterio, o2: Criterio): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }


  compararSubcriterio(o1: Subcriterio, o2: Subcriterio): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }

  compararPeriodo(o1: Periodo, o2: Periodo): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }

  compararTipo(o1: TipoPregunta, o2: TipoPregunta): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }
}
