import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalCicloComponent } from '../../carreras/form-carrera/modal-ciclo/modal-ciclo.component';
import { ModalCriterioComponent } from './modal-criterio/modal-criterio.component';
import { Criterio } from 'src/app/models/criterio';
import { CriterioService } from 'src/app/services/criterio.service';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-criterios',
  templateUrl: './criterios.component.html',
  styleUrls: ['./criterios.component.css']
})
export class CriteriosComponent implements OnInit {


  @ViewChild(ModalCriterioComponent) modalComponent: ModalCriterioComponent;

  criterios: Criterio[];
  criterio: Criterio;

  constructor(private service: CriterioService, private localService: LocalService) {
    this.criterio = new Criterio();
    this.criterios = [];
  }

  ngOnInit() {
    this.service.listar(this.localService.getJsonValue('idP')).subscribe(c => {
      this.criterios = c;
    });
  }

  public recibirCriteriosHijo(c: Criterio[]) {
    this.criterios = c;
  }

  public enviarHijo(c: Criterio) {
    this.modalComponent.recibirPadreHijo(c);
  }

}
