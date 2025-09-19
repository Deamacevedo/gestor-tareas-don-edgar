/**
 * CONTROLADOR DE TAREAS - LÓGICA DE NEGOCIO
 * ========================================
 *
 * Este archivo contiene toda la lógica de negocio para el manejo de tareas.
 * Utiliza extensivamente la librería Lodash para operaciones eficientes con datos.
 *
 * Funcionalidades implementadas:
 * - Crear tareas con validación de duplicados
 * - Listar tareas con filtros y ordenamiento
 * - Editar tareas existentes
 * - Completar tareas pendientes
 * - Eliminar tareas con confirmación
 * - Buscar tareas por palabras clave
 * - Mostrar estadísticas completas
 */

// Inquirer: Para crear interfaces interactivas de línea de comandos
import inquirer from 'inquirer';
// Lodash: Librería de utilidades para manipulación de datos
import _ from 'lodash';
// Importamos el array de tareas y la función para persistir cambios
import { tareas, persistirTareas } from '../data/tareas.js';
// Importamos la clase Tarea que define la estructura y comportamiento
import { Tarea } from '../models/tarea.js';

/**
 * FUNCIÓN: AGREGAR NUEVA TAREA
 * ============================
 *
 *
 * Esta función permite al usuario crear una nueva tarea con validaciones robustas.
 * Utiliza Lodash para:
 * - _.isEmpty(): Validar que la descripción no esté vacía
 * - _.find(): Buscar duplicados en el array de tareas
 * - _.toLower(): Comparación insensible a mayúsculas
 */
export async function agregarTarea() {
  try {
    // PASO 1: Solicitar descripción con validaciones en tiempo real
    const { descripcion } = await inquirer.prompt([
      {
        type: 'input',
        name: 'descripcion',
        message: 'Descripción de la tarea:',
        validate: (input) => {
          // VALIDACIÓN 1: Verificar que no esté vacía o solo contenga espacios
          // _.isEmpty() es más robusto que solo verificar .length
          if (_.isEmpty(input?.trim())) {
            return 'La descripción no puede estar vacía';
          }

          // VALIDACIÓN 2: Buscar tareas duplicadas (insensible a mayúsculas)
          // _.find() busca la primera coincidencia que cumple la condición
          // _.toLower() convierte ambas cadenas a minúsculas para comparar
          const duplicada = _.find(tareas, t =>
            _.toLower(t.descripcion) === _.toLower(input.trim())
          );
          if (duplicada) {
            return 'Ya existe una tarea con esa descripción';
          }

          // Si pasa todas las validaciones, retorna true
          return true;
        }
      }
    ]);

    // PASO 2: Crear nueva instancia de Tarea usando el método estático
    // Este método ya incluye validación adicional y genera ID único
    const nuevaTarea = Tarea.crearTarea(descripcion);

    // PASO 3: Agregar la tarea al array global
    tareas.push(nuevaTarea);

    // PASO 4: Persistir cambios al archivo JSON
    await persistirTareas();
    console.log('✅ Tarea agregada exitosamente.');
  } catch (error) {
    // MANEJO DE ERRORES: Captura cualquier error del proceso
    console.log(`❌ Error: ${error.message}`);
  }
}

/**
 * FUNCIÓN: LISTAR TAREAS CON FILTROS
 * ==================================
 *
 * Esta función muestra las tareas aplicando diferentes filtros.
 * Utiliza Lodash para:
 * - _.isEmpty(): Verificar si hay tareas disponibles
 * - _.filter(): Filtrar tareas según criterios específicos
 * - _.orderBy(): Ordenamiento multi-criterio inteligente
 *
 * @param {string} filtro - Tipo de filtro: 'todas', 'completadas', 'pendientes'
 */
export async function listarTareas(filtro = 'todas') {
  // VALIDACIÓN INICIAL: Verificar si existen tareas
  // _.isEmpty() es más confiable que tareas.length === 0
  if (_.isEmpty(tareas)) {
    console.log('📭 No hay tareas registradas.');
    return;
  }

  // PASO 1: Empezar con todas las tareas disponibles
  let tareasAMostrar = tareas;

  // PASO 2: Aplicar filtros según el parámetro recibido
  switch (filtro) {
    case 'completadas':
      // _.filter() con string 'completada' es equivalente a t => t.completada
      // Esta sintaxis de Lodash es más concisa y legible
      tareasAMostrar = _.filter(tareas, 'completada');
      break;
    case 'pendientes':
      // Para condiciones más complejas, usamos función callback
      tareasAMostrar = _.filter(tareas, t => !t.completada);
      break;
    // 'todas': no necesita filtro, ya está asignado arriba
  }

  // VALIDACIÓN DESPUÉS DEL FILTRO: Verificar si hay resultados
  if (_.isEmpty(tareasAMostrar)) {
    console.log(`📭 No hay tareas ${filtro}.`);
    return;
  }

  // PASO 3: ORDENAMIENTO INTELIGENTE CON LODASH
  // _.orderBy() permite ordenar por múltiples criterios:
  // 1. Por 'completada': false primero (pendientes arriba)
  // 2. Por 'fechaCreacion': más recientes primero
  // ['asc', 'desc'] define el orden para cada criterio
  const tareasOrdenadas = _.orderBy(tareasAMostrar, ['completada', 'fechaCreacion'], ['asc', 'desc']);

  // PASO 4: Mostrar las tareas formateadas
  console.log(`\n📋 Lista de tareas ${filtro}:`);
  tareasOrdenadas.forEach((tarea, i) => {
    // Símbolos visuales según el estado
    const estado = tarea.completada ? '✅' : '❌';
    // Formatear fecha para mejor legibilidad
    const fecha = new Date(tarea.fechaCreacion).toLocaleDateString();
    console.log(`${i + 1}. [${estado}] ${tarea.descripcion} (${fecha})`);
  });
}

/**
 * FUNCIÓN: EDITAR TAREA EXISTENTE
 * ===============================
 *
 * Permite modificar la descripción de una tarea existente.
 * Utiliza Lodash para:
 * - _.isEmpty(): Verificar disponibilidad de tareas
 * - _.orderBy(): Ordenar tareas para mejor UX
 * - _.find(): Localizar tarea específica por ID
 * - _.toLower(): Validación insensible a mayúsculas
 */
export async function editarTarea() {
  // VALIDACIÓN INICIAL: Verificar que existan tareas para editar
  if (_.isEmpty(tareas)) return console.log('⚠️ No hay tareas para editar.');

  // PASO 1: Ordenar tareas para mostrar pendientes primero
  // Esto mejora la UX al mostrar las más relevantes arriba
  const tareasOrdenadas = _.orderBy(tareas, ['completada', 'fechaCreacion'], ['asc', 'desc']);

  // PASO 2: Permitir al usuario seleccionar una tarea
  const { tareaSeleccionada } = await inquirer.prompt([
    {
      type: 'list',
      name: 'tareaSeleccionada',
      message: 'Selecciona una tarea para editar:',
      choices: tareasOrdenadas.map(t => ({
        // Mostrar estado visual y descripción
        name: `[${t.completada ? '✅' : '❌'}] ${t.descripcion}`,
        // El valor será el ID único para búsqueda posterior
        value: t._id
      }))
    }
  ]);

  // PASO 3: Encontrar la tarea seleccionada usando Lodash
  // Para ObjectIds necesitamos usar equals() para comparación
  const tarea = _.find(tareas, t => t._id.equals(tareaSeleccionada));

  // PASO 4: Solicitar nueva descripción con validaciones
  const { nuevaDescripcion } = await inquirer.prompt([
    {
      type: 'input',
      name: 'nuevaDescripcion',
      message: 'Nueva descripción:',
      default: tarea.descripcion, // Mostrar descripción actual como default
      validate: (input) => {
        // VALIDACIÓN 1: No permitir descripciones vacías
        if (_.isEmpty(input?.trim())) {
          return 'La descripción no puede estar vacía';
        }

        // VALIDACIÓN 2: Evitar duplicados (excluyendo la tarea actual)
        // Comparamos con todas las tareas EXCEPTO la que estamos editando
        const duplicada = _.find(tareas, t =>
          !t._id.equals(tareaSeleccionada) &&
          _.toLower(t.descripcion) === _.toLower(input.trim())
        );
        if (duplicada) {
          return 'Ya existe otra tarea con esa descripción';
        }

        return true;
      }
    }
  ]);

  // PASO 5: Actualizar la tarea y persistir cambios
  tarea.descripcion = nuevaDescripcion.trim();
  await persistirTareas();
  console.log('✏️ Tarea actualizada exitosamente.');
}

