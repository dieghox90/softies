import { Subcriterio } from './subcriterio';

export class Criterio {

    id: number;
    nombre: string;
    descripcion: string;
    subcriterios: Subcriterio[];


    periodo_id: number;

    //esta variable solo es para vista
    totalPreguntas: string;

    /*calcularGranTotal(): number {

        this.totalPreguntas = 0;
        this.subcriterios.forEach(s => {
            this.totalPreguntas += s.preguntas.length;
        });
        return this.totalPreguntas;

    }*/
}
