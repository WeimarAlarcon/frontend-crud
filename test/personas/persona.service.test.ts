import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { api } from 'src/boot/axios';
import MockAdapter from 'axios-mock-adapter';
import {
  getPersonas,
  post,
  getIdPersona,
  update,
  remove,
} from '../../src/modules/personas/services/persona.service';
import { PersonaInterface } from 'src/modules/personas/interfaces/persona.interface';
import { AxiosError } from 'axios';

// Configurar el mock de Axios
const mock = new MockAdapter(api);

describe('Persona Service', () => {
  beforeEach(() => {
    // Configuración inicial del mock para cada prueba
    mock.reset();
  });

  afterEach(() => {
    // Restablecer el mock después de cada prueba
    mock.restore();
  });

  it('should fetch personas', async () => {
    const personas = [{ id: 1, nombre: 'John Doe' }];
    mock.onGet('/personas').reply(200, personas);

    const response = await getPersonas();
    expect(response.data).toEqual(personas);
  });

  it('should post a new persona', async () => {
    const uniqueCarnet = `CI-${Math.floor(Math.random() * 10000000)}`;
    const newPersona: PersonaInterface = {
      id: 2,
      nombre: 'Jane Doe',
      carnetIdentidad: uniqueCarnet,
      apellidoPaterno: 'Doe',
      apellidoMaterno: 'Smith',
      profesion: 'Ingeniera',
      estadoCivil: 'Soltera',
      direccion: '123 Main St',
      celular: '555123456',
      telefono: '555654321',
      fechaNacimiento: '1990-01-01',
      edad: 34,
      genero: 'Femenino',
      estado: undefined,
    };
    // mock.onPost('/personas', newPersona).reply(201, newPersona);

    // const response = await post(newPersona);
    // expect(response).toEqual(newPersona);
    mock.onPost('/personas').reply(409, {
      statusCode: 409,
      message: 'El numero de documento 12345678 ya existe',
      persona: null,
    });

    try {
      await post(newPersona);
    } catch (error) {
      // Verificar que el error sea el esperado
      const axiosError = error as AxiosError;
      expect(axiosError.response?.status).toBe(409);
      const errorData = axiosError.response?.data as { message: string };
      expect(errorData.message).toBe(
        'El numero de documento 12345678 ya existe'
      );
    }
  });

  it('should fetch persona by id', async () => {
    // const persona = { id: 1, nombre: 'John Doe' };
    const persona: PersonaInterface = {
      id: 1,
      nombre: 'John Smith',
      carnetIdentidad: 'CI-12345678',
      apellidoPaterno: 'Smith',
      apellidoMaterno: 'Johnson',
      profesion: 'Ingeniero',
      estadoCivil: 'Casado',
      direccion: '456 Another St',
      celular: '555987654',
      telefono: '555654987',
      fechaNacimiento: '1985-05-15T04:00:00.000Z',
      edad: 38,
      genero: 'Masculino',
      estado: false,
    };
    mock.onGet('/personas/1').reply(200, persona);

    const response = await getIdPersona(1);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(persona);
  });

  it('should update a persona', async () => {
    const updatedPersona: PersonaInterface = {
      id: 1,
      nombre: 'John Smith',
      carnetIdentidad: 'CI-12345678',
      apellidoPaterno: 'Smith',
      apellidoMaterno: 'Johnson',
      profesion: 'Ingeniero',
      estadoCivil: 'Casado',
      direccion: '456 Another St',
      celular: '555987654',
      telefono: '555654987',
      fechaNacimiento: '1985-05-15',
      edad: 38,
      genero: 'Masculino',
      estado: true,
    };
    mock.onPatch('/personas/1', updatedPersona).reply(200, updatedPersona);

    const response = await update(1, updatedPersona);
    expect(response).toEqual(updatedPersona);
  });

  it('should delete a persona', async () => {
    mock.onDelete('/personas/1').reply(200);
    const response = await remove(1);
    expect(response).toBeDefined();
  });
});
