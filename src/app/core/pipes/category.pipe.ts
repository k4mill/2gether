import { Pipe, PipeTransform } from '@angular/core';
import { Category } from '../../shared/models/select/enums.model';

@Pipe({
  name: 'category',
  standalone: true,
})
export class CategoryPipe implements PipeTransform {
  transform(value: Category, ...args: unknown[]): string {
    let result = '';

    switch (value) {
      case Category.Romantic:
        result = 'Romantyczne';
        break;
      case Category.FoodAndDrink:
        result = 'Jedzenie i picie';
        break;
      case Category.CreativeArtistic:
        result = 'Kreatywne / artystyczne';
        break;
      case Category.Active:
        result = 'Aktywne';
        break;
      case Category.CultureEducation:
        result = 'Kultura / edukacja';
        break;
      case Category.AtHome:
        result = 'W domu';
        break;
      case Category.Seasonal:
        result = 'Sezonowe';
        break;
      case Category.EntertainmentSilly:
        result = 'Rozrywka / głupotki';
        break;
    }

    return result;
  }
}
