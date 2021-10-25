import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Ciclo } from 'src/app/models/ciclo';
import { Paralelo } from 'src/app/models/paralelo';
import { ActivatedRoute } from '@angular/router';
import { CarreraService } from 'src/app/services/carrera.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-modal-ciclo',
  templateUrl: './modal-ciclo.component.html',
  styleUrls: ['./modal-ciclo.component.css']
})
export class ModalCicloComponent implements OnInit {

  @Output()
  cicloEnviar: EventEmitter<Ciclo> = new EventEmitter<Ciclo>();

  nombreParalelos: string[];
  paralelo: Paralelo;
  paralelos: Paralelo[];
  paralelosAux: Paralelo[];
  ciclo: Ciclo;
  cicloAux: Ciclo;

  constructor(private activatedRoute: ActivatedRoute, private service: CarreraService) {
    this.ciclo = new Ciclo();
    this.paralelosAux = [];
    this.ciclo.paralelos = [];
    this.paralelo = new Paralelo();
    this.paralelos = [];
    this.cicloAux = new Ciclo();
    this.nombreParalelos = ["A", "B", "C", "D"];

  }

  ngOnInit() {

    this.generarParalelos();
  }

  asignarCiclo(): void {
    this.cicloEnviar.emit(this.ciclo);
    this.ciclo = new Ciclo();
    this.ciclo.paralelos = [];
    this.paralelos = [];
    this.generarParalelos();

  }

  asignarParalelo(event: any, paralelo: Paralelo): void {
    paralelo.estado = event.target.checked;
    this.ciclo.paralelos.push(paralelo);
  }

  editarParalelo(event: any, paralelo: Paralelo) {
    paralelo.estado = event.target.checked;

    if (paralelo.estado == false) {
      for (let i = 0; i < this.ciclo.paralelos.length; i++) {

        if (paralelo.nombre == this.ciclo.paralelos[i].nombre) {
          this.ciclo.paralelos.splice(i, 1);
        }
      }
    } else {
      this.paralelosAux.push(paralelo);
      this.ciclo.paralelos.push(paralelo);
    }


  }

  cancelarEditarCiclo(): void {
    this.ciclo.nombre = this.cicloAux.nombre;
    console.log(this.cicloAux.nombre);
    for (let i = 0; i < this.paralelosAux.length; i++) {
      for (let j = 0; j < this.ciclo.paralelos.length; j++) {
        if (this.paralelosAux[i].nombre == this.ciclo.paralelos[j].nombre) {
          console.log(this.paralelosAux[i].nombre);
          this.ciclo.paralelos.splice(j, 1);
        }
      }
    }
    this.paralelosAux = [];
    this.paralelos = [];
    this.generarParalelos();
    this.ciclo = new Ciclo();
  }


  generarParalelos() {
    for (let i = 0; i < this.nombreParalelos.length; i++) {
      this.paralelo = new Paralelo();
      this.paralelo.nombre = this.nombreParalelos[i];
      this.paralelo.estado = false;
      this.paralelos.push(this.paralelo);
    }
  }

  //Esto viene del padre
  fijarCiclo(c: Ciclo): void {
    this.ciclo = c;
    this.cicloAux.nombre = c.nombre;
    this.cicloAux.codigo = c.codigo;
    for (let i = 0; i < this.paralelos.length; i++) {
      this.paralelos[i].estado = false;
      for (let j = 0; j < this.ciclo.paralelos.length; j++) {
        if (this.paralelos[i].nombre == this.ciclo.paralelos[j].nombre) {
          this.paralelos[i].estado = true;
        }
      }
    }
  }

}
