import { PipeTransform } from '@angular/core';
import { SelectOption } from '../models/select/select-option.model';

export const mapEnumToOptions = <T extends object>(
  enumObject: T,
  pipe?: PipeTransform,
): SelectOption<T>[] => {
  return Object.values(enumObject)
    .filter((x) => !isNaN(x))
    .map((key) => {
      return <SelectOption<T>>{
        label: pipe ? pipe.transform(key) : key,
        value: key,
      };
    });
};
