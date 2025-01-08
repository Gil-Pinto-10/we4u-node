import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';

interface AllergieDescriptionProps {
  [key: string]: string;
  value: string;
}

export class AllergieDescription extends ValueObject<AllergieDescriptionProps> {
  get value(): string {
    return this.props.value;
  }

  public constructor(props: AllergieDescriptionProps) {
    super(props);
  }

  public static create(description: string): Result<AllergieDescription> {
    if (description.length > 2048)
      return Result.fail<AllergieDescription>(
        'Allergie description must be 255 characters or less'
      );
    return Result.ok<AllergieDescription>(new AllergieDescription({ value: description }));
  }
}