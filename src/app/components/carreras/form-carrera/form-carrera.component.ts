import { Component, OnInit, ViewChild } from '@angular/core';
import { Carrera } from 'src/app/models/carrera';
import { CarreraService } from 'src/app/services/carrera.service';
import Swal from 'sweetalert2';
import { Ciclo } from 'src/app/models/ciclo';
import { Router, ActivatedRoute } from '@angular/router';
import { TooltipPosition } from '@angular/material/tooltip';
import { FormControl } from '@angular/forms';
import { ModalCicloComponent } from './modal-ciclo/modal-ciclo.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-form-carrera',
  templateUrl: './form-carrera.component.html',
  styleUrls: ['./form-carrera.component.css']
})
export class FormCarreraComponent implements OnInit {

  carrera: Carrera;

  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[2]);

  @ViewChild(ModalCicloComponent, { static: true }) modalComponent: ModalCicloComponent;

  constructor(private spinnerService: NgxSpinnerService, private service: CarreraService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.carrera = new Carrera();
    this.carrera.ciclos = [];
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id: number = +params.get("id");
      if (id) {
        this.service.ver(id).subscribe(c => {
          this.carrera = c;
        });
      } else {
        // localStorage.removeItem('paginaActual');
      }
    });
  }

  public crear(): void {
    this.spinnerService.show();
    this.service.crear(this.carrera).subscribe(
      carrera => {
        Swal.fire(
          "Nuevo Registro ",
          "Carrera " + carrera.nombre + " <strong>Creada</strong> con exito",
          "success"
        );
        this.carrera = new Carrera();
        this.carrera.ciclos = [];

      });
    this.spinnerService.hide();
  }

  public editar(): void {
    this.spinnerService.show();
    this.service.editar(this.carrera).subscribe(est => {
      Swal.fire(
        "Edicion",
        "Carrera " + est.nombre + " <strong>Acualizada</strong> con exito",
        "success"
      );
      this.router.navigate(["/carreras"]);
    })
    this.spinnerService.hide();
  }

  //esto viene del hijo
  public recibirCiclo(ciclo: Ciclo): void {
    this.carrera.ciclos.push(ciclo);
  }


  public irModal(ciclo: Ciclo): void {
    this.modalComponent.fijarCiclo(ciclo);
  }
}
