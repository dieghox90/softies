import { Component, OnInit } from '@angular/core';
import { Estudiante } from 'src/app/models/estudiante';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from "@angular/common";
import { LocalResolver } from '@angular/compiler/src/compiler_util/expression_converter';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-busqueda-matricula',
  templateUrl: './busqueda-matricula.component.html',
  styleUrls: ['./busqueda-matricula.component.css']
})
export class BusquedaMatriculaComponent implements OnInit {

  titulo: string = "NUEVA MATRICULA";
  cedula: string = "";
  estudiante: Estudiante;

  constructor(private localService: LocalService, private location: Location, private spinnerService: NgxSpinnerService, private serviceEstudiante: EstudianteService) {
    this.estudiante = new Estudiante();
    this.estudiante.matriculas = [];
  }

  ngOnInit() {

  }

  public buscar(): void {
    this.spinnerService.show();
    let id = 0;
    this.serviceEstudiante.buscarEstudiante(this.cedula).subscribe(est => {
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
                alert(id);
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

    this.spinnerService.hide();
  }

  public fijarUrl(): void {
    if (this.location.path() != "") {
      this.localService.setJsonValue('url_anterior', this.location.path());
      //this.router.navigate(['/evaluar-docente/form']);
    }
  }



}
