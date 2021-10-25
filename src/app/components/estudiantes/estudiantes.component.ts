import { Component, OnInit, ViewChild } from "@angular/core";
import { Estudiante } from "src/app/models/estudiante";
import { EstudianteService } from "src/app/services/estudiante.service";
import { PageEvent, MatPaginator } from "@angular/material/paginator";
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: "app-estudiantes",
  templateUrl: "./estudiantes.component.html",
  styleUrls: ["./estudiantes.component.css"]
})
export class EstudiantesComponent implements OnInit {
  public titulo: string = "Listado de Estudiantes";
  estudiantes: Estudiante[];

  totalRegistros = 0;
  paginaActual = 0;
  totalPorPagina = 5;
  pageSizeOptions: number[] = [5, 10, 15, 25, 100];
  public cedula: string;



  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public authService: AuthService, private toastr: ToastrService, private spinnerService: NgxSpinnerService, private service: EstudianteService) {

  }

  ngOnInit() {
    this.spinnerService.show();
    // let pagActual = localStorage.getItem('paginaActual');
    //let totalPorPagina = localStorage.getItem('totalPorPagina');
    //this.paginaActual = parseInt(pagActual);
    //this.totalPorPagina = parseInt(totalPorPagina);

    //realiza la primera paginacion
    this.calcularRangos();

    //localStorage.removeItem('paginaActual');
    // localStorage.removeItem('totalPorPagina');





  }


  //cuando se hace click en el pie de la tabla para pagina, sellama a la base de datos
  paginar(event: PageEvent): void {
    this.paginaActual = event.pageIndex;
    this.totalPorPagina = event.pageSize;
    this.calcularRangos();

  }

  private calcularRangos() {
    this.service
      .listarPaginas(
        this.paginaActual.toString(),
        this.totalPorPagina.toString()
      )
      .subscribe(p => {
        this.estudiantes = p.content as Estudiante[];
        console.log(this.estudiantes);
        this.totalRegistros = p.totalElements as number;
        this.paginator._intl.itemsPerPageLabel = "Registros por pagina";
        this.paginator._intl.firstPageLabel = "Primera Página";
        this.paginator._intl.lastPageLabel = "Última Página";
        this.paginator._intl.nextPageLabel = "Siguiente";
        this.paginator._intl.previousPageLabel = "Atrás";
        //localStorage.setItem('paginaActual', this.paginaActual + "");
        //localStorage.setItem('totalPorPagina', this.totalPorPagina + "");
        this.spinnerService.hide();
      });
  }


  buscarCedula(): void {
    if (this.cedula == null) {
      this.toastr.error('Ingrese la cedula', 'Cedula');
    } else {
      this.service.buscarEstudiante(this.cedula).subscribe(e => {
        if (e != null) {
          this.estudiantes = [];
          this.estudiantes.push(e);
        } else {
          this.toastr.warning('No existe un estudiante con la cédula ingresada', 'Lo sentimos');
        }
      });
    }
  }

}