/**
 * FUNCIÓN: MARCAR TAREA COMO COMPLETADA
 * ====================================
 *
 * Permite al usuario marcar una tarea pendiente como completada.
 * Utiliza Lodash para:
 * - _.filter(): Obtener solo tareas pendientes
 * - _.isEmpty(): Verificar disponibilidad
 * - _.orderBy(): Ordenar por fecha de creación
 * - _.find(): Localizar la tarea seleccionada
 */
export async function completarTarea() {
  // PASO 1: Filtrar solo las tareas pendientes
  // _.filter() con callback para obtener las no completadas
  const tareasPendientes = _.filter(tareas, t => !t.completada);

  // VALIDACIÓN: Verificar si hay tareas pendientes
  if (_.isEmpty(tareasPendientes)) {
    return console.log('🎉 ¡No hay tareas pendientes! Todas están completadas.');
  }

  // PASO 2: Ordenar tareas pendientes por fecha (más recientes primero)
  // Esto ayuda al usuario a encontrar las tareas más relevantes
  const tareasOrdenadas = _.orderBy(tareasPendientes, 'fechaCreacion', 'desc');

  // PASO 3: Permitir selección de tarea a completar
  const { tareaSeleccionada } = await inquirer.prompt([
    {
      type: 'list',
      name: 'tareaSeleccionada',
      message: 'Selecciona una tarea para marcar como completada:',
      choices: tareasOrdenadas.map(t => ({
        // Solo mostramos la descripción (sin estado, ya son pendientes)
        name: t.descripcion,
        value: t._id
      }))
    }
  ]);

  // PASO 4: Encontrar y marcar la tarea como completada
  const tarea = _.find(tareas, t => t._id.equals(tareaSeleccionada));
  tarea.marcarCompletada(); // Método del modelo que actualiza estado y fecha

  // PASO 5: Persistir cambios al archivo
  await persistirTareas();
  console.log('🎉 ¡Tarea completada exitosamente!');
}

/**
 * FUNCIÓN: ELIMINAR TAREA CON CONFIRMACIÓN
 * =======================================
 *
 * Elimina una tarea del sistema después de confirmar la acción.
 * Utiliza Lodash para:
 * - _.isEmpty(): Verificar disponibilidad de tareas
 * - _.orderBy(): Ordenar para mejor visualización
 * - _.remove(): Eliminar elemento del array de forma segura
 */
export async function eliminarTarea() {
  // VALIDACIÓN INICIAL: Verificar que existan tareas
  if (_.isEmpty(tareas)) return console.log('⚠️ No hay tareas para eliminar.');

  // PASO 1: Ordenar tareas (pendientes primero, luego por fecha)
  const tareasOrdenadas = _.orderBy(tareas, ['completada', 'fechaCreacion'], ['asc', 'desc']);

  // PASO 2: Permitir selección de tarea a eliminar
  const { tareaSeleccionada } = await inquirer.prompt([
    {
      type: 'list',
      name: 'tareaSeleccionada',
      message: 'Selecciona una tarea para eliminar:',
      choices: tareasOrdenadas.map(t => ({
        // Mostrar estado visual para facilitar identificación
        name: `[${t.completada ? '✅' : '❌'}] ${t.descripcion}`,
        value: t._id
      }))
    }
  ]);

  // PASO 3: CONFIRMACIÓN DE SEGURIDAD
  // Importante para prevenir eliminaciones accidentales
  const { confirmar } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmar',
      message: '¿Estás seguro de que deseas eliminar esta tarea?',
      default: false // Por defecto "No" para mayor seguridad
    }
  ]);

  // PASO 4: Procesar confirmación
  if (confirmar) {
    // _.remove() modifica el array original eliminando elementos
    // Para ObjectIds necesitamos usar una función de comparación
    _.remove(tareas, t => t._id.equals(tareaSeleccionada));
    await persistirTareas();
    console.log('🗑️ Tarea eliminada exitosamente.');
  } else {
    console.log('❌ Eliminación cancelada.');
  }
}

/**
 * FUNCIÓN: BUSCAR TAREAS POR PALABRA CLAVE
 * =======================================
 *
 * Permite buscar tareas que contengan un término específico.
 * Utiliza Lodash para:
 * - _.isEmpty(): Validaciones múltiples
 * - _.filter(): Filtrar resultados de búsqueda
 * - _.includes(): Búsqueda de subcadena
 * - _.toLower(): Búsqueda insensible a mayúsculas
 */
