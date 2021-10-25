import { Component, OnInit, ViewChild } from '@angular/core';
import { TipoPregunta } from 'src/app/models/tipo-pregunta';
import { TipoRespuesta } from 'src/app/models/tipo-respuesta';
import { TipoPreguntaService } from 'src/app/services/tipo-pregunta.service';
import { ModalTipoRespuestaComponent } from './modal-tipo-respuesta/modal-tipo-respuesta.component';

@Component({
  selector: 'app-tipos-preguntas',
  templateUrl: './tipos-preguntas.component.html',
  styleUrls: ['./tipos-preguntas.component.css']
})
export class TiposPreguntasComponent implements OnInit {

  @ViewChild(ModalTipoRespuestaComponent) modalComponent: ModalTipoRespuestaComponent;

  tipos_preguntas: TipoPregunta[];

  constructor(private service: TipoPreguntaService) {
    this.tipos_preguntas = [];
  }

  ngOnInit() {
    this.service.listar().subscribe(tps => {
      this.tipos_preguntas = tps;
    });
  }

  public recibirTiposHijo(tp: TipoPregunta[]) {
    this.tipos_preguntas = tp;
  }

  public enviarHijo(tp: TipoPregunta) {
    this.modalComponent.recibirPadreHijo(tp);
  }

}
