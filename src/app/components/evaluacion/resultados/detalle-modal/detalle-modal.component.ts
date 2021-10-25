import { Component, OnInit } from '@angular/core';
import { Criterio } from 'src/app/models/criterio';

@Component({
  selector: 'app-detalle-modal',
  templateUrl: './detalle-modal.component.html',
  styleUrls: ['./detalle-modal.component.css']
})
export class DetalleModalComponent implements OnInit {

  criterios: Criterio[];

  constructor() {
    this.criterios = [];
  }

  ngOnInit() {
  }


  public recibirEvaluacionPadre(cri: Criterio[]) {
    this.criterios = cri;
    this.criterios.forEach(c => {
      c.subcriterios.forEach(s => {
        s.preguntas.forEach(p => {
          console.log(p.resultados.length);
        });
      })
    });
  }


}