export async function buscarTareas() {
  // VALIDACIÓN INICIAL: Verificar que existan tareas
  if (_.isEmpty(tareas)) return console.log('📭 No hay tareas registradas.');

  // PASO 1: Solicitar término de búsqueda
  const { termino } = await inquirer.prompt([
    {
      type: 'input',
      name: 'termino',
      message: 'Ingresa el término de búsqueda:',
      // Validación inline usando operador ternario y _.isEmpty()
      validate: input => _.isEmpty(input?.trim()) ? 'Debes ingresar un término de búsqueda' : true
    }
  ]);

  // PASO 2: ALGORITMO DE BÚSQUEDA CON LODASH
  // Combinamos _.filter() e _.includes() para búsqueda eficiente
  const tareasEncontradas = _.filter(tareas, tarea =>
    // _.includes() verifica si una cadena contiene otra
    // _.toLower() hace la comparación insensible a mayúsculas
    _.includes(_.toLower(tarea.descripcion), _.toLower(termino.trim()))
  );

  // PASO 3: Verificar si se encontraron resultados
  if (_.isEmpty(tareasEncontradas)) {
    console.log(`🔍 No se encontraron tareas que contengan "${termino}"`);
    return;
  }

  // PASO 4: Mostrar resultados encontrados
  console.log(`\n🔍 Tareas encontradas (${tareasEncontradas.length}):`);
  tareasEncontradas.forEach((tarea, i) => {
    const estado = tarea.completada ? '✅' : '❌';
    const fecha = new Date(tarea.fechaCreacion).toLocaleDateString();
    console.log(`${i + 1}. [${estado}] ${tarea.descripcion} (${fecha})`);
  });
}

/**
 * FUNCIÓN: MOSTRAR ESTADÍSTICAS COMPLETAS
 * =====================================
 *
 * Presenta un análisis completo del estado de las tareas.
 * Utiliza Lodash para:
 * - _.isEmpty(): Verificar disponibilidad de datos
 * - _.filter(): Contar tareas por estado
 * - _.groupBy(): Agrupar tareas por fecha
 * - _.maxBy(): Encontrar el día más productivo
 */
export function mostrarEstadisticas() {
  // VALIDACIÓN INICIAL: Verificar que existan tareas
  if (_.isEmpty(tareas)) return console.log('📭 No hay tareas registradas.');

  // PASO 1: CALCULAR ESTADÍSTICAS BÁSICAS
  const stats = {
    total: tareas.length,
    // _.filter() con string es más conciso para propiedades booleanas
    completadas: _.filter(tareas, 'completada').length,
    // Para lógica negativa, usamos callback
    pendientes: _.filter(tareas, t => !t.completada).length
  };

  // PASO 2: Calcular porcentaje de completadas
  const porcentajeCompletadas = stats.total > 0
    ? Math.round((stats.completadas / stats.total) * 100)
    : 0;

  // PASO 3: Mostrar estadísticas básicas
  console.log('\n📊 Estadísticas de tareas:');
  console.log(`   Total: ${stats.total}`);
  console.log(`   Completadas: ${stats.completadas} (${porcentajeCompletadas}%)`);
  console.log(`   Pendientes: ${stats.pendientes}`);

  // PASO 4: ESTADÍSTICAS AVANZADAS (solo si hay tareas)
  if (stats.total > 0) {
    // _.groupBy() agrupa elementos según el resultado de la función
    // Agrupamos por fecha de creación (como string para comparación)
    const tareasPorFecha = _.groupBy(tareas, tarea =>
      new Date(tarea.fechaCreacion).toDateString()
    );

    // _.maxBy() encuentra el elemento con el valor máximo según el criterio
    // Object.entries() convierte el objeto en array de [clave, valor]
    const fechasConMasTareas = _.maxBy(
      Object.entries(tareasPorFecha),
      ([fecha, tareas]) => tareas.length // Criterio: cantidad de tareas
    );

    // MOSTRAR DÍA MÁS PRODUCTIVO
    if (fechasConMasTareas) {
      const fecha = new Date(fechasConMasTareas[0]).toLocaleDateString();
      console.log(`   Día más productivo: ${fecha} (${fechasConMasTareas[1].length} tareas)`);
    }
  }
}