import { Component, OnInit } from '@angular/core';
import { Asignatura } from 'src/app/models/asignatura';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { Carrera } from 'src/app/models/carrera';
import { Ciclo } from 'src/app/models/ciclo';
import { CarreraService } from 'src/app/services/carrera.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-asignaturas',
  templateUrl: './asignaturas.component.html',
  styleUrls: ['./asignaturas.component.css']
})
export class AsignaturasComponent implements OnInit {

  asignaturas: Asignatura[];
  titulo: string = "Asignaturas";

  carrera: Carrera;
  carreras: Carrera[];
  ciclo: Ciclo;

  constructor(private spinnerService: NgxSpinnerService, private service: AsignaturaService, private serviceCarrera: CarreraService) {

    this.carrera = new Carrera();
    this.ciclo = new Ciclo();
    this.carreras = [];
    this.asignaturas = [];

  }

  ngOnInit() {
    this.spinnerService.show();
    this.serviceCarrera.listar().subscribe(c => {
      this.carreras = c;
      if (localStorage.getItem('idCarrera') != null && localStorage.getItem('idCiclo') != null) {
        this.carreras.forEach(ca => {
          if (ca.id == parseInt(localStorage.getItem('idCarrera'))) {
            this.carrera = ca;
            this.carrera.ciclos.forEach(ciclo => {
              if (ciclo.id == parseInt(localStorage.getItem('idCiclo'))) {
                this.ciclo = ciclo;
                this.buscar();
              }
            });
          }
        });
      }
      localStorage.removeItem('idCarrera');
      localStorage.removeItem('idCiclo');
      this.spinnerService.hide();
    });
  }

  public buscar(): void {

    if (this.ciclo.id != null) {
      this.service.listar(this.ciclo.id).subscribe(a => {
        this.asignaturas = a;

      });
    }
    this.spinnerService.hide();
  }

  fijarUrl(): void {
    localStorage.setItem('idCarrera', this.carrera.id + "");
    localStorage.setItem('idCiclo', this.ciclo.id + "");
  }

}
