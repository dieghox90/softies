import { PlanificacionAcademicaService } from './../../services/planificacion-academica.service';
import { PlanificacionAcademica } from 'src/app/models/planificacion-academica';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Asignatura } from 'src/app/models/asignatura';
import { Carrera } from 'src/app/models/carrera';
import { Ciclo } from 'src/app/models/ciclo';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { CarreraService } from 'src/app/services/carrera.service';
import { LocalService } from 'src/app/services/local.service';


import { GlobalVariable } from 'src/app/Globals/variables';

@Component({
  selector: 'app-repositorio',
  templateUrl: './repositorio.component.html',
  styleUrls: ['./repositorio.component.css']
})
export class RepositorioComponent implements OnInit {


  asignaturas: Asignatura[];
  titulo: string = "Asignaturas";

  carrera: Carrera;
  carreras: Carrera[];
  ciclo: Ciclo;
  planificacionAcademica: PlanificacionAcademica;
  planificacionesAcademicas: PlanificacionAcademica[];


  rutaArchivos: string;

  idP = this.localService.getJsonValue('idP');

  constructor(private localService: LocalService, private planificacionService: PlanificacionAcademicaService, private spinnerService: NgxSpinnerService, private service: AsignaturaService, private serviceCarrera: CarreraService) {
    this.carrera = new Carrera();
    this.ciclo = new Ciclo();
    this.carreras = [];
    this.asignaturas = [];
    this.planificacionAcademica = new PlanificacionAcademica();
    this.planificacionesAcademicas = [];
    this.rutaArchivos = GlobalVariable.URL_DOCS_PLANIFICACION;
  }

  ngOnInit(): void {
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

    this.planificacionesAcademicas = [];

    if (this.ciclo.id != null) {
      this.service.listar(this.ciclo.id).subscribe(a => {
        this.asignaturas = a;
        this.planificacionService.listarFiltrado(this.idP, this.ciclo.id).subscribe(planes => {
        
          this.asignaturas.forEach(a => {
            let contador: number = 1;

            planes.forEach(p => {
              
              if (a.id == p.asignatura_id && p.nombre_paralelo == "A") {   
                this.planificacionAcademica = new PlanificacionAcademica();
                this.planificacionAcademica.nombre_asignatura = a.nombre;
                this.planificacionAcademica.asignatura_id = a.id;
                this.planificacionAcademica.ruta_guia = p.ruta_guia;
                this.planificacionAcademica.guia = p.guia;
                this.planificacionAcademica.ruta_silabo = p.ruta_silabo;
                this.planificacionAcademica.silabo = p.silabo;
                this.planificacionAcademica.nombre_paralelo = p.nombre_paralelo;
                this.planificacionesAcademicas.push(this.planificacionAcademica);
              }

              if (a.id == p.asignatura_id && p.nombre_paralelo=="B") {     
                this.planificacionAcademica = new PlanificacionAcademica();
                this.planificacionAcademica.nombre_asignatura = a.nombre;
                this.planificacionAcademica.asignatura_id = a.id;
                this.planificacionAcademica.ruta_guia = p.ruta_guia;
                this.planificacionAcademica.guia = p.guia;
                this.planificacionAcademica.ruta_silabo = p.ruta_silabo;
                this.planificacionAcademica.silabo = p.silabo;
                this.planificacionAcademica.nombre_paralelo = p.nombre_paralelo;
                this.planificacionesAcademicas.push(this.planificacionAcademica);
              }

        
              this.spinnerService.hide();
            });

          });
        });

      });
    
    }
 

    console.log(this.planificacionesAcademicas);
  }
}