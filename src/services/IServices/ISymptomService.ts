

import { Result } from '../../core/logic/Result';
import { ISymptomDTO } from "../../dto/ISymptomDTO";


export default interface ISymptomService {

  createSymptom(SymptomDTO: ISymptomDTO): Promise<Result<ISymptomDTO>>;
  getAllSymptoms(): Promise<Result<ISymptomDTO[]>>;
}