# JEX Backend
Repositorio correspondiente al backend de la aplicacion JEX.

## Flujo de Trabajo

1. Clona el repositorio.
2. *Crea una nueva rama basada en la rama `main`, siguiendo la nomenclatura adecuada.
3. Trabaja exclusivamente en tu nueva rama
4. Hace `git pull origin main` antes de subir tus cambios para asegurarte de que tu rama esté actualizada.
5. Crea un Pull Request (PR hacia `main`.
6. Una vez aceptado el PR la rama será eliminada y los cambios se integrarán a `main`.

---

## Nomenclatura de ramas

Toda nueva funcionalidad o corrección debe crearse a partir de `main` y utilizar la siguiente convención de nombres:

- `feat/nombre-descriptivo` → para nuevas **funcionalidades** (`feature`)
- `fix/nombre-descriptivo` → para **correcciones de errores** (`fixes`)

---


## Proceso de ejemplo

Antes de los cambios
- `git pull develop`
- `git checkout -b "fix/nombre-rama"`

Una vez hecho los cambios

- `git pull origin develop`
- `git add .`
- `git commit -m "nombre commit"`
- `git push`
  
Ir al repositorio de github y crear la pull request desde ahi

---
