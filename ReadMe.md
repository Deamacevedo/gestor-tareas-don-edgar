# 📋 Gestor de Tareas CLI

Un sistema profesional de gestión de tareas por línea de comandos, desarrollado con Node.js, que ofrece persistencia de datos, validaciones robustas y una interfaz intuitiva.

## 🚀 Características

### ✨ Funcionalidades principales:
- ➕ **Crear tareas** con validación de duplicados
- 📝 **Listar tareas** (todas, completadas o pendientes)
- 🎯 **Marcar tareas como completadas**
- ✏️ **Editar tareas** existentes
- 🔍 **Buscar tareas** por palabras clave
- 📊 **Ver estadísticas** detalladas
- 🗑️ **Eliminar tareas** con confirmación
- 💾 **Persistencia automática** en archivos JSON

### 🛠️ Tecnologías utilizadas:
- **Node.js** con módulos ES6
- **Lodash** para manipulación eficiente de datos
- **Inquirer.js** para interfaces interactivas
- **File System (fs)** para persistencia
- **Arquitectura modular** con separación de responsabilidades

### 🔧 Características técnicas avanzadas:
- **Ordenamiento inteligente**: Tareas pendientes primero, luego por fecha
- **IDs únicos**: Generados con Lodash para evitar conflictos
- **Validaciones**: Prevención de tareas vacías y duplicadas
- **Búsqueda insensible a mayúsculas**: Encuentra tareas fácilmente
- **Estadísticas completas**: Total, completadas, pendientes y día más productivo
- **Confirmaciones**: Para operaciones destructivas como eliminar

## 🏗️ Arquitectura del proyecto

```
gestor-tareas/
├── index.js                    # Punto de entrada principal
├── package.json               # Dependencias y scripts
├── README.md                  # Documentación
├── controllers/
│   └── tareasController.js    # Lógica de negocio de tareas
├── models/
│   └── tarea.js              # Modelo de datos con Lodash
├── utils/
│   ├── menu.js               # Interfaz del menú CLI
│   └── fileStorage.js        # Gestión de persistencia
└── data/
    ├── tareas.js             # Gestión del estado global
    └── tareas.json           # Archivo de persistencia (generado automáticamente)
```

## 🎮 Uso de la aplicación

### Menú principal
Al iniciar la aplicación, verás el siguiente menú:

```
📋 ¿Qué deseas hacer?
➕ Agregar nueva tarea
📝 Listar todas las tareas
✅ Listar tareas completadas
⏳ Listar tareas pendientes
🎯 Marcar tarea como completada
✏️ Editar tarea
🔍 Buscar tareas
📊 Ver estadísticas
🗑️ Eliminar tarea
👋 Salir
```

### Funcionalidades detalladas:

#### ➕ Agregar nueva tarea
- Solicita descripción de la tarea
- Valida que no esté vacía
- Previene duplicados (insensible a mayúsculas)
- Genera ID único automáticamente
- Guarda automáticamente en archivo

#### 📝 Listar tareas
- **Todas**: Muestra todas las tareas ordenadas
- **Completadas**: Solo tareas terminadas
- **Pendientes**: Solo tareas por hacer
- Formato: `[✅/❌] Descripción (fecha)`
- Ordenamiento inteligente por estado y fecha

#### 🎯 Marcar como completada
- Lista solo tareas pendientes
- Marca fecha y hora de completación
- Actualización automática del archivo

#### ✏️ Editar tarea
- Selecciona de lista ordenada
- Previene descripción vacía
- Valida duplicados
- Mantiene ID y fechas originales

#### 🔍 Buscar tareas
- Búsqueda por palabra clave
- Insensible a mayúsculas
- Muestra resultados ordenados
- Cuenta total de coincidencias

#### 📊 Ver estadísticas
```
📊 Estadísticas de tareas:
   Total: 15
   Completadas: 10 (67%)
   Pendientes: 5
   Día más productivo: 15/9/2024 (3 tareas)
```

#### 🗑️ Eliminar tarea
- Selección de lista visual
- Confirmación obligatoria
- Eliminación definitiva
- Actualización automática

## 🔧 Uso de Lodash

El sistema utiliza extensivamente Lodash para optimizar las operaciones:

### 1. **Generación de IDs únicos**
```javascript
this.id = _.uniqueId('tarea_'); // Genera: tarea_1, tarea_2, etc.
```

### 2. **Validaciones robustas**
```javascript
_.isEmpty(descripcion?.trim()) // Valida cadenas vacías o solo espacios
```

### 3. **Ordenamiento inteligente**
```javascript
_.orderBy(tareas, ['completada', 'fechaCreacion'], ['asc', 'desc'])
```

### 4. **Filtrado eficiente**
```javascript
_.filter(tareas, 'completada') // Solo tareas completadas
_.filter(tareas, t => !t.completada) // Solo pendientes
```

### 5. **Eliminación de duplicados**
```javascript
_.find(tareas, t => _.toLower(t.descripcion) === _.toLower(input))
```

### 6. **Búsqueda avanzada**
```javascript
_.filter(tareas, tarea =>
  _.includes(_.toLower(tarea.descripcion), _.toLower(termino))
)
```

### 7. **Agrupación y estadísticas**
```javascript
_.groupBy(tareas, tarea => new Date(tarea.fechaCreacion).toDateString())
_.maxBy(grupos, ([fecha, tareas]) => tareas.length)
```

### 8. **Eliminación segura**
```javascript
_.remove(tareas, { id: tareaSeleccionada })
```

## 💾 Persistencia de datos

### Ubicación del archivo
Los datos se guardan automáticamente en: `data/tareas.json`

### Estructura del archivo JSON
```json
[
  {
    "id": "tarea_1",
    "descripcion": "Completar el proyecto",
    "completada": false,
    "fechaCreacion": "2024-09-17T10:30:00.000Z"
  },
  {
    "id": "tarea_2",
    "descripcion": "Revisar documentación",
    "completada": true,
    "fechaCreacion": "2024-09-16T14:20:00.000Z",
    "fechaCompletada": "2024-09-17T09:15:00.000Z"
  }
]
```

### Operaciones automáticas
- **Carga**: Al iniciar la aplicación
- **Guardado**: Después de cada operación (crear, editar, completar, eliminar)
- **Respaldo**: Se mantiene la integridad de datos en todo momento

## 🔒 Validaciones y seguridad

### Validaciones implementadas:
- ✅ **Descripción no vacía**: Previene tareas sin contenido
- ✅ **Sin duplicados**: Comparación insensible a mayúsculas
- ✅ **Confirmación de eliminación**: Previene eliminaciones accidentales
- ✅ **Manejo de errores**: Recuperación elegante ante fallos

### Manejo de archivos:
- ✅ **Creación automática**: Si no existe el archivo de datos
- ✅ **Permisos**: Verificación de acceso antes de operaciones
- ✅ **Integridad**: Validación JSON antes de guardar

## 🚀 Scripts disponibles

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js"
  }
}
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia ISC.

## 🆘 Troubleshooting

### Problemas comunes:

**Error: "Cannot find module 'lodash'"**
```bash
npm install
```

**Error: "Permission denied"**
- Verifica permisos de escritura en la carpeta `data/`

**Error: "Invalid JSON"**
- Elimina el archivo `data/tareas.json` (se regenerará automáticamente)

**La aplicación no guarda datos**
- Verifica que existe la carpeta `data/` en el directorio del proyecto

---

¡Disfruta gestionando tus tareas de manera profesional! 🎉