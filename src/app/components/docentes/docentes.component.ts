import { Component, OnInit, ViewChild } from '@angular/core';
import { Docente } from 'src/app/models/docente';
import { DocenteService } from 'src/app/services/docente.service';
import { PageEvent, MatPaginator } from "@angular/material/paginator";
import Swal from "sweetalert2";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-docentes',
  templateUrl: './docentes.component.html',
  styles: []
})
export class DocentesComponent implements OnInit {
  titulo: string = "Docentes Activos";
  docentes: Docente[];


  totalRegistros = 0;
  paginaActual = 0;
  totalPorPagina = 5;
  pageSizeOptions: number[] = [5, 10, 15, 25, 100];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private spinnerService: NgxSpinnerService, private service: DocenteService) { 
  }

  ngOnInit() {
    this.spinnerService.show();

    //realiza la primera paginacion
    this.calcularRangos();
    

    
  }

  //cuando se hace click en el pie de la tabla para pagina, sellama a la base de datos
  paginar(event: PageEvent): void {
    this.paginaActual = event.pageIndex;
    this.totalPorPagina = event.pageSize;
    this.calcularRangos();

  }

  private calcularRangos() {
    this.service
      .listarActivos(
        this.paginaActual.toString(),
        this.totalPorPagina.toString()
      )
      .subscribe(p => {
        this.docentes = p.content as Docente[];
        this.totalRegistros = p.totalElements as number;
        this.paginator._intl.itemsPerPageLabel = "Registros por pagina";
        this.spinnerService.hide();
      });
  }

  public eliminar(docente: Docente): void {
    
    Swal.fire({
      title: "INACTIVACIÓN",
      html: "¿Desea inactivar a <strong>" + docente.nombre + " " + docente.apellido + "</strong>?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "SI"
    }).then(result => {
      if (result.value) {
        this.spinnerService.show();
        this.service.inactivar(docente).subscribe(() => {
          this.calcularRangos();
          Swal.fire({
            title: "INACTIVADO: ",
            html: "Docente <strong>" + docente.nombre + " " + docente.apellido + "</strong> inactivado con exito",
            icon: "success"
          });
          this.spinnerService.hide();
        });
      }
    });
  
  }



}
