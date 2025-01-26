# Pymes + Factus - Backend

Este proyecto es el backend de un sistema de facturación electrónica diseñado para Colombia. Permite generar facturas de ventas con el formato obligatorio de la DIAN (Dirección de Impuestos y Aduanas Nacionales), así como gestionar productos y contactos.

## Características

- **Generación de Facturas Electrónicas**:
  - Compatible con el estándar de la DIAN para facturación electrónica.
  - Emisión de facturas en formato PDF según las normativas legales.

- **Gestión de Productos**:
  - Crear, actualizar, consultar y eliminar productos.

- **Gestión de Contactos**:
  - Registro de clientes y proveedores.
  - Gestión de datos de contacto y configuración específica para facturación.

## Tecnologías Usadas

- **Node.js**: Plataforma de ejecución para JavaScript en el backend.
- **Express.js**: Framework para crear APIs RESTful.
- **MySQL**: Base de datos relacional, utilizando XAMPP para la gestión local.
- **Docker**: Para contenerización y despliegue de la aplicación (opcional).

## Instalación y Configuración

### Requisitos previos

Asegúrate de tener instalados los siguientes programas en tu máquina:

- [Node.js](https://nodejs.org/) (v18 o superior).
- [XAMPP](https://www.apachefriends.org/) (para MySQL).
- [Docker](https://www.docker.com/) (opcional, si deseas ejecutar la aplicación en contenedores).

### Configuración del Proyecto

Este proyecto **no utiliza un archivo `.env`**. Toda la configuración se encuentra en el archivo `configs/config.js`. En este archivo puedes definir parámetros como la configuración de la base de datos, puertos de la aplicación, entre otros. Asegúrate de revisar y ajustar las configuraciones necesarias según tu entorno.

## Docker

Para facilitar el despliegue de la aplicación, se ha incluido soporte para Docker. A continuación, te explicamos cómo crear la imagen y el contenedor.

### Creación de la Imagen Docker

1. Navega a la carpeta raíz del proyecto.
2. Ejecuta el siguiente comando para construir la imagen de Docker:
   ```bash
   docker build -t pymes-backend .
   ```

### Creación y Ejecución del Contenedor Docker

1. Una vez que la imagen esté construida, puedes crear y ejecutar un contenedor con el siguiente comando:
   ```bash
   docker run -d -p 5050:5050 --name pymes-backend-container pymes-backend
   ```

2. Para verificar que el contenedor esté funcionando, puedes ejecutar:
   ```bash
   docker ps
   ```

## Uso

1. Clona este repositorio en tu máquina local:
   ```bash
   git clone https://github.com/CardonaAndres/PymesWithFactus.git
   ```

2. Navega a la carpeta del proyecto:
   ```bash
   cd PymesWithFactus
   ```

3. Instala las dependencias:
   ```bash
   npm install
   ```

4. Inicia el servidor:
   ```bash
   npm start
   ```

El servidor estará disponible en [http://localhost:5050](http://localhost:5050).

---

¡Listo! Ahora puedes comenzar a utilizar el backend de este sistema de facturación electrónica.

