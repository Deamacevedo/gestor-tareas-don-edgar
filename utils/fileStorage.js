/**
 * UTILIDAD: SISTEMA DE PERSISTENCIA DE ARCHIVOS
 * =============================================
 *
 * Este módulo maneja toda la lógica de persistencia de datos en archivos JSON.
 * Proporciona funciones para cargar y guardar tareas de forma segura,
 * con manejo robusto de errores y creación automática de directorios.
 *
 * Funcionalidades:
 * - Carga de tareas desde archivo JSON
 * - Guardado de tareas con formato legible
 * - Creación automática de directorios
 * - Manejo elegante de errores
 * - Compatibilidad con módulos ES6
 */

// Módulo fs/promises para operaciones de archivo asíncronas
import fs from 'fs/promises';
// Módulo path para manejo de rutas multiplataforma
import path from 'path';
// Utilidad para obtener __dirname en módulos ES6
import { fileURLToPath } from 'url';

/**
 * CONFIGURACIÓN DE RUTAS PARA MÓDULOS ES6
 * =======================================
 *
 * En módulos ES6, __filename y __dirname no están disponibles por defecto.
 * Necesitamos recrearlos usando fileURLToPath e import.meta.url
 */

// Obtener la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);
// Obtener el directorio del archivo actual
const __dirname = path.dirname(__filename);

/**
 * CONSTANTE: RUTA DEL ARCHIVO DE DATOS
 * ===================================
 *
 * Define la ubicación donde se almacenarán las tareas.
 * Usa path.join() para compatibilidad multiplataforma (Windows/Linux/Mac).
 * La ruta resultante es: /utils/../data/tareas.json = /data/tareas.json
 */
const TAREAS_FILE = path.join(__dirname, '..', 'data', 'tareas.json');

/**
 * FUNCIÓN: CARGAR TAREAS DESDE ARCHIVO
 * ===================================
 *
 * Intenta cargar las tareas desde el archivo JSON.
 * Si el archivo no existe o hay errores, retorna un array vacío.
 * Esta función es "fail-safe": nunca falla, solo retorna [] en caso de error.
 *
 * @returns {Promise<Array>} - Array de tareas o array vacío si no existe el archivo
 */
export async function cargarTareas() {
  try {
    // PASO 1: Verificar que el archivo exista
    // fs.access() lanza excepción si el archivo no existe
    // Es más eficiente que fs.existsSync() para operaciones async
    await fs.access(TAREAS_FILE);

    // PASO 2: Leer contenido del archivo
    // 'utf-8' especifica la codificación de caracteres para texto
    const data = await fs.readFile(TAREAS_FILE, 'utf-8');

    // PASO 3: Parsear JSON y retornar datos
    // JSON.parse() convierte el string JSON en objeto JavaScript
    return JSON.parse(data);

  } catch (error) {
    // MANEJO ELEGANTE DE ERRORES
    // En lugar de mostrar error, retornamos array vacío
    // Esto permite que la aplicación funcione incluso sin archivo de datos
    // Casos manejados: archivo no existe, JSON inválido, permisos, etc.
    return [];
  }
}

/**
 * FUNCIÓN: GUARDAR TAREAS AL ARCHIVO
 * =================================
 *
 * Guarda el array de tareas en el archivo JSON de forma segura.
 * Crea automáticamente el directorio si no existe.
 * Formatea el JSON para que sea legible por humanos.
 *
 * @param {Array} tareas - Array de objetos tarea a guardar
 * @returns {Promise<boolean>} - true si se guardó exitosamente, false en caso de error
 */
export async function guardarTareas(tareas) {
  try {
    // PASO 1: ASEGURAR QUE EL DIRECTORIO EXISTA
    // path.dirname() obtiene el directorio padre del archivo
    const dirPath = path.dirname(TAREAS_FILE);

    // fs.mkdir() con { recursive: true } crea directorios anidados si es necesario
    // Similar a 'mkdir -p' en Linux o 'mkdir /p' en Windows
    // No falla si el directorio ya existe
    await fs.mkdir(dirPath, { recursive: true });

    // PASO 2: GUARDAR ARCHIVO CON FORMATO LEGIBLE
    // JSON.stringify() con parámetros:
    // - tareas: el objeto a convertir
    // - null: función replacer (no la usamos)
    // - 2: cantidad de espacios para indentación (formato legible)
    await fs.writeFile(TAREAS_FILE, JSON.stringify(tareas, null, 2));

    // PASO 3: Retornar éxito
    return true;

  } catch (error) {
    // MANEJO DE ERRORES CON LOG
    // Mostramos el error al usuario pero no terminamos la aplicación
    // Casos manejados: permisos, disco lleno, directorio protegido, etc.
    console.error('Error al guardar tareas:', error.message);
    return false;
  }
}