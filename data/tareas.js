/**
 * GESTIÓN DE DATOS GLOBALES - ESTADO DE TAREAS CON MONGODB
 * ========================================================
 *
 * Este módulo maneja el estado global de las tareas en la aplicación.
 * Actúa como capa intermedia entre MongoDB y la lógica de negocio (controladores).
 *
 * Responsabilidades:
 * - Mantener el array global de tareas en memoria
 * - Inicializar datos desde MongoDB al arranque
 * - Persistir cambios automáticamente en MongoDB
 * - Proporcionar interfaz consistente para acceso a datos
 *
 * Patrón utilizado: Repository Pattern simplificado
 */

// Importar configuración de base de datos
import { obtenerColeccionTareas } from '../config/database.js';
// Importar modelo de Tarea
import { Tarea } from '../models/tarea.js';

/**
 * ESTADO GLOBAL: ARRAY DE TAREAS
 * ==============================
 *
 * Este array contiene todas las tareas en memoria durante la ejecución.
 * Se inicializa vacío y se llena con datos del archivo en el arranque.
 *
 * IMPORTANTE: Se exporta con 'let' para permitir modificaciones
 * desde otros módulos, pero manteniendo un punto central de acceso.
 */
export let tareas = [];

/**
 * FUNCIÓN: INICIALIZAR SISTEMA DE TAREAS CON MONGODB
 * =================================================
 *
 * Se ejecuta al arranque de la aplicación para cargar datos existentes desde MongoDB.
 * Limpia el array actual y lo repuebla con datos de la base de datos.
 * Esta función garantiza que siempre empecemos con un estado limpio.
 *
 * Flujo de inicialización:
 * 1. Limpiar array actual (por si se llama múltiples veces)
 * 2. Cargar datos desde MongoDB
 * 3. Convertir documentos a instancias de Tarea
 * 4. Poblar el array global con los datos cargados
 */
export async function inicializarTareas() {
  try {
    // PASO 1: LIMPIAR ESTADO ACTUAL
    // .length = 0 es más eficiente que tareas = [] porque:
    // - Mantiene la referencia del array original
    // - Permite que otros módulos conserven su referencia
    // - Es más rápido para arrays grandes
    tareas.length = 0;

    // PASO 2: OBTENER COLECCIÓN DE MONGODB
    const coleccion = await obtenerColeccionTareas();

    // PASO 3: CARGAR TODOS LOS DOCUMENTOS DESDE MONGODB
    // find({}) sin filtros obtiene todos los documentos
    // toArray() convierte el cursor en un array
    const documentos = await coleccion.find({}).toArray();

    // PASO 4: CONVERTIR DOCUMENTOS A INSTANCIAS DE TAREA
    // Usamos el método estático desdeDocumento para crear instancias apropiadas
    const tareasGuardadas = documentos.map(doc => Tarea.desdeDocumento(doc));

    // PASO 5: POBLAR ARRAY GLOBAL
    // Spread operator (...) es más eficiente que loop para arrays
    // Agrega todos los elementos de tareasGuardadas al array tareas
    tareas.push(...tareasGuardadas);

  } catch (error) {
    // MANEJO DE ERRORES: Si hay problemas de conexión, iniciar con array vacío
    console.error('⚠️  Error cargando tareas desde MongoDB:', error.message);
    console.log('📝 Iniciando con lista de tareas vacía');
    tareas.length = 0;
  }
}

/**
 * FUNCIÓN: PERSISTIR CAMBIOS A MONGODB
 * ===================================
 *
 * Guarda el estado actual de las tareas a MongoDB.
 * Se llama después de cada operación que modifica datos
 * (agregar, editar, completar, eliminar).
 *
 * Esta implementación reemplaza completamente la colección con el estado actual.
 * Para aplicaciones con muchos usuarios concurrentes, se recomendaría
 * operaciones más granulares (insertOne, updateOne, deleteOne).
 *
 * @returns {Promise<boolean>} - true si se guardó exitosamente
 */
export async function persistirTareas() {
  try {
    // PASO 1: OBTENER COLECCIÓN DE MONGODB
    const coleccion = await obtenerColeccionTareas();

    // PASO 2: LIMPIAR COLECCIÓN ACTUAL
    // deleteMany({}) elimina todos los documentos de la colección
    await coleccion.deleteMany({});

    // PASO 3: INSERTAR TODAS LAS TAREAS ACTUALES
    // Si hay tareas en memoria, las insertamos
    if (tareas.length > 0) {
      // Convertir todas las tareas a documentos de MongoDB
      const documentos = tareas.map(tarea => tarea.toDocumento());

      // insertMany() inserta múltiples documentos en una sola operación
      await coleccion.insertMany(documentos);
    }

    // PASO 4: Retornar éxito
    return true;

  } catch (error) {
    // MANEJO DE ERRORES CON LOG
    // Mostramos el error al usuario pero no terminamos la aplicación
    console.error('❌ Error al guardar tareas en MongoDB:', error.message);
    return false;
  }
}

/**
 * FUNCIONES AUXILIARES PARA OPERACIONES ESPECÍFICAS
 * =================================================
 *
 * Estas funciones proporcionan operaciones más eficientes para casos específicos
 * cuando no necesitamos reemplazar toda la colección.
 */

/**
 * FUNCIÓN: AGREGAR UNA TAREA A MONGODB
 * ===================================
 *
 * Inserta una nueva tarea directamente en MongoDB sin afectar las demás.
 */
export async function agregarTareaDB(tarea) {
  try {
    const coleccion = await obtenerColeccionTareas();
    await coleccion.insertOne(tarea.toDocumento());
    return true;
  } catch (error) {
    console.error('❌ Error al agregar tarea a MongoDB:', error.message);
    return false;
  }
}

/**
 * FUNCIÓN: ACTUALIZAR UNA TAREA EN MONGODB
 * =======================================
 *
 * Actualiza una tarea específica en MongoDB por su _id.
 */
export async function actualizarTareaDB(tarea) {
  try {
    const coleccion = await obtenerColeccionTareas();
    const resultado = await coleccion.updateOne(
      { _id: tarea._id },
      { $set: tarea.toDocumento() }
    );
    return resultado.modifiedCount > 0;
  } catch (error) {
    console.error('❌ Error al actualizar tarea en MongoDB:', error.message);
    return false;
  }
}

/**
 * FUNCIÓN: ELIMINAR UNA TAREA DE MONGODB
 * =====================================
 *
 * Elimina una tarea específica de MongoDB por su _id.
 */
export async function eliminarTareaDB(tareaId) {
  try {
    const coleccion = await obtenerColeccionTareas();
    const resultado = await coleccion.deleteOne({ _id: tareaId });
    return resultado.deletedCount > 0;
  } catch (error) {
    console.error('❌ Error al eliminar tarea de MongoDB:', error.message);
    return false;
  }
}