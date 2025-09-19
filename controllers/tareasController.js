import inquirer from 'inquirer';
import { tareas } from '../data/tareas.js';

export async function agregarTarea() {
  const { descripcion } = await inquirer.prompt([
    { type: 'input', name: 'descripcion', message: 'Descripción de la tarea:' }
  ]);

  const nueva = {
    id: Date.now(),
    descripcion: descripcion.trim(),
    completada: false
  };

  tareas.push(nueva);
  console.log('✅ Tarea agregada.');
}

export function listarTareas() {
  if (tareas.length === 0) {
    console.log('📭 No hay tareas registradas.');
    return;
  }

  console.log('\n📋 Lista de tareas:');
  tareas.forEach((tarea, i) => {
    const estado = tarea.completada ? '✅' : '❌';
    console.log(`${i + 1}. [${estado}] ${tarea.descripcion}`);
  });
}

export async function editarTarea() {
  if (tareas.length === 0) return console.log('⚠️ No hay tareas para editar.');

  const { indice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'indice',
      message: 'Selecciona una tarea para editar:',
      choices: tareas.map((t, i) => ({
        name: t.descripcion,
        value: i
      }))
    }
  ]);

  const { nuevaDescripcion } = await inquirer.prompt([
    { type: 'input', name: 'nuevaDescripcion', message: 'Nueva descripción:' }
  ]);

  tareas[indice].descripcion = nuevaDescripcion.trim();
  console.log('✏️ Tarea actualizada.');
}

export async function eliminarTarea() {
  if (tareas.length === 0) return console.log('⚠️ No hay tareas para eliminar.');

  const { indice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'indice',
      message: 'Selecciona una tarea para eliminar:',
      choices: tareas.map((t, i) => ({
        name: t.descripcion,
        value: i
      }))
    }
  ]);

  tareas.splice(indice, 1);
  console.log('🗑️ Tarea eliminada.');
}
