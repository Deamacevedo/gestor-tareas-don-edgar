/**
 * ARCHIVO PRINCIPAL DEL GESTOR DE TAREAS CLI
 * =========================================
 *
 * Este es el punto de entrada de la aplicación. Se encarga de:
 * - Inicializar el sistema de tareas
 * - Mostrar el menú principal
 * - Gestionar el flujo de navegación entre opciones
 * - Manejar errores globales de la aplicación
 */

// Importamos la función que muestra el menú interactivo
import mostrarMenu from './utils/menu.js';

// Importamos todas las funciones del controlador de tareas
// Estas funciones contienen la lógica de negocio para cada operación
import {
  listarTareas,          // Lista tareas con diferentes filtros
  agregarTarea,          // Crea una nueva tarea
  editarTarea,           // Modifica una tarea existente
  eliminarTarea,         // Elimina una tarea con confirmación
  completarTarea,        // Marca una tarea como completada
  buscarTareas,          // Busca tareas por palabras clave
  mostrarEstadisticas    // Muestra estadísticas del sistema
} from './controllers/tareasController.js';

// Importamos la función que carga las tareas desde MongoDB
import { inicializarTareas } from './data/tareas.js';
// Importamos la función para cerrar la conexión de MongoDB
import { cerrarConexion } from './config/database.js';

/**
 * FUNCIÓN PRINCIPAL DE LA APLICACIÓN
 * =================================
 *
 * Esta función asíncrona es el corazón de la aplicación.
 * Maneja todo el ciclo de vida del programa desde el inicio hasta la salida.
 */
async function main() {
  // Mensaje de bienvenida al usuario
  console.log('🚀 Iniciando Gestor de Tareas...');

  // PASO 1: Inicializar el sistema
  // Carga las tareas existentes desde MongoDB
  // Si no puede conectar, comienza con una lista vacía
  await inicializarTareas();
  console.log('✅ Sistema listo\n');

  // Variable de control para el bucle principal
  let salir = false;

  // BUCLE PRINCIPAL DE LA APLICACIÓN
  // Este bucle se ejecuta hasta que el usuario seleccione "Salir"
  while (!salir) {
    // Muestra el menú y espera la selección del usuario
    const opcion = await mostrarMenu();

    // SWITCH: Maneja cada opción del menú
    // Cada case corresponde a una funcionalidad específica
    switch (opcion) {
      case '1':
        // AGREGAR NUEVA TAREA
        // Permite al usuario crear una tarea con validaciones
        await agregarTarea();
        break;

      case '2':
        // LISTAR TODAS LAS TAREAS
        // Muestra todas las tareas ordenadas por estado y fecha
        await listarTareas('todas');
        break;

      case '3':
        // LISTAR SOLO TAREAS COMPLETADAS
        // Filtra y muestra únicamente las tareas terminadas
        await listarTareas('completadas');
        break;

      case '4':
        // LISTAR SOLO TAREAS PENDIENTES
        // Filtra y muestra únicamente las tareas por hacer
        await listarTareas('pendientes');
        break;

      case '5':
        // MARCAR TAREA COMO COMPLETADA
        // Permite seleccionar una tarea pendiente y marcarla como terminada
        await completarTarea();
        break;

      case '6':
        // EDITAR TAREA EXISTENTE
        // Permite modificar la descripción de una tarea
        await editarTarea();
        break;

      case '7':
        // BUSCAR TAREAS POR PALABRA CLAVE
        // Búsqueda insensible a mayúsculas en las descripciones
        await buscarTareas();
        break;

      case '8':
        // MOSTRAR ESTADÍSTICAS
        // Presenta un resumen completo del estado de las tareas
        mostrarEstadisticas();
        break;

      case '9':
        // ELIMINAR TAREA
        // Elimina una tarea después de pedir confirmación
        await eliminarTarea();
        break;

      case '10':
        // SALIR DE LA APLICACIÓN
        // Cambia la variable de control para terminar el bucle
        salir = true;
        console.log('👋 ¡Gracias por usar el Gestor de Tareas!');
        console.log('💾 Todas tus tareas han sido guardadas automáticamente en MongoDB.');
        // Cerrar la conexión a MongoDB de forma segura
        await cerrarConexion();
        break;

      default:
        // OPCIÓN INVÁLIDA
        // Maneja cualquier valor inesperado (aunque inquirer lo previene)
        console.log('❌ Opción no válida');
    }

    // SEPARADOR VISUAL
    // Si no va a salir, muestra una línea separadora para mejor UX
    if (!salir) {
      console.log('\n' + '='.repeat(50) + '\n');
    }
  }
}

/**
 * EJECUCIÓN Y MANEJO DE ERRORES GLOBALES
 * ======================================
 *
 * Ejecuta la función principal y captura cualquier error no manejado.
 * Si ocurre un error crítico, lo muestra y termina la aplicación con código de error.
 */
main().catch(async error => {
  console.error('❌ Error en la aplicación:', error.message);
  // Asegurar que la conexión se cierre incluso si hay error
  try {
    await cerrarConexion();
  } catch (closeError) {
    console.error('❌ Error cerrando conexión:', closeError.message);
  }
  process.exit(1); // Termina con código de error 1
});