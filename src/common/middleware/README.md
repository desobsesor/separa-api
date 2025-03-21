# Middleware Personalizado

Esta carpeta contiene middleware personalizado que puede ser utilizado en toda la aplicación para procesar solicitudes antes de que lleguen a los controladores.

El middleware en NestJS permite:
- Ejecutar código antes de que la solicitud llegue al controlador
- Realizar cambios en los objetos de solicitud y respuesta
- Terminar el ciclo de solicitud/respuesta
- Llamar a la siguiente función de middleware en la pila

## Uso

El middleware en esta carpeta puede ser aplicado a nivel global, de módulo o de ruta para proporcionar funcionalidades como logging, autenticación, validación, etc.