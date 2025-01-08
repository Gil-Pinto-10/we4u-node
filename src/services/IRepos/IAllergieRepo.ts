
import { Repo } from "../../core/infra/Repo";
import { Allergie } from "../../domain/allergie/allergie";


export default interface IAllergieRepo extends Repo<Allergie> {
  findAll(): Promise<Allergie[]>;
  save(allergie: Allergie): Promise<Allergie>;
  findByCode(code: string): Promise<Allergie | null>;
  getAllAllergies(): Promise<Allergie[]>;
}