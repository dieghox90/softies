import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CriterioService } from 'src/app/services/criterio.service';
import { Criterio } from 'src/app/models/criterio';
import { Subcriterio } from 'src/app/models/subcriterio';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalService } from 'src/app/services/local.service';


@Component({
  selector: 'app-modal-criterio',
  templateUrl: './modal-criterio.component.html',
  styleUrls: ['./modal-criterio.component.css']
})
export class ModalCriterioComponent implements OnInit {

  @Output()
  criteriosEnviar: EventEmitter<Criterio[]> = new EventEmitter<Criterio[]>();

  criterio: Criterio;
  criterios: Criterio[];
  subcriterio: Subcriterio;
  subcriterios: Subcriterio[];

  constructor(private localService: LocalService, private spinnerService: NgxSpinnerService, private service: CriterioService) {
    this.criterio = new Criterio();
    this.criterios = [];
    this.criterio.subcriterios = [];
    this.subcriterio = new Subcriterio();
    this.subcriterios = [];
  }

  ngOnInit() {

  }


  public crear(): void {
    this.spinnerService.show();
    this.service.crear(this.criterio).subscribe(

      cri => {
        Swal.fire(
          "Nuevo Criterio",
          "Criterio " + cri.nombre + " <strong>Creada</strong> con exito",
          "success"
        );
        this.criterio = new Criterio();
        this.criterio.subcriterios = [];
        this.service.listar(this.localService.getJsonValue('idP')).subscribe(c => {
          this.criterios = c;
          this.criteriosEnviar.emit(this.criterios);
        });
      });
    this.spinnerService.hide();
  }

  public editar(): void {
    this.spinnerService.show();
    this.service.editar(this.criterio).subscribe(
      cla => {
        Swal.fire(
          "Edicion",
          "Criterio " + this.criterio.nombre + " <strong>Editado</strong> con éxito",
          "success"
        );
        this.criterio = new Criterio();
        this.service.listar(this.localService.getJsonValue('idP')).subscribe(c => {
          this.criterios = c;
          this.criteriosEnviar.emit(this.criterios);
        });
      });
    this.spinnerService.hide();
  }


  public agregar(): void {

    this.criterio.subcriterios.push(this.subcriterio);
    this.subcriterio = new Subcriterio();
  }

  public recibirPadreHijo(c: Criterio) {
    this.criterio = c;

  }

  public eliminar(sub: Subcriterio): void {
    this.spinnerService.show();
    Swal.fire({
      title: 'Eliminación',
      html: `¿Seguro que desea eliminar al subcriterio <strong>  ${sub.nombre}?</strong>`,
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

        this.service.eliminar_subcriterio(sub.id).subscribe(
          () => {
            this.criterio.subcriterios = this.criterio.subcriterios.filter(s => s.id !== sub.id)
            Swal.fire(
              'Subcriterio Eliminado!',
              `Subcriterio ${sub.nombre} eliminado con éxito.`,
              'success'
            )
          }
        )

      }
    });

    this.spinnerService.hide();
  }
}
