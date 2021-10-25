import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SolicitudMatricula } from 'src/app/models/solicitud-matricula';
import { SolicitudMatriculaService } from 'src/app/services/solicitud-matricula.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-correccion',
  templateUrl: './modal-correccion.component.html',
  styleUrls: ['./modal-correccion.component.css']
})
export class ModalCorreccionComponent implements OnInit {

  @Output()
  solicitudEnviar: EventEmitter<SolicitudMatricula> = new EventEmitter<SolicitudMatricula>();

  solicitud: SolicitudMatricula;

  observacionAnterior: string;
  constructor(private service: SolicitudMatriculaService) {
    this.solicitud = new SolicitudMatricula();
  }

  ngOnInit() {
  }


  public recibirPadreHijo(s: SolicitudMatricula) {
    this.solicitud = s;
    this.observacionAnterior = this.solicitud.observaciones;

  }

  guardar(): void {
    this.solicitud.tipo = "Corregir";
    this.service.editar(this.solicitud).subscribe(s => {
      this.solicitudEnviar.emit(s);
      Swal.fire('Correccion: ', 'Correcciones ingresadas con éxito', 'success');
    });
  }

  cancelar(): void {
    this.solicitud.observaciones = this.observacionAnterior;
  }
}
