import { TipoRespuesta } from './tipo-respuesta';

export class TipoPregunta {

    id: number;
    nombre: string;
    estado: boolean;
    tipo_respuestas: TipoRespuesta[];
    subtipo: string;
}
