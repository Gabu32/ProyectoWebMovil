# ProyectoWebMovil
 Proyecto INF3245

 La aplicación permitirá a los usuarios gestionar tareas dentro de proyectos colaborativos en tiempo real. Se enfocará en facilitar la organización y el seguimiento de tareas en equipos de trabajo, con notificaciones instantáneas y un sistema de roles para gestionar permisos y responsabilidades. 
 
## Entrega Parcial 1 (01-09-2024)
## Tabla de Contenidos
1. [Análisis de las Funcionalidades](#Funcionalidades)
2. [Protipado en Figma](https://www.figma.com/proto/cVtLFwyjomdRb6P0eWdf4f/Project?node-id=124-2133&t=6CQFsAXwGDnjXiVS-1)
3. Maquetación Responsiva: Se realizó una maquetación responsiva de las pantallas prototipadas en Figma. Desde la página HTML 'home.html' se pueden acceder a las demás.
5. Formularios y Validación: Se realizó un formulario de registro e inicio de sesión que valida que se ingresen datos con el formato correcto. Ingresar datos correctos en el login lleva al home de la app.
6. [Tecnologías utilizadas](#Tecnologías)

# Funcionalidades

## 1. Gestión de Proyectos:

Descripción: Los usuarios podrán crear, editar, y eliminar proyectos. Cada proyecto agrupará tareas relacionadas.  
Roles: Los administradores podrán gestionar proyectos, mientras que los colaboradores podrán visualizarlos junto a sus tareas asignadas.  
Interacción: Los usuarios verán un tablero donde pueden crear nuevos proyectos o modificar los existentes. Se mostrarán estadísticas básicas, como la cantidad de tareas completadas y el progreso del proyecto.

## 2. Creación y Asignación de Tareas:

Descripción: Los usuarios podrán crear tareas dentro de un proyecto, asignarlas a miembros del equipo, y establecer fechas límite.  
Roles: Los administradores podrán asignar tareas a cualquier miembro, mientras que los colaboradores solo pueden ver y gestionar sus tareas asignadas.  
Interacción: Una interfaz intuitiva permitirá crear tareas con título, descripción, fecha límite y asignación a usuarios. Los colaboradores recibirán notificaciones cuando se les asignen tareas.

## 3. Sistema de Notificaciones en Tiempo Real:

Descripción: Cada vez que se crea, asigna, o modifica una tarea, los usuarios relevantes recibirán una notificación en tiempo real.  
Roles: Todos los usuarios recibirán notificaciones según su participación en las tareas o proyectos.  
Interacción: Se desplegarán notificaciones emergentes en la interfaz, y también se podrán consultar en un historial de notificaciones dentro de la aplicación.

## 4. Comentarios en Tareas:

Descripción: Los usuarios podrán agregar comentarios a cada tarea para mejorar la comunicación entre el equipo.  
Roles: Todos los usuarios podrán comentar en las tareas en las que están involucrados.  
Interacción: Cada tarea tendrá una sección de comentarios donde los usuarios podrán discutir detalles, plantear dudas, o dejar actualizaciones. Los comentarios aparecerán en orden cronológico.

## 5. Gestión de Permisos y Roles:

Descripción: La aplicación permitirá gestionar permisos para diferentes roles dentro de un proyecto, con niveles de acceso específicos (ej. administrador y colaborador).  
Roles: Los administradores tendrán control total, mientras que los colaboradores tendrán acceso limitado solo a las tareas asignadas y ciertos aspectos de los proyectos.  
Interacción: Un panel de administración permitirá a los usuarios con permisos gestionar roles y permisos para otros usuarios.

## 6. Visualización de Progreso y Estadísticas:

Descripción: Los usuarios podrán ver el progreso del proyecto viedo la cantidad de tareas completadas y pendientes.  
Roles: Los administradores verán estadísticas generales del proyecto, mientras que los colaboradores solo verán estadísticas de las tareas asignadas a ellos.  
Interacción: Se mostrará porcentajes de progreso, permitiendo a los usuarios evaluar el estado del proyecto rápidamente.

## 7. Historial y Registro de Actividades:

Descripción: Un historial completo de actividades dentro de cada proyecto permitirá a los usuarios revisar cambios y acciones realizadas, como la creación o modificación de tareas.  
Roles: Todos los usuarios podrán acceder al historial, pero las acciones visibles dependerán de sus permisos.  
Interacción: El historial se desplegará como una lista cronológica de eventos dentro de cada proyecto, mostrando detalles como la hora, la acción realizada, y el usuario que la llevó a cabo.

## Tecnologías
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
