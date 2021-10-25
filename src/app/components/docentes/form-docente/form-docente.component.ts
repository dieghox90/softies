import { Component, OnInit } from '@angular/core';
import { DocenteService } from 'src/app/services/docente.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Docente } from 'src/app/models/docente';
import { Direccion } from 'src/app/models/direccion';
import Swal from "sweetalert2";
import { NgxSpinnerService } from 'ngx-spinner';
import { RolService } from 'src/app/services/rol.service';
import { Rol } from 'src/app/models/rol';
import { Usuario } from 'src/app/models/usuario';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-form-docente',
  templateUrl: './form-docente.component.html',
  styleUrls: ['./form-docente.component.css']
})
export class FormDocenteComponent implements OnInit {

  docente: Docente;
  roles: Rol[];
  rolesSeleccionados: Rol[];
  errores: string[];
  clave: string;
  username: string;

  constructor(private rolService: RolService, private spinnerService: NgxSpinnerService, private service: DocenteService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.docente = new Docente();
    this.docente.direccion = new Direccion();
    this.roles = [];
    this.rolesSeleccionados = [];
    this.docente.usuario = new Usuario();
    this.docente.usuario.roles = [];
    this.errores = [];
    this.clave = null;
    this.username = null;
  }

  ngOnInit() {
    this.spinnerService.show();
    this.activatedRoute.paramMap.subscribe(params => {
      const id: number = +params.get("id");
      if (id) {
        this.service.ver(id).subscribe(docente => {
          this.docente = docente;
          this.username = this.docente.usuario.username;
          this.rolService.listar().subscribe(ro => {
            this.roles = ro;
            this.docente.usuario.roles.forEach(r => {
              this.roles.forEach(rol => {
                if (r.id == rol.id) {
                  rol.estado = true;
                  this.rolesSeleccionados.push(rol);
                }
              });

            });
          });


        });
      } else {
        this.rolService.listar().subscribe(ro => {
          this.roles = ro;
        });
      }
    });



    setTimeout(() => {
      this.spinnerService.hide();
    }, 800);
  }


  public crear(): void {

    this.spinnerService.show();
    this.docente.usuario.roles = this.rolesSeleccionados;
    this.docente.usuario.username = this.docente.cedula;
    this.service.crear(this.docente)
      .subscribe(
        doc => {
          this.router.navigate(['/clientes']);
          Swal.fire('Nuevo cliente', `El cliente ${doc.nombre} ha sido creado con éxito`, 'success');
          this.docente = new Docente();
          this.docente.usuario = new Usuario();
          this.docente.usuario.roles = [];
          this.rolesSeleccionados = [];
          this.docente.direccion = new Direccion();
          this.rolesSeleccionados = [];
        },
        err => {
          this.errores = err.error.errors as string[];
          Swal.fire('Error', `Problema: ${err.error.mensaje}`, 'error');
          console.error('Código del error desde el backend: ' + err.status);
          console.error(err.error.errors);
        }
      );
    this.spinnerService.hide();

  }

  public editar(): void {
    this.spinnerService.show();

    this.docente.usuario.roles = this.rolesSeleccionados;

    if (this.username != null) {
      this.docente.usuario.username = this.username;
    }

    if (this.clave != null) {
      this.docente.usuario.password = this.clave;
    } else {
      this.docente.usuario.password = null;
    }

    this.service.editar(this.docente).subscribe(est => {
      Swal.fire(
        "Edicion",
        "Docente " + est.nombre + " <strong>Acualizado</strong> con exito",
        "success"
      );
      this.rolesSeleccionados = [];
      this.docente = new Docente();
      this.docente.usuario = new Usuario();
      this.docente.usuario.roles = [];
      this.username = null;
      this.clave = null;
      this.router.navigate(["/docentes"]);
    })
    this.spinnerService.hide();
  }



  seleccionarRol(event: any, rol: Rol) {
    if (event.currentTarget.checked) {
      this.rolesSeleccionados.push(rol);
    } else {
      let index = this.rolesSeleccionados.indexOf(rol);
      this.rolesSeleccionados.splice(index, 1);
    }
    console.log(this.rolesSeleccionados);
  }



  public inactivar(): void {

  }
}
