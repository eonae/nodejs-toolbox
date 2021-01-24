import { Format } from '../serializer.class';

export class UnknownFormatError {
  message: string;

  constructor (format: Format) {
    this.message = `Format <${format} is not recognized by the serializer.>`;
  }
}
