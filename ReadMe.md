# Taller - Don Edgar quiere resultados!

### **Refactoriza y potencia el sistema CLI con Lodash y persistencia en archivos**

> Tu jefe, el temido pero carismático **Don Edgar**, está furioso. En la última revisión del sistema de gestión por consola que usas en la empresa para manejar tareas internas, detectó que todo se almacena en memoria y que algunos datos están mal ordenados, hay duplicados y, para colmo, ¡nadie puede guardar nada permanentemente!
> 
> 
> Don Edgar se para frente a ti, lanza su termo de café sobre la mesa (sin abrirlo, claro) y te dice:
> 
> > “¡Esto tiene que cambiar! Quiero que ese sistemita que estás usando en consola sirva de verdad. Agrega orden, control y archivos... y ya que estás, ¡usa esa cosa llamada Lodash que tanto alaban los campers de ese tal Campuslands!”
> > 
> 
> Tu misión, si decides aceptarla (y créeme, no quieres decirle que no a Don Edgar), es la siguiente:
> 

---

### **Objetivo del taller**

Tomando como base un sistema de gestión de tareas por consola ya funcional (que se te entregará), debes **refactorizar y mejorar el proyecto** cumpliendo con las siguientes condiciones:

---

### **Actividades requeridas**

1. **Modularización del sistema**
    
    Separa el proyecto en archivos adecuados para seguir buenas prácticas de organización de código. Por ejemplo:
    
    - `main.js`
    - `utils/archivo.js`
    - `controllers/tareasController.js`
    - `models/tarea.js`
    - `helpers/menu.js`, etc.
2. **Agregar persistencia con archivos**
    
    Usa el módulo `fs` para que las tareas se guarden en un archivo `.json` y persistan entre ejecuciones del programa. Cada operación (crear, listar, eliminar, completar) debe afectar este archivo.
    
3. **Integración de la librería Lodash**
    
    Usa Lodash para mejorar al menos 4 aspectos del sistema. Algunas ideas:
    
    - Ordenar tareas (`_.orderBy`)
    - Eliminar duplicados si los hay (`_.uniqBy`)
    - Generar identificadores únicos (`_.uniqueId` o `nanoid`, si combinas)
    - Agrupar tareas por estado (`_.groupBy`)
    - Buscar por palabra clave (`_.filter`, `_.includes`)
    - Validar que no se agreguen tareas vacías (`_.isEmpty`, etc.)
4. **Interfaz CLI con Inquirer**
    
    Mantén y mejora la interacción por consola usando `inquirer`. Debes permitir:
    
    - Crear una nueva tarea
    - Listar tareas (todas / completadas / pendientes)
    - Marcar tareas como completadas
    - Eliminar tareas
5. **Validaciones y UX**
    
    Agrega validaciones útiles, por ejemplo:
    
    - Que no se ingresen tareas vacías
    - Confirmación al eliminar
    - Mensajes claros en consola con colores (puedes usar `chalk` si deseas, opcional)

---

### **Recursos entregados**

Se entregará una versión inicial en un solo archivo que realiza las operaciones en memoria y permite manejar tareas con inquirer. Tu trabajo consiste en **evolucionar ese sistema hacia una solución real y profesional**.

---

### ✅ **Entregable:**

**Un repositorio en GitHub con las siguientes indicaciones:**

- Un proyecto funcional organizado en carpetas y módulos.
- Archivo `README.md` explicando cómo correr el proyecto.
- Incluye instrucciones para instalar dependencias (`npm install`).

Se puede trabajar en parejas o de manera individual.