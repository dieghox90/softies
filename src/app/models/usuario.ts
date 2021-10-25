import { Rol } from './rol';
import { Docente } from './docente';
import { Estudiante } from './estudiante';

export class Usuario {
    id: number;
    username: string;
    enabled: boolean;
    nombre: string;
    password: string;
    roles: Rol[];
    completo: string;
    docente: Docente;
    estudiante: Estudiante;

    rolesAuth: String[] = [];
    index: number; //id del usuario logueado ya sea docente o estudiante

}
