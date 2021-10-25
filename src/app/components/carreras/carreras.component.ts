import { Component, OnInit, ViewChild } from '@angular/core';
import { Carrera } from 'src/app/models/carrera';
import { CarreraService } from 'src/app/services/carrera.service';


import { ModalCarreraComponent } from './modal-carrera/modal-carrera.component';

import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-carreras',
  templateUrl: './carreras.component.html',
  styleUrls: ['./carreras.component.css']
})
export class CarrerasComponent implements OnInit {

  titulo: string = "CARRERAS"
  carreras: Carrera[];

  @ViewChild(ModalCarreraComponent, { static: true }) modalComponent: ModalCarreraComponent;

  constructor(private spinnerService: NgxSpinnerService, private service: CarreraService) { }

  ngOnInit() {
    this.spinnerService.show();
    this.service.listar().subscribe(c => {
      this.carreras = c;
      this.spinnerService.hide();
    });

  }


  public irModal(carrera: Carrera): void {
    this.modalComponent.fijarCarrera(carrera);
  }

}
