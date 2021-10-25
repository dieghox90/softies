import { Criterio } from './criterio';
import { Pregunta } from './pregunta';

export class Subcriterio {

    id: number;
    nombre: string;
    descripcion: string;
    preguntas: Pregunta[];
    criterio: Criterio;
    numero_respondidas: number = 0;//es para la vista nomas
}
