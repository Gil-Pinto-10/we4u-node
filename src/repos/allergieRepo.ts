import { IAllergiePersistence } from "../dataschema/IAllergiePersistence";
import { Allergie } from "../domain/allergie/allergie";
import { AllergieMapper } from "../mappers/AllergieMapper";

import allergieSchema from "../persistence/schemas/allergieSchema";
import IAllergieRepo from "../services/IRepos/IAllergieRepo";

import { Document, FilterQuery, Model } from "mongoose";
import { Service, Inject } from 'typedi';

@Service()
export default class AllergieRepo implements IAllergieRepo {
  private models: any;

  constructor(
    @Inject('allergieSchema') private allergieSchema : Model<IAllergiePersistence & Document>,
  ) {}

    public async findAll(): Promise<Allergie[]> {
      try {
        const allergieRecords = await this.allergieSchema.find();
        const allergiePromises = allergieRecords.map(record => AllergieMapper.toDomain(record));
        return Promise.all(allergiePromises);
      } catch (e) {
        throw e;
      }
    }
     public async getAllAllergies(): Promise<Allergie[]> {
        const allergieDocuments = await this.allergieSchema.find();
        const allergies = await Promise.all(allergieDocuments.map(doc => AllergieMapper.toDomain(doc)));
        return allergies;
      }

    public async findByCode(code: string): Promise<Allergie | null> {
      const query = { code } as FilterQuery<IAllergiePersistence & Document>;
      const allergieDocument = await this.allergieSchema.findOne(query);
  
      if (allergieDocument) {
        return AllergieMapper.toDomain(allergieDocument);
      } else {
        return null;
      }
    }

  public async save(allergie: Allergie): Promise<Allergie>  {
    const query = { domainId: allergie.id.toString()} as FilterQuery<IAllergiePersistence & Document>;

    const allergieDocument = await this.allergieSchema.findOne( query );

    try {
      if (allergieDocument === null ) {
        const rawAllergie: any = AllergieMapper.toPersistence(allergie);

        const roleCreated = await this.allergieSchema.create(rawAllergie);

        const allergieNew =  AllergieMapper.toDomain(roleCreated);
        if(allergieNew==null){
          throw new Error('Failed to map allergie to domain');
        }

        return allergieNew;

      } else {
        allergieDocument.description = allergie.description?.value;
        allergieDocument.code = allergie.code.value;
        allergieDocument.designation = allergie.designation.value;
        await allergieDocument.save();

        return allergie;
      }
    } catch (err) {
      throw err;
    }
  }

 
  public async exists(t: Allergie): Promise<boolean> {
       const idX = t.id;

    const query = { domainId: idX };
    const deviceDocument = await allergieSchema.findOne(
      query as FilterQuery<IAllergiePersistence & Document>
    );

    return !!deviceDocument;
  }

 

}
