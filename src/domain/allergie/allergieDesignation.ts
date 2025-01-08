import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';

interface AllergieDesignationProps {
  [key: string]: string;
  value: string;
}

export class AllergieDesignation extends ValueObject<AllergieDesignationProps> {
  get value(): string {
    return this.props.value;
  }

  public constructor(props: AllergieDesignationProps) {
    super(props);
  }

  public static create(name: string): Result<AllergieDesignation> {
    if (name.length > 100)
      return Result.fail<AllergieDesignation>('Allergie designation must be 20 characters or less');

    return Result.ok<AllergieDesignation>(new AllergieDesignation({ value: name }));
  }
}