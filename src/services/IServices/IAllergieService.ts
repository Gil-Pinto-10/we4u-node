
import { IAllergieDTO } from "../../dto/IAllergieDTO";
import { Result } from '../../core/logic/Result';
import { Allergie } from "../../domain/allergie/allergie";


export default interface IAllergieService {

  createAllergie(AllergieDTO: IAllergieDTO): Promise<Result<IAllergieDTO>>;
  findByCode(code: string): Promise<Allergie | null>;
  getAllAllergies(): Promise<Result<IAllergieDTO[]>>;
  findAll(): Promise<Allergie[]>;  

  
}