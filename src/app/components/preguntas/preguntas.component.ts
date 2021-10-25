import { Component, OnInit } from '@angular/core';
import { Criterio } from 'src/app/models/criterio';
import { Subcriterio } from 'src/app/models/subcriterio';
import { CriterioService } from 'src/app/services/criterio.service';
import { Pregunta } from 'src/app/models/pregunta';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.component.html',
  styleUrls: ['./preguntas.component.css']
})
export class PreguntasComponent implements OnInit {



  criterio: Criterio;
  criterios: Criterio[];
  subcriterio: Subcriterio;
  subcriterios: Subcriterio[];
  preguntas: Pregunta[];
  criterioPresentar: Criterio;

  constructor(private localService: LocalService, private spinnerService: NgxSpinnerService, private serviceCriterio: CriterioService) {
    this.criterio = new Criterio();
    this.criterio.subcriterios = [];
    this.criterios = [];
    this.subcriterios = [];
    this.preguntas = [];
    this.criterioPresentar = new Criterio();
  }

  ngOnInit() {
    this.spinnerService.show();
    this.serviceCriterio.listar(this.localService.getJsonValue('idP')).subscribe(c => {
      console.log(c);
      this.criterios = c;

      this.criterios.forEach(cri => {
        cri.subcriterios.forEach(sub => {
          cri.totalPreguntas = (parseInt(cri.totalPreguntas) + sub.preguntas.length) + "";
        });
      });
    });
    this.spinnerService.hide();
  }


  cargarPreguntas(criterio: Criterio) {
    this.criterioPresentar = criterio;
    console.log(this.criterioPresentar);
  }

}
