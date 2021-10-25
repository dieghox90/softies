import { Direccion } from './direccion';
import { Matricula } from './matricula';
import { Usuario } from './usuario';

export class Estudiante {
  id: number;
  nombre: string;
  apellido: string;
  cedula: string;
  direccion: Direccion;
  matriculas: Matricula[];
  usuario: Usuario;
  carrera_id: number;
  correo: string;
  celular: string;


  fullName(): string {
    return this.apellido + ' ' + this.nombre;
  }

}
