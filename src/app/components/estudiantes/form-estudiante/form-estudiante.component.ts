import { Component, OnInit } from '@angular/core';
import { Estudiante } from 'src/app/models/estudiante';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Direccion } from 'src/app/models/direccion';
import Swal from "sweetalert2";
import { NgxSpinnerService } from 'ngx-spinner';
import { RolService } from 'src/app/services/rol.service';
import { Rol } from 'src/app/models/rol';
import { Usuario } from 'src/app/models/usuario';
import { Carrera } from 'src/app/models/carrera';
import { CarreraService } from 'src/app/services/carrera.service';


@Component({
  selector: 'app-form-estudiante',
  templateUrl: './form-estudiante.component.html',
  styleUrls: ['./form-estudiante.component.css']
})
export class FormEstudianteComponent implements OnInit {


  estudiante: Estudiante;
  roles: Rol[];
  rol: Rol;
  carreras: Carrera[];
  carrera: Carrera;
  clave: string;
  username: string;


  constructor(private serviceCarrera: CarreraService, private rolService: RolService, private spinnerService: NgxSpinnerService, private service: EstudianteService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.estudiante = new Estudiante();
    this.estudiante.usuario = new Usuario();
    this.estudiante.usuario.roles = [];
    this.estudiante.direccion = new Direccion();
    this.rol = new Rol();
    this.carreras = [];
    this.carrera = new Carrera();
    this.username = null;
    this.clave = null;
  }

  ngOnInit() {
    this.spinnerService.show();

    this.serviceCarrera.listar().subscribe(c => {
      this.carreras = c;
    });

    this.activatedRoute.paramMap.subscribe(params => {
      const id: number = +params.get("id");
      if (id) {
        this.service.ver(id).subscribe(est => {
          this.estudiante = est;
          this.username = this.estudiante.usuario.username;
          if (this.estudiante.carrera_id != null) {
            this.serviceCarrera.ver(this.estudiante.carrera_id).subscribe(c => {
              this.carrera = c;
            });
          }

        });
      }
    });

    this.rolService.listar().subscribe(r => {
      this.roles = r;
      this.roles.forEach(rol => {
        if (rol.etiqueta == "Estudiante") {
          this.rol = rol;
        }
      });
    });


    setTimeout(() => {
      this.spinnerService.hide();
    }, 800);
  }

  public crear(): void {
    this.estudiante.usuario.roles.push(this.rol);
    this.spinnerService.show();
    this.estudiante.carrera_id = this.carrera.id;
    this.service.crear(this.estudiante).subscribe(
      est => {
        Swal.fire(
          "Nuevo Registro ",
          "Estudiante " + est.nombre + " <strong>Creado</strong> con exito",
          "success"
        );
        this.estudiante = new Estudiante();
        this.estudiante.usuario = new Usuario();
        this.estudiante.usuario.roles = [];
        this.estudiante.direccion = new Direccion();
      });
    this.spinnerService.hide();
  }

  public editar(): void {
    this.spinnerService.show();
    this.estudiante.usuario.roles.push(this.rol);
    if (this.clave != null) {
      this.estudiante.usuario.password = this.clave;
    } else {
      this.estudiante.usuario.password = null;
    }

    if (this.username != null) {
      this.estudiante.usuario.username = this.username;
    }

    this.service.editar(this.estudiante).subscribe(est => {
      Swal.fire(
        "Edicion",
        "Estudiante " + est.nombre + " <strong>Acualizado</strong> con exito",
        "success"
      );
      this.clave == null;
      this.username == null;
      this.router.navigate(["/estudiantes"]);
    })
    this.spinnerService.hide();
  }


  compararCarrera(o1: Carrera, o2: Carrera): boolean {

    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }



}
