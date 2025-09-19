/**
 * MODELO DE DATOS: CLASE TAREA
 * ============================
 *
 * Define la estructura y comportamiento de una tarea individual.
 * Utiliza Lodash para:
 * - _.uniqueId(): Generar identificadores únicos automáticamente
 * - _.isEmpty(): Validar que las descripciones no estén vacías
 *
 * Características principales:
 * - IDs únicos generados automáticamente
 * - Timestamps ISO para trazabilidad
 * - Métodos para cambiar estado
 * - Validaciones estáticas
 */

// Importamos Lodash para utilidades de datos
import _ from 'lodash';

/**
 * CLASE TAREA
 * ===========
 *
 * Representa una tarea individual en el sistema con todas sus propiedades
 * y métodos para manejar su ciclo de vida.
 */
export class Tarea {
  /**
   * CONSTRUCTOR DE LA CLASE TAREA
   * =============================
   *
   * Inicializa una nueva tarea con valores por defecto.
   * Genera automáticamente un ID único y establece la fecha de creación.
   *
   * @param {string} descripcion - Descripción de la tarea a realizar
   */
  constructor(descripcion) {
    // GENERAR ID ÚNICO CON LODASH
    // _.uniqueId() genera IDs secuenciales únicos con un prefijo personalizado
    // Ejemplo: 'tarea_1', 'tarea_2', 'tarea_3', etc.
    this.id = _.uniqueId('tarea_');

    // LIMPIAR Y ASIGNAR DESCRIPCIÓN
    // .trim() elimina espacios en blanco al inicio y final
    this.descripcion = descripcion.trim();

    // ESTADO INICIAL: Siempre comienza como pendiente
    this.completada = false;

    // TIMESTAMP DE CREACIÓN
    // .toISOString() genera formato estándar internacional (ISO 8601)
    // Ejemplo: "2024-09-17T10:30:00.000Z"
    this.fechaCreacion = new Date().toISOString();
  }

  /**
   * MÉTODO: MARCAR COMO COMPLETADA
   * ==============================
   *
   * Cambia el estado de la tarea a completada y registra la fecha/hora
   * en que se completó para trazabilidad.
   */
  marcarCompletada() {
    // Cambiar estado a completada
    this.completada = true;

    // Registrar timestamp de cuando se completó
    // Útil para estadísticas y análisis de productividad
    this.fechaCompletada = new Date().toISOString();
  }

  /**
   * MÉTODO: MARCAR COMO PENDIENTE
   * =============================
   *
   * Revierte una tarea completada a estado pendiente.
   * Elimina la fecha de completado ya que ya no aplica.
   */
  marcarPendiente() {
    // Cambiar estado a pendiente
    this.completada = false;

    // ELIMINAR FECHA DE COMPLETADO
    // delete es más apropiado que asignar null o undefined
    // porque remueve completamente la propiedad del objeto
    delete this.fechaCompletada;
  }

  /**
   * MÉTODO ESTÁTICO: VALIDAR DESCRIPCIÓN
   * ====================================
   *
   * Valida que una descripción sea válida antes de crear una tarea.
   * Utiliza Lodash para una validación más robusta.
   *
   * @param {string} descripcion - Descripción a validar
   * @returns {boolean} - true si es válida, false en caso contrario
   */
  static validarDescripcion(descripcion) {
    // VALIDACIÓN CON LODASH
    // _.isEmpty() es más robusto que solo verificar .length
    // Maneja casos como: null, undefined, '', '   ', [], {}
    // El operador ?. previene errores si descripcion es null/undefined
    return !_.isEmpty(descripcion?.trim());
  }

  /**
   * MÉTODO ESTÁTICO FACTORY: CREAR TAREA
   * ====================================
   *
   * Factory method que crea una nueva tarea con validaciones.
   * Lanza una excepción si la descripción no es válida.
   *
   * @param {string} descripcion - Descripción de la nueva tarea
   * @returns {Tarea} - Nueva instancia de Tarea
   * @throws {Error} - Si la descripción está vacía o es inválida
   */
  static crearTarea(descripcion) {
    // VALIDACIÓN OBLIGATORIA ANTES DE CREAR
    // Usa el método estático de validación para mantener consistencia
    if (!this.validarDescripcion(descripcion)) {
      throw new Error('La descripción de la tarea no puede estar vacía');
    }

    // CREAR Y RETORNAR NUEVA INSTANCIA
    // Si pasa la validación, procede con la creación normal
    return new Tarea(descripcion);
  }
}