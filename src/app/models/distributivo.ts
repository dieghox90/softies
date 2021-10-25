import { CargaHoraria } from './carga-horaria';
import { Periodo } from './periodo';

export class Distributivo {

    id: number;
    create_at: string;
    documento: string;
    estado: boolean;
    cargas_horarias: CargaHoraria[];
    periodo: Periodo;

}
