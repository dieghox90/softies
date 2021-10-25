import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CarreraService } from 'src/app/services/carrera.service';
import { Carrera } from 'src/app/models/carrera';
import { Ciclo } from 'src/app/models/ciclo';
import { Paralelo } from 'src/app/models/paralelo';
import { CargaHoraria } from 'src/app/models/carga-horaria';
import { Asignatura } from 'src/app/models/asignatura';
import { Docente } from 'src/app/models/docente';
import { Distributivo } from 'src/app/models/distributivo';
import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-modal-asignacion',
  templateUrl: './modal-asignacion.component.html',
  styleUrls: ['./modal-asignacion.component.css']
})
export class ModalAsignacionComponent implements OnInit {


  carreras: Carrera[];
  carrera: Carrera;
  ciclo: Ciclo;
  paralelo: Paralelo;
  cargasHorarias: CargaHoraria[];
  cargaHorariaModal: CargaHoraria;
  asignatura: Asignatura;
  docenteModal: Docente;
  distributivo: Distributivo;

  @Output()
  cargasEnviar: EventEmitter<CargaHoraria[]> = new EventEmitter<CargaHoraria[]>();

  constructor(private spinnerService: NgxSpinnerService, private serviceCarrera: CarreraService) {
    this.carrera = new Carrera();
    this.ciclo = new Ciclo();
    this.paralelo = new Paralelo();
    this.carreras = [];
    this.carrera.ciclos = [];
    this.asignatura = new Asignatura();
    this.cargaHorariaModal = new CargaHoraria();
    this.cargaHorariaModal.docente = new Docente();
    this.cargaHorariaModal.asignatura = new Asignatura();
    this.cargasHorarias = [];
    this.docenteModal = new Docente();
    this.distributivo = new Distributivo();
  }

  ngOnInit() {

    this.serviceCarrera.listar().subscribe(carr => {
      this.carreras = carr;
    });


  }


  asignar(asig: Asignatura) {
    this.carrera.ciclos = [];
    this.ciclo.paralelos = [];
    this.paralelo.ciclo = this.ciclo;
    this.paralelo.ciclo.carrera = this.carrera;
    this.cargaHorariaModal.docente = this.docenteModal;
    this.cargaHorariaModal.asignatura = asig;
    this.cargaHorariaModal.asignatura.ciclo = new Ciclo();
    this.cargaHorariaModal.asignatura.ciclo.carrera = new Carrera();
    this.cargaHorariaModal.asignatura.ciclo.id = this.ciclo.id;
    this.cargaHorariaModal.asignatura.ciclo.nombre = this.ciclo.nombre;
    this.cargaHorariaModal.asignatura.ciclo.carrera.id = this.carrera.id;
    this.cargaHorariaModal.asignatura.ciclo.carrera.nombre = this.carrera.nombre;
    this.cargaHorariaModal.paralelo = this.paralelo;
    let entrada: boolean = false;

    this.cargasHorarias.forEach(ch => {
      if (this.cargaHorariaModal.asignatura.nombre == ch.asignatura.nombre) {
        if (this.cargaHorariaModal.paralelo.nombre == ch.paralelo.nombre) {
          entrada = true;
        }
      }
    });

    if (entrada) {
      alert("EL docente ya tiene esa asigantura asignada");
    } else {

      this.cargasHorarias.push(this.cargaHorariaModal);
      this.cargaHorariaModal = new CargaHoraria();

    }




  }

  eliminar(ch: CargaHoraria) {

    let index = this.cargasHorarias.indexOf(ch);
    this.cargasHorarias.splice(index, 1);

  }

  cambiarCiclo() {
    this.paralelo = new Paralelo();
  }

  //recibido del padre
  public fijarDocentePeriodoPadre(docente): void {

    this.docenteModal = docente;

    if (this.docenteModal.cargas_horarias.length > 0) {
      this.docenteModal.cargas_horarias.forEach(ch => {
        this.cargaHorariaModal.asignatura = ch.asignatura;
        this.cargaHorariaModal.distributivo = ch.distributivo;
        this.cargaHorariaModal.paralelo = ch.paralelo;
        this.cargasHorarias.push(this.cargaHorariaModal);
        this.cargaHorariaModal = new CargaHoraria();
      });

      this.cargasHorarias.forEach(c => {
        c.docente = this.docenteModal;
      });

    }

  }

  //enviar al padre
  public fijarPadre(): void {

    this.cargasHorarias.forEach(ch => {
      ch.docente = new Docente();
      ch.docente.cargas_horarias = [];
    });


    this.docenteModal.cargas_horarias = [];
    this.docenteModal.cargas_horarias = this.cargasHorarias;//nuevo
    this.cargasEnviar.emit(this.cargasHorarias);
    this.cargaHorariaModal = new CargaHoraria();
    this.carrera = new Carrera();
    this.ciclo = new Ciclo();
    this.cargasHorarias = [];



    this.serviceCarrera.listar().subscribe(carr => {
      this.carreras = carr;

    });

  }


}
