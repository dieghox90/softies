import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Evaluador } from 'src/app/models/evaluador';
import { Evaluado } from 'src/app/models/evaluado';
import { DocenteService } from 'src/app/services/docente.service';
import { Docente } from 'src/app/models/docente';
import Swal from 'sweetalert2';
import { EvaluadorService } from 'src/app/services/evaluador.service';
import { Evaluacion } from 'src/app/models/evaluacion';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-modal-restriccion',
  templateUrl: './modal-restriccion.component.html',
  styleUrls: ['./modal-restriccion.component.css']
})
export class ModalRestriccionComponent implements OnInit {

  @Output()
  evaluacionEnviar: EventEmitter<Evaluacion> = new EventEmitter<Evaluacion>();

  evaluador: Evaluador;
  evaluados: Evaluado[];
  evaluadosSelec: Evaluado[];
  docentes: Docente[];
  docente: Docente;
  evaluadores: Evaluador[];
  evaluacion: Evaluacion;


  constructor(private spinnerService: NgxSpinnerService, private service: EvaluadorService, private serviceDocente: DocenteService) {
    this.evaluadosSelec = [];
    this.evaluados = [];
    this.evaluador = new Evaluador();
    this.evaluador.evaluacion = new Evaluacion();


  }

  ngOnInit() {

    this.evaluados = [];
  }


  public llenarEvaluados(): void {
    this.serviceDocente.listar().subscribe(docs => {
      this.docentes = docs;

      this.docentes.forEach(d => {
        let ev: Evaluado;
        ev = new Evaluado();
        ev.id_evaluado = d.id;
        ev.nombre_evaluado = d.nombre + " " + d.apellido;
        ev.estado = false;
        this.evaluados.push(ev);
      });

    });
  }



  public crear(): void {
    this.spinnerService.show();
    this.evaluador.id_evaluador = this.docente.id;
    this.evaluador.nombre_evaluador = this.docente.nombre + " " + this.docente.apellido;
    this.evaluador.evaluados = this.evaluadosSelec;
    this.evaluador.evaluacion.id = this.evaluacion.id;
    this.service.crear(this.evaluador).subscribe(
      cri => {
        Swal.fire(
          "Nueva Restriccion",
          "Restriccion <strong>Creada</strong> con exito",
          "success"
        );
        this.evaluador = new Evaluador;
        this.evaluados = [];
        this.service.listar().subscribe(ev => {
          this.evaluadores = ev;
          this.evaluacion.evaluadores = [];
          this.evaluacion.evaluadores = this.evaluadores;

          this.evaluacionEnviar.emit(this.evaluacion);
        });
      });
    this.spinnerService.hide();
  }



  public editar(): void {
    this.spinnerService.show();
    this.evaluador.evaluados = this.evaluadosSelec;
    this.service.editar(this.evaluador).subscribe(
      cri => {
        Swal.fire(
          "Edición Restriccion",
          "Restriccion <strong>Actualizada</strong> con éxito",
          "success"
        );
        this.evaluador = new Evaluador;
        this.evaluados = [];
        this.service.listar().subscribe(e => {
          this.evaluadores = e;
          this.evaluacion.evaluadores = [];
          this.evaluacion.evaluadores = this.evaluadores;
          this.evaluadosSelec = [];
          this.evaluados = [];
          this.evaluacionEnviar.emit(this.evaluacion);

        });
      });
    this.spinnerService.hide();
  }

  seleccionarEvaluados(event: any, evaluado: Evaluado) {
    if (event.currentTarget.checked) {
      this.evaluadosSelec.push(evaluado);
    } else {
      let index = this.evaluadosSelec.indexOf(evaluado);
      this.evaluadosSelec.splice(index, 1);
    }
    console.log(this.evaluadosSelec);
  }


  public recibirEvaluacionPadreHijo(e: Evaluacion) {
    this.evaluacion = e;
    this.llenarEvaluados();
  }

  public recibirEvaluadorPadreHijo(e: Evaluador) {
    this.docente = new Docente();
    this.evaluacion = new Evaluacion();
    this.evaluacion.id = e.evaluacion.id;
    this.evaluacion.descripcion = e.evaluacion.descripcion;

    this.evaluacion.clasificacion = e.evaluacion.clasificacion;
    e.evaluacion.evaluadores.forEach(ev => {
      ev.evaluacion = new Evaluacion();
    });

    this.evaluador = e;
    this.evaluador.evaluacion.id = this.evaluacion.id;


    this.docente.id = e.id_evaluador;
    this.docentes = [];

    this.evaluados = [];

    this.serviceDocente.listar().subscribe(doc => {
      this.docentes = doc;
      this.docentes.forEach(d => {
        let ev: Evaluado;
        ev = new Evaluado();
        ev.id_evaluado = d.id;
        ev.nombre_evaluado = d.nombre + " " + d.apellido;
        ev.estado = false;
        this.evaluados.push(ev);
      });

      console.log("LLEGO DEL PADRE");
      console.log(this.evaluadosSelec);

      e.evaluados.forEach(ev => {
        this.evaluados.forEach(e => {


          if (ev.nombre_evaluado == e.nombre_evaluado) {
            e.estado = true;
            this.evaluadosSelec.push(e);
          }
        });
      });


    });




  }


  compararEvaluador(o1: Docente, o2: Docente): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }

}
