## 🐍 Entorno Virtual

### 🔧 Crear el entorno virtual

- **Windows**:

  ```bash
  python -m venv venv
  ```

- **Linux / WSL**:

  ```bash
  python3 -m venv venv
  ```

### ⚡ Activar el entorno virtual

- **Windows (CMD o PowerShell)**:

  ```bash
  venv\Scripts\activate
  ```

- **Linux / WSL**:

  ```bash
  source venv/bin/activate
  ```

  ## 📦 Instalar dependencias
   ```bash
  pip install -r requirements.txt
  ```

## 🗃️ Ejecutar migraciones

   ```bash
  python manage.py migrate
  ```

## 🚀 Ejecutar el servidor

 ```bash
  python manage.py runserver
  ```


