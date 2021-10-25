import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent, MatPaginator } from "@angular/material/paginator";
import Swal from "sweetalert2";
import { DocenteService } from 'src/app/services/docente.service';
import { Docente } from 'src/app/models/docente';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-docentes-inactivos',
  templateUrl: './docentes-inactivos.component.html',
  styleUrls: ['./docentes-inactivos.component.css']
})
export class DocentesInactivosComponent implements OnInit {

  titulo: string = "Docentes Activos";
  docentes: Docente[];


  totalRegistros = 0;
  paginaActual = 0;
  totalPorPagina = 5;
  pageSizeOptions: number[] = [5, 10, 15, 25, 100];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private spinnerService: NgxSpinnerService, private service: DocenteService) { }

  ngOnInit() {
    this.spinnerService.show();
    let pagActual = localStorage.getItem('paginaActual');
    let totalPorPagina = localStorage.getItem('totalPorPagina');
    this.paginaActual = parseInt(pagActual);
    this.totalPorPagina = parseInt(totalPorPagina);

    //realiza la primera paginacion
    this.calcularRangos();

    localStorage.removeItem('paginaActual');
    localStorage.removeItem('totalPorPagina');

    setTimeout(() => {
      this.spinnerService.hide();
    }, 800);
  }

  //cuando se hace click en el pie de la tabla para pagina, sellama a la base de datos
  paginar(event: PageEvent): void {
    this.paginaActual = event.pageIndex;
    this.totalPorPagina = event.pageSize;
    this.calcularRangos();

  }

  private calcularRangos() {
    this.service
      .listarInactivos(
        this.paginaActual.toString(),
        this.totalPorPagina.toString()
      )
      .subscribe(p => {
        this.docentes = p.content as Docente[];
        this.totalRegistros = p.totalElements as number;
        this.paginator._intl.itemsPerPageLabel = "Registros por pagina";
        localStorage.setItem('paginaActual', this.paginaActual + "");
        localStorage.setItem('totalPorPagina', this.totalPorPagina + "");

      });
  }


  public activar(docente: Docente): void {
    this.spinnerService.show();
    Swal.fire({
      title: "ACTIVACION",
      html: "¿Desea activar nuevamente a <strong>" + docente.nombre + " " + docente.apellido + "</strong>?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "SI"
    }).then(result => {
      if (result.value) {
        this.service.activar(docente).subscribe(() => {
          this.calcularRangos();
          Swal.fire({
            title: "ACTIVADO: ",
            html: "Docente <strong>" + docente.nombre + " " + docente.apellido + "</strong> activado con exito",
            icon: "success"
          });
        });
      }
    });
    this.spinnerService.hide();
  }


}
