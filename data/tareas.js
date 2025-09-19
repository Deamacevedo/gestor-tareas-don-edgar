/**
 * GESTIÓN DE DATOS GLOBALES - ESTADO DE TAREAS
 * ============================================
 *
 * Este módulo maneja el estado global de las tareas en la aplicación.
 * Actúa como capa intermedia entre el almacenamiento persistente (archivos)
 * y la lógica de negocio (controladores).
 *
 * Responsabilidades:
 * - Mantener el array global de tareas en memoria
 * - Inicializar datos desde el archivo al arranque
 * - Persistir cambios automáticamente
 * - Proporcionar interfaz consistente para acceso a datos
 *
 * Patrón utilizado: Repository Pattern simplificado
 */

// Importar funciones de persistencia de archivos
import { cargarTareas, guardarTareas } from '../utils/fileStorage.js';

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
 * FUNCIÓN: INICIALIZAR SISTEMA DE TAREAS
 * ======================================
 *
 * Se ejecuta al arranque de la aplicación para cargar datos existentes.
 * Limpia el array actual y lo repuebla con datos del archivo.
 * Esta función garantiza que siempre empecemos con un estado limpio.
 *
 * Flujo de inicialización:
 * 1. Limpiar array actual (por si se llama múltiples veces)
 * 2. Cargar datos desde archivo JSON
 * 3. Poblar el array global con los datos cargados
 */
export async function inicializarTareas() {
  // PASO 1: LIMPIAR ESTADO ACTUAL
  // .length = 0 es más eficiente que tareas = [] porque:
  // - Mantiene la referencia del array original
  // - Permite que otros módulos conserven su referencia
  // - Es más rápido para arrays grandes
  tareas.length = 0;

  // PASO 2: CARGAR DATOS DESDE ARCHIVO
  // La función cargarTareas() maneja todos los casos edge:
  // - Archivo no existe: retorna []
  // - JSON inválido: retorna []
  // - Error de permisos: retorna []
  const tareasGuardadas = await cargarTareas();

  // PASO 3: POBLAR ARRAY GLOBAL
  // Spread operator (...) es más eficiente que loop para arrays
  // Agrega todos los elementos de tareasGuardadas al array tareas
  tareas.push(...tareasGuardadas);
}

/**
 * FUNCIÓN: PERSISTIR CAMBIOS AL ARCHIVO
 * ====================================
 *
 * Guarda el estado actual de las tareas al archivo JSON.
 * Se llama después de cada operación que modifica datos
 * (agregar, editar, completar, eliminar).
 *
 * Esta función actúa como wrapper para mantener consistencia
 * y permitir futuras mejoras (como cache, validaciones, etc.)
 *
 * @returns {Promise<boolean>} - true si se guardó exitosamente
 */
export async function persistirTareas() {
  // DELEGAR AL MÓDULO DE ALMACENAMIENTO
  // Mantenemos la lógica de persistencia separada para:
  // - Separación de responsabilidades
  // - Facilidad de testing
  // - Posibilidad de cambiar el método de almacenamiento
  return await guardarTareas(tareas);
}