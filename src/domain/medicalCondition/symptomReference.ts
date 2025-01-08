import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { SymptomDescription } from '../Symptom/symptomDescription';

interface SymptomReferenceProps {
  value: string;
}

export class SymptomReference extends ValueObject<SymptomReferenceProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: SymptomReferenceProps) {
    super(props);
  }

  public static create(symp: SymptomDescription): Result<SymptomReference> {
    return Result.ok<SymptomReference>(new SymptomReference({ value: symp.value }));
  }
}