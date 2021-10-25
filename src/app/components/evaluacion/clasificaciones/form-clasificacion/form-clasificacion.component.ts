import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Clasificacion } from 'src/app/models/clasificacion';
import { ClasificacionService } from 'src/app/services/clasificacion.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-form-clasificacion',
  templateUrl: './form-clasificacion.component.html',
  styleUrls: ['./form-clasificacion.component.css']
})
export class FormClasificacionComponent implements OnInit {

  @Output()
  clasificacionesEnviar: EventEmitter<Clasificacion[]> = new EventEmitter<Clasificacion[]>();

  clasificacion: Clasificacion;
  clasificacaciones: Clasificacion[];

  constructor(private spinnerService: NgxSpinnerService, private service: ClasificacionService) {
    this.clasificacion = new Clasificacion();
  }

  ngOnInit() {
  }


  public crear(): void {
    this.spinnerService.show();
    this.service.crear(this.clasificacion).subscribe(
      cla => {
        Swal.fire(
          "Nueva Clasificación",
          "Clasificación " + this.clasificacion.nombre + " <strong>Creada</strong> con exito",
          "success"
        );
        this.clasificacion = new Clasificacion();
        this.service.listar().subscribe(c => {
          this.clasificacaciones = c;
          this.clasificacionesEnviar.emit(this.clasificacaciones);
        });
      });
    this.spinnerService.hide();
  }

  public editar(): void {
    this.spinnerService.show();
    this.service.editar(this.clasificacion).subscribe(
      cla => {
        Swal.fire(
          "Edicion",
          "Clasificación " + this.clasificacion.nombre + " <strong>Editada</strong> con éxito",
          "success"
        );
        this.clasificacion = new Clasificacion();
        this.service.listar().subscribe(c => {
          this.clasificacaciones = c;
          this.clasificacionesEnviar.emit(this.clasificacaciones);
        });
      });
    this.spinnerService.hide();
  }

  public recibirPadreHijo(c: Clasificacion) {
    this.clasificacion = c;
  }
}