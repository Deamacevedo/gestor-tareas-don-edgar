/**
 * UTILIDAD: INTERFAZ DE MENÚ INTERACTIVO
 * ======================================
 *
 * Este módulo proporciona la interfaz de usuario principal del sistema.
 * Utiliza Inquirer.js para crear un menú interactivo y visualmente atractivo
 * que permite al usuario navegar entre todas las funcionalidades disponibles.
 *
 * Características:
 * - Menú con navegación por flechas
 * - Emojis para mejor experiencia visual
 * - Opciones organizadas lógicamente
 * - Valores de retorno consistentes
 * - Interfaz intuitiva y amigable
 */

// Inquirer.js: Librería para crear interfaces de línea de comandos interactivas
import inquirer from 'inquirer';

/**
 * FUNCIÓN PRINCIPAL: MOSTRAR MENÚ INTERACTIVO
 * ===========================================
 *
 * Presenta el menú principal de la aplicación y espera la selección del usuario.
 * Utiliza el tipo 'list' de Inquirer para una navegación fluida con flechas.
 * Cada opción incluye un emoji descriptivo y un texto explicativo.
 *
 * @returns {Promise<string>} - Valor numérico como string de la opción seleccionada
 */
export default async function mostrarMenu() {
  // CONFIGURACIÓN DEL PROMPT INTERACTIVO
  const { opcion } = await inquirer.prompt([
    {
      // TIPO: Lista de opciones navegable con flechas
      type: 'list',
      // NOMBRE: Clave del objeto retornado
      name: 'opcion',
      // MENSAJE: Pregunta mostrada al usuario
      message: '📋 ¿Qué deseas hacer?',

      // OPCIONES DEL MENÚ: Array de objetos con nombre visual y valor retornado
      choices: [
        // GRUPO 1: OPERACIONES DE CREACIÓN Y VISUALIZACIÓN
        {
          name: '➕ Agregar nueva tarea',
          value: '1' // Crear una nueva tarea con validaciones
        },
        {
          name: '📝 Listar todas las tareas',
          value: '2' // Mostrar todas las tareas ordenadas
        },
        {
          name: '✅ Listar tareas completadas',
          value: '3' // Filtrar solo tareas terminadas
        },
        {
          name: '⏳ Listar tareas pendientes',
          value: '4' // Filtrar solo tareas por hacer
        },

        // GRUPO 2: OPERACIONES DE MODIFICACIÓN
        {
          name: '🎯 Marcar tarea como completada',
          value: '5' // Cambiar estado de pendiente a completada
        },
        {
          name: '✏️ Editar tarea',
          value: '6' // Modificar descripción de tarea existente
        },

        // GRUPO 3: OPERACIONES DE BÚSQUEDA Y ANÁLISIS
        {
          name: '🔍 Buscar tareas',
          value: '7' // Buscar por palabras clave
        },
        {
          name: '📊 Ver estadísticas',
          value: '8' // Mostrar análisis completo del sistema
        },

        // GRUPO 4: OPERACIONES DESTRUCTIVAS Y SALIDA
        {
          name: '🗑️ Eliminar tarea',
          value: '9' // Eliminar tarea con confirmación
        },
        {
          name: '👋 Salir',
          value: '10' // Terminar la aplicación
        }
      ]
    }
  ]);

  // RETORNAR LA OPCIÓN SELECCIONADA
  // El valor retornado será usado en el switch del archivo principal
  return opcion;
}