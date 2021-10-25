import { Carrera } from './carrera';
import { Paralelo } from './paralelo';
import { Asignatura } from './asignatura';

export class Ciclo {
    id: number;
    peso: number;
    nombre: string;
    codigo: string;
    carrera: Carrera;
    paralelos: Paralelo[];
    asignaturas: Asignatura[];
}
