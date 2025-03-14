/**
 * 2gether API
 *
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

export interface DateEventDetailsDto {
  /**
   * The id of the date event
   */
  id: number;
  /**
   * The title of the date event
   */
  title: string;
  /**
   * The description of the date event
   */
  description?: string;
  /**
   * The date the date event was added
   */
  date_added: string;
  /**
   * The date of completion of the date event
   */
  date_completion: string;
  /**
   * Whether the date event is a surprise
   */
  is_surprise: boolean;
  /**
   * The category of the date event
   */
  photo?: Uint8Array;
  /**
   * The category of the date event
   */
  categories: Array<number>;
  /**
   * Whether the date event is completed
   */
  completed: boolean;
}
