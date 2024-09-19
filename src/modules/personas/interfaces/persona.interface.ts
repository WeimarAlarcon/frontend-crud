export interface PersonaInterface {
  id: number | null;
  carnetIdentidad: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  profesion: string;
  estadoCivil: string;
  direccion: string;
  celular: string;
  telefono: string;
  fechaNacimiento: string;
  edad: number | null;
  genero: string;
  estado: boolean | undefined | null;
}
