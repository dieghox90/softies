import { Ciclo } from './ciclo';

export class Asignatura {
    id: number;
    nombre: string;
    numero_autonomos: number;
    numero_docencia: number;
    numero_experimentacion: number;
    estado: boolean;
    ciclo: Ciclo;
    etiqueta: string;

    //no esta mapeada, se ultilza solo para los checkBox
    estado_asig_mat: boolean;

    public Asignatura() {
        this.estado_asig_mat = false;
    }




}
