import { Ciclo } from './ciclo';


export class Carrera {
    id: number;
    nombre: string;
    codigo: string;
    ciclos: Ciclo[];
    num_semanas: number;
}
