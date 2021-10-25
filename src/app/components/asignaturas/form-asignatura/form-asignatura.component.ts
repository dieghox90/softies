import { Component, OnInit } from '@angular/core';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { Asignatura } from 'src/app/models/asignatura';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { CarreraService } from 'src/app/services/carrera.service';
import { Carrera } from 'src/app/models/carrera';
import { Ciclo } from 'src/app/models/ciclo';
import { Paralelo } from 'src/app/models/paralelo';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-form-asignatura',
  templateUrl: './form-asignatura.component.html',
  styleUrls: ['./form-asignatura.component.css']
})
export class FormAsignaturaComponent implements OnInit {

  asignatura: Asignatura;
  carreras: Carrera[];
  carrera: Carrera;
  ciclo: Ciclo;
  paralelo: Paralelo;
  ciclos: Ciclo[];

  constructor(private service: AsignaturaService,
    private serviceCarrera: CarreraService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinnerService: NgxSpinnerService) {
    this.asignatura = new Asignatura();

    this.carreras = [];
    this.carrera = new Carrera();
    this.ciclo = new Ciclo();
    this.paralelo = new Paralelo();
    this.ciclos = [];

  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id: number = +params.get("id");
      if (id) {
        this.service.ver(id).subscribe(asig => {
          this.asignatura = asig;
          this.ciclo = asig.ciclo;
          this.carrera = asig.ciclo.carrera;
          // alert(this.carrera.nombre + " asdasd")

        });

      }
    });

    this.serviceCarrera.listar().subscribe(carr => {
      this.carreras = carr;
      this.carreras.forEach(c => {
        if (this.carrera.nombre === c.nombre) {
          this.carrera.ciclos = c.ciclos;
          //alert(this.carrera.nombre + " ciclos " + this.carrera.ciclos.length);
        }

      });

    });
  }




  compararCarrera(o1: Carrera, o2: Carrera): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }

  compararCiclo(o1: Ciclo, o2: Ciclo): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }

  public crear(): void {
    this.spinnerService.show();

    this.asignatura.ciclo = this.ciclo;
    this.service.crear(this.asignatura).subscribe(

      per => {

        Swal.fire(
          "Nuevo Registro ",
          "Asignatura " + this.asignatura.nombre + " <strong>Creado</strong> con exito",
          "success"
        );
        this.asignatura = new Asignatura();
        this.carrera = new Carrera();
        this.ciclo = new Ciclo();

      });
    setTimeout(() => {
      this.spinnerService.hide();
    }, 500);


  }

  public editar(): void {
    this.spinnerService.show();
    this.asignatura.ciclo = this.ciclo;
    this.service.editar(this.asignatura).subscribe(per => {
      Swal.fire(
        "Edicion",
        "Asignatura " + this.asignatura.nombre + " <strong>Acualizada</strong> con exito",
        "success"
      );
      this.router.navigate(["/asignaturas"]);
    });
    setTimeout(() => {
      this.spinnerService.hide();
    }, 500);
  }




}
