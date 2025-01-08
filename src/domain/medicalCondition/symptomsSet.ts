import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { SymptomReference } from './symptomReference';
import { SymptomDescription } from '../Symptom/symptomDescription';

interface SymptomsSetProps {
  values: SymptomReference[];
}

export class SymptomsSet extends ValueObject<SymptomsSetProps> {
  get values(): SymptomReference[] {
    return this.props.values;
  }

  private constructor(props: SymptomsSetProps) {
    super(props);
  }

  public static create(initialValues: SymptomDescription[] = []): Result<SymptomsSet> {
    if (!Array.isArray(initialValues) || !initialValues.every((val) => val instanceof SymptomDescription)) {
      return Result.fail<SymptomsSet>("Something wrong happened on the symptoms set.");
    }

    const symptomReferences = initialValues.map(val => SymptomReference.create(val).getValue());
    return Result.ok<SymptomsSet>(new SymptomsSet({ values: symptomReferences }));
  }

  public addSymptom(symptomDescription: SymptomDescription): Result<void> {
    if (!(symptomDescription instanceof SymptomDescription)) {
      return Result.fail<void>("Invalid symptom description.");
    }

    const symptomReferenceResult = SymptomReference.create(symptomDescription);
    if (symptomReferenceResult.isFailure) {
      return Result.fail<void>(symptomReferenceResult.error);
    }

    this.props.values.push(symptomReferenceResult.getValue());
    return Result.ok<void>();
  }
}