/*
 * Datos de la emisora y de la programacion.
 * DATOS DE PRUEBA: programas, presentadores, telefonos y correos son ficticios.
 * La parrilla semanal se calcula a partir de las franjas de cada programa.
 */

export const radio = {
  nombre: 'Mínima FM',
  frecuencia: '97.9',
  lema: '…somos tu voz.',
  zona: 'Valle de Güímar, Tenerife',
  descripcion:
    'La radio del Valle de Güímar. Música, información local y las voces de nuestros vecinos, las 24 horas del día.',
  stream: 'https://stream-176.zeno.fm/fjmbxsddqv1uv',
  // Contacto (de prueba)
  telefono: '922 000 000',
  whatsapp: '600 000 000',
  correo: 'hola@minimafm.example',
  direccion: 'Plaza de San Pedro, 1. 38500 Güímar, Santa Cruz de Tenerife',
  redes: [
    { nombre: 'Facebook', url: 'https://www.facebook.com/' },
    { nombre: 'Instagram', url: 'https://www.instagram.com/' },
  ],
};

/** Dias de la semana, empezando en lunes (indice 0). */
export const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] as const;

export type Franja = { dias: number[]; inicio: string; fin: string };

export type Programa = {
  id: string;
  nombre: string;
  presentador: string;
  categoria: 'Actualidad' | 'Música' | 'Deportes' | 'Tradición' | 'Comunidad';
  descripcion: string;
  /** Secciones habituales del programa */
  secciones: string[];
  franjas: Franja[];
};

const LV = [0, 1, 2, 3, 4];

export const programas: Programa[] = [
  {
    id: 'buenos-dias-valle',
    nombre: 'Buenos días, Valle',
    presentador: 'Carmen Delgado',
    categoria: 'Actualidad',
    descripcion:
      'El despertador del Valle: noticias de la comarca, el tiempo, el estado de las carreteras y buena música para empezar el día.',
    secciones: ['El tiempo en el Valle', 'Así están las carreteras', 'La entrevista de las 9'],
    franjas: [{ dias: LV, inicio: '07:00', fin: '10:00' }],
  },
  {
    id: 'la-hora-del-mercado',
    nombre: 'La hora del mercado',
    presentador: 'Juan Pedro Rodríguez',
    categoria: 'Comunidad',
    descripcion:
      'Productos de temporada, recetas de la tierra y charlas con los agricultores y comercios del municipio.',
    secciones: ['Producto de la semana', 'La receta de la abuela', 'Precios del mercadillo'],
    franjas: [{ dias: LV, inicio: '10:00', fin: '11:00' }],
  },
  {
    id: 'raices',
    nombre: 'Raíces',
    presentador: 'Nieves Hernández',
    categoria: 'Tradición',
    descripcion:
      'Folclore canario, isas, folías y malagueñas. Un recorrido por la música tradicional de las islas y sus parrandas.',
    secciones: ['Folías y malagueñas', 'La parranda invitada', 'Historias del timple'],
    franjas: [{ dias: [0, 2, 4], inicio: '11:00', fin: '13:00' }],
  },
  {
    id: 'cafe-con-historia',
    nombre: 'Café con historia',
    presentador: 'Rosa Alonso',
    categoria: 'Comunidad',
    descripcion:
      'Los mayores del Valle nos cuentan cómo era la vida antes: oficios, fiestas, caminos y recuerdos compartidos.',
    secciones: ['Oficios de antes', 'Fotos que cuentan', 'Palabras del Valle'],
    franjas: [{ dias: [1, 3], inicio: '11:00', fin: '13:00' }],
  },
  {
    id: 'mediodia-en-minima',
    nombre: 'Mediodía en Mínima',
    presentador: 'Equipo de redacción',
    categoria: 'Actualidad',
    descripcion: 'El informativo local de la radio: lo que pasa en Güímar, Arafo y Candelaria, contado por sus vecinos.',
    secciones: ['Titulares del día', 'Agenda municipal', 'Avisos de servicio'],
    franjas: [{ dias: LV, inicio: '13:00', fin: '14:00' }],
  },
  {
    id: 'sobremesa',
    nombre: 'Sobremesa',
    presentador: 'Toni Expósito',
    categoria: 'Música',
    descripcion: 'Canciones para después de comer, dedicatorias y felicitaciones de cumpleaños. Llama y pide tu canción.',
    secciones: ['Dedicatorias', 'Cumpleaños del día', 'La canción que pediste'],
    franjas: [{ dias: LV, inicio: '14:00', fin: '16:00' }],
  },
  {
    id: 'deporte-base',
    nombre: 'Deporte base',
    presentador: 'Airam Díaz',
    categoria: 'Deportes',
    descripcion:
      'Fútbol, lucha canaria, baloncesto y atletismo de la comarca, con especial atención a las categorías inferiores.',
    secciones: ['Resultados del fin de semana', 'La lucha canaria', 'Cantera del Valle'],
    franjas: [
      { dias: [1, 3], inicio: '17:00', fin: '18:30' },
      { dias: [5], inicio: '11:00', fin: '13:00' },
    ],
  },
  {
    id: 'tarde-de-boleros',
    nombre: 'Tarde de boleros',
    presentador: 'Lola Marrero',
    categoria: 'Música',
    descripcion: 'Boleros, rancheras y los grandes clásicos de siempre para acompañar la caída de la tarde.',
    secciones: ['El bolero del día', 'Grandes voces', 'Canciones con historia'],
    franjas: [{ dias: LV, inicio: '18:30', fin: '20:00' }],
  },
  {
    id: 'voces-del-valle',
    nombre: 'Voces del Valle',
    presentador: 'Carmen Delgado',
    categoria: 'Comunidad',
    descripcion:
      'Entrevistas con asociaciones, colectivos y vecinos que hacen cosas por el Valle. Aquí, la radio sois vosotros.',
    secciones: ['La asociación invitada', 'Barrio a barrio', 'Vecinos que suman'],
    franjas: [{ dias: [2], inicio: '20:00', fin: '21:00' }],
  },
  {
    id: 'ruta-nocturna',
    nombre: 'Ruta nocturna',
    presentador: 'Dani Afonso',
    categoria: 'Música',
    descripcion: 'Novedades, pop y rock en español y grupos de las islas para las noches de entre semana.',
    secciones: ['Novedades de la semana', 'Grupos de las islas', 'Lo más pedido'],
    franjas: [{ dias: LV, inicio: '21:00', fin: '23:00' }],
  },
  {
    id: 'sabado-de-parranda',
    nombre: 'Sábado de parranda',
    presentador: 'Nieves Hernández',
    categoria: 'Tradición',
    descripcion: 'Parrandas, timples y agrupaciones folclóricas en directo desde los rincones del Valle.',
    secciones: ['Parranda en directo', 'Concurso de coplas', 'El rincón del timple'],
    franjas: [{ dias: [5], inicio: '18:00', fin: '21:00' }],
  },
  {
    id: 'domingo-en-familia',
    nombre: 'Domingo en familia',
    presentador: 'Rosa Alonso',
    categoria: 'Comunidad',
    descripcion: 'Planes para el fin de semana, la agenda cultural, recetas y música para disfrutar en familia.',
    secciones: ['Planes de fin de semana', 'Agenda cultural', 'La cocina del domingo'],
    franjas: [{ dias: [6], inicio: '10:00', fin: '13:00' }],
  },
];

/** Programa que suena cuando no hay ninguno en antena. */
export const continuidad = {
  id: 'musica-continua',
  nombre: 'Música continua',
  presentador: 'Mínima FM',
  descripcion: 'La mejor música para acompañarte hasta el próximo programa.',
};
