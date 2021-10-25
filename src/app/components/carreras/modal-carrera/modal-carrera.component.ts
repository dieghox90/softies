import { Component, OnInit } from '@angular/core';
import { Carrera } from 'src/app/models/carrera';

@Component({
  selector: 'app-modal-carrera',
  templateUrl: './modal-carrera.component.html',
  styleUrls: ['./modal-carrera.component.css']
})
export class ModalCarreraComponent implements OnInit {
  carrera: Carrera;



  constructor() {
    this.carrera = new Carrera();
  }

  ngOnInit() {

  }

  fijarCarrera(c: Carrera) {
    this.carrera = c;
  }


}
