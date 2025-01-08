import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Mapper } from "../core/infra/Mapper";
import { Document, Model } from "mongoose";

import { MedicalCondition } from "../domain/medicalCondition/medicalCondition";
import { IMedicalConditionDTO } from "../dto/IMedicalConditionDTO";
import { IMedicalConditionPersistence } from "../dataschema/IMedicalConditionPersistence";
import { SymptomDescription } from "../domain/Symptom/symptomDescription";
import { SymptomsSet } from "../domain/medicalCondition/symptomsSet";
import ISymptomRepo from "../services/IRepos/ISymptomRepo";
import { MedicalConditionCode } from "../domain/medicalCondition/medicalConditionCode";
import { MedicalConditionDesignation } from "../domain/medicalCondition/medicalConditionDesignation";
import { MedicalConditionDescription } from "../domain/medicalCondition/medicalConditionDescription";

export class MedicalConditionMapper extends Mapper<MedicalCondition> {
    public static toDTO(medicalCondition: MedicalCondition): IMedicalConditionDTO {
        return {
          code: medicalCondition.code.value,
          designation: medicalCondition.designation.value,
          description: medicalCondition.description?.value,
          symptoms: medicalCondition.symptoms.values.map(symptom => symptom.value)
        };
      }

      public static async toDomain (medicalCondition: any | Model<IMedicalConditionPersistence & Document> ): Promise<MedicalCondition | null> {
        const code = MedicalConditionCode.create(medicalCondition.code).getValue();
    const designation = MedicalConditionDesignation.create(medicalCondition.designation).getValue();
    const description = medicalCondition.description
      ? MedicalConditionDescription.create(medicalCondition.description).getValue()
      : undefined;

    const symptomsSetResult = SymptomsSet.create(
      medicalCondition.symptoms.map((symptom: string) => new SymptomDescription({ value: symptom }))
    );

    if (symptomsSetResult.isFailure) {
      console.log(symptomsSetResult.error);
      return null;
    }

    const medicalConditionOrError = MedicalCondition.create(
      {
        code,
        designation,
        description,
        symptoms: symptomsSetResult.getValue()
      },
      new UniqueEntityID(medicalCondition.domainId)
    );

    return medicalConditionOrError.isSuccess ? medicalConditionOrError.getValue() : null;
  }
      public static toPersistence(medicalCondition: MedicalCondition): any {
        return {
          domainId: medicalCondition.id.toString(),
          code: medicalCondition.code.value,
          designation: medicalCondition.designation.value,
          description: medicalCondition.description?.value,
          symptoms: medicalCondition.symptoms.values.map(symptom => symptom.value)
        };
      }


    }
