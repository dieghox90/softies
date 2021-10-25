import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TipoPregunta } from 'src/app/models/tipo-pregunta';
import { TipoRespuesta } from 'src/app/models/tipo-respuesta';
import { TipoPreguntaService } from 'src/app/services/tipo-pregunta.service';
import Swal from 'sweetalert2';
import { Pregunta } from 'src/app/models/pregunta';

@Component({
  selector: 'app-modal-tipo-respuesta',
  templateUrl: './modal-tipo-respuesta.component.html',
  styleUrls: ['./modal-tipo-respuesta.component.css']
})
export class ModalTipoRespuestaComponent implements OnInit {


  @Output()
  tiposEnviar: EventEmitter<TipoPregunta[]> = new EventEmitter<TipoPregunta[]>();

  tipo_pregunta: TipoPregunta;
  tipos_preguntas: TipoPregunta[];
  tipo_respuesta: TipoRespuesta;

  constructor(private service: TipoPreguntaService) {
    this.tipos_preguntas = [];
    this.tipo_pregunta = new TipoPregunta();
    this.tipo_respuesta = new TipoRespuesta();
    this.tipo_pregunta.tipo_respuestas = [];
  }

  ngOnInit() {
  }


  public crear(): void {
    console.log(this.tipo_pregunta);
    this.service.crear(this.tipo_pregunta).subscribe(


      tp => {
        Swal.fire(
          "Creación",
          "Tipo de pregunta " + tp.nombre + " <strong>Creada</strong> con exito",
          "success"
        );
        this.tipo_pregunta = new TipoPregunta();
        this.tipo_pregunta.tipo_respuestas = [];
        this.service.listar().subscribe(tp => {
          this.tipos_preguntas = tp;
          this.tiposEnviar.emit(this.tipos_preguntas);
        });

      });
  }

  public editar(): void {
    this.service.editar(this.tipo_pregunta).subscribe(

      tp => {
        Swal.fire(
          "Edición",
          "Tipo de pregunta " + tp.nombre + " <strong>Editada</strong> con éxito",
          "success"
        );
        this.tipo_pregunta = new TipoPregunta();
        this.tipo_pregunta.tipo_respuestas = [];
        this.service.listar().subscribe(tp => {
          this.tipos_preguntas = tp;
          this.tiposEnviar.emit(this.tipos_preguntas);
        });

      });
  }


  public eliminar(tr: TipoRespuesta): void {
    Swal.fire({
      title: 'Eliminación',
      html: `¿Seguro que desea eliminar a la respuesta <strong>  ${tr.nombre}?</strong>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      buttonsStyling: true,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.service.eliminar_tipo_respuesta(tr.id).subscribe(
          () => {
            this.tipo_pregunta.tipo_respuestas = this.tipo_pregunta.tipo_respuestas.filter(s => s.id !== tr.id)
            Swal.fire(
              'Respuesta Eliminada!',
              `Respuesta ${tr.nombre} eliminada con éxito.`,
              'success'
            )
          }
        )

      }
    });


  }


  public recibirPadreHijo(tp: TipoPregunta) {
    this.tipo_pregunta = tp;

  }


  public agregar(): void {
    this.tipo_pregunta.tipo_respuestas.push(this.tipo_respuesta);
    this.tipo_respuesta = new TipoRespuesta();
  }
}
