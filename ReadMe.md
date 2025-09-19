# 📋 Gestor de Tareas CLI

Un sistema profesional de gestión de tareas por línea de comandos, desarrollado con Node.js, que ofrece persistencia de datos en MongoDB, validaciones robustas y una interfaz intuitiva.

## 🚀 Características

### ✨ Funcionalidades principales:
- ➕ **Crear tareas** con validación de duplicados
- 📝 **Listar tareas** (todas, completadas o pendientes)
- 🎯 **Marcar tareas como completadas**
- ✏️ **Editar tareas** existentes
- 🔍 **Buscar tareas** por palabras clave
- 📊 **Ver estadísticas** detalladas
- 🗑️ **Eliminar tareas** con confirmación
- 💾 **Persistencia automática** en MongoDB

### 🛠️ Tecnologías utilizadas:
- **Node.js** con módulos ES6
- **MongoDB** con driver nativo para persistencia
- **Lodash** para manipulación eficiente de datos
- **Inquirer.js** para interfaces interactivas
- **Arquitectura modular** con separación de responsabilidades

### 🔧 Características técnicas avanzadas:
- **Ordenamiento inteligente**: Tareas pendientes primero, luego por fecha
- **IDs únicos**: Generados con ObjectId de MongoDB para evitar conflictos
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
├── config/
│   └── database.js           # Configuración de MongoDB
├── controllers/
│   └── tareasController.js    # Lógica de negocio de tareas
├── models/
│   └── tarea.js              # Modelo de datos con MongoDB
├── utils/
│   └── menu.js               # Interfaz del menú CLI
└── data/
    └── tareas.js             # Gestión del estado global con MongoDB
```

## 🔧 Instalación y configuración

### Requisitos previos

1. **Node.js** (versión 18 o superior)
2. **MongoDB** ejecutándose en `mongodb://localhost:27017`


### Configuración de MongoDB

La aplicación utiliza la siguiente configuración por defecto:
- **URL de conexión**: `mongodb://localhost:27017`
- **Base de datos**: `gestor-tareas`
- **Colección**: `tareas`

Si necesitas cambiar esta configuración, edita el archivo `config/database.js`.

### Verificación de instalación

Si todo está configurado correctamente, al ejecutar `npm start` deberías ver:

```
🚀 Iniciando Gestor de Tareas...
✅ Conectado a MongoDB
✅ Sistema listo
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

### 1. **Generación de IDs únicos con MongoDB**
```javascript
this._id = id || new ObjectId(); // Genera ObjectIds únicos de MongoDB
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

### 8. **Eliminación segura con ObjectIds**
```javascript
_.remove(tareas, t => t._id.equals(tareaSeleccionada))
```

## 💾 Persistencia de datos con MongoDB

### Base de datos
Los datos se almacenan automáticamente en MongoDB:
- **Base de datos**: `gestor-tareas`
- **Colección**: `tareas`
- **Conexión**: `mongodb://localhost:27017`

### Estructura de documentos MongoDB
```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "descripcion": "Completar el proyecto",
  "completada": false,
  "fechaCreacion": "2024-09-17T10:30:00.000Z"
}

// Ejemplo de tarea completada
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "descripcion": "Revisar documentación",
  "completada": true,
  "fechaCreacion": "2024-09-16T14:20:00.000Z",
  "fechaCompletada": "2024-09-17T09:15:00.000Z"
}
```

### Operaciones automáticas
- **Conexión**: Al iniciar la aplicación se conecta a MongoDB
- **Carga**: Recupera todas las tareas existentes de la base de datos
- **Guardado**: Después de cada operación (crear, editar, completar, eliminar)
- **Cierre**: La conexión se cierra al salir de la aplicación
- **Integridad**: MongoDB garantiza la persistencia y consistencia de los datos

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

## 👥 Autores

- **Dylan Acevedo**
- **Jeferson Lopez**



## 🆘 Troubleshooting

### Problemas comunes:

**Error: "Cannot find module 'lodash'" o "Cannot find module 'mongodb'"**
```bash
npm install
```

**Error: "MongoNetworkError" o "Connection refused"**
- Verifica que MongoDB esté ejecutándose en `localhost:27017`
- En Windows: `net start MongoDB` o ejecuta MongoDB Compass
- En Linux/macOS: `sudo systemctl start mongod` o `brew services start mongodb-community`

**Error: "MongoServerError: Authentication failed"**
- La aplicación usa conexión sin autenticación por defecto
- Si tu MongoDB requiere autenticación, edita `config/database.js`

**La aplicación no guarda datos**
- Verifica que tengas permisos de escritura en la base de datos MongoDB
- Comprueba que la conexión a MongoDB sea exitosa (debería mostrar "✅ Conectado a MongoDB")

**Error: "MongoTopologyClosedError"**
- La conexión a MongoDB se cerró inesperadamente
- Reinicia MongoDB y ejecuta la aplicación nuevamente

### Verificar estado de MongoDB:

**Verificar si MongoDB está ejecutándose:**
```bash
# Windows
tasklist | findstr mongo

# Linux/macOS
ps aux | grep mongo
```

**Conectar manualmente a MongoDB:**
```bash
# Con MongoDB Shell
mongosh mongodb://localhost:27017

# O con MongoDB Compass (interfaz gráfica)
```

---

¡Disfruta gestionando tus tareas de manera profesional! 🎉