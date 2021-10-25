import { Component, OnInit } from '@angular/core';
import { CargaHoraria } from 'src/app/models/carga-horaria';
import { LocalService } from 'src/app/services/local.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CargaHorariaService } from 'src/app/services/carga-horaria.service';
import { DocenteService } from 'src/app/services/docente.service';
import { Docente } from 'src/app/models/docente';
import { GlobalVariable } from 'src/app/Globals/variables';

@Component({
  selector: 'app-seguimiento-docente',
  templateUrl: './seguimiento-docente.component.html',
  styleUrls: ['./seguimiento-docente.component.css']
})
export class SeguimientoDocenteComponent implements OnInit {

  cargas: CargaHoraria[];
  idP = this.localService.getJsonValue('idP');
  nombP = this.localService.getJsonValue('nomP');
  docente: Docente;
  docenteDefault: Docente;
  docentes: Docente[];
  rutaArchivos: string;

  constructor(private serviceDocente: DocenteService, private serviceCargaHoraria: CargaHorariaService, private localService: LocalService, private spinnerService: NgxSpinnerService) {
    this.cargas = [];
    //this.docente = new Docente();
    this.docentes = [];
    this.docenteDefault = new Docente();
    this.docente = new Docente();
    this.rutaArchivos = GlobalVariable.URL_DOCS_PLANIFICACION;
  }

  ngOnInit(): void {
    this.serviceDocente.listar().subscribe(d => {
      this.docentes = d;
      //   this.docente = undefined;
    });
  }


  buscarCarga(): void {
    console.log(this.docente);
    this.serviceCargaHoraria.listarCargaPeriodoDocente(this.idP, this.docente.id).subscribe(ch => {
      this.cargas = ch;
    });
  }


  compararDocente(o1: Docente, o2: Docente): boolean {

    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }

}
