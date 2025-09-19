/**
 * CONFIGURACIÓN DE BASE DE DATOS MONGODB
 * =====================================
 *
 * Este módulo maneja la conexión a MongoDB utilizando el driver nativo.
 * Proporciona una conexión simple y directa sin abstracciones adicionales.
 *
 * Configuración:
 * - URL de conexión: mongodb://localhost:27017/
 * - Base de datos: gestor-tareas
 * - Colección: tareas
 */

import { MongoClient } from 'mongodb';

// Configuración de conexión
const URL_MONGODB = 'mongodb://localhost:27017';
const NOMBRE_DB = 'gestor-tareas';
const NOMBRE_COLECCION = 'tareas';

// Variable global para mantener la conexión
let client = null;
let db = null;

/**
 * FUNCIÓN: CONECTAR A MONGODB
 * ===========================
 *
 * Establece la conexión con MongoDB y retorna la instancia de la base de datos.
 * Si ya existe una conexión activa, la reutiliza.
 *
 * @returns {Promise<Object>} - Instancia de la base de datos
 */
export async function conectarDB() {
  try {
    // Si ya tenemos una conexión activa, la reutilizamos
    if (db) {
      return db;
    }

    // Crear nueva conexión
    client = new MongoClient(URL_MONGODB);
    await client.connect();

    // Obtener referencia a la base de datos
    db = client.db(NOMBRE_DB);

    console.log('✅ Conectado a MongoDB');
    return db;

  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    throw error;
  }
}

/**
 * FUNCIÓN: OBTENER COLECCIÓN DE TAREAS
 * ====================================
 *
 * Retorna la colección de tareas de MongoDB.
 * Se asegura de que la conexión esté establecida.
 *
 * @returns {Promise<Collection>} - Colección de tareas
 */
export async function obtenerColeccionTareas() {
  const database = await conectarDB();
  return database.collection(NOMBRE_COLECCION);
}

/**
 * FUNCIÓN: CERRAR CONEXIÓN
 * ========================
 *
 * Cierra la conexión con MongoDB de forma segura.
 * Se ejecuta al terminar la aplicación.
 */
export async function cerrarConexion() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('✅ Conexión a MongoDB cerrada');
  }
}