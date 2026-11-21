# Pixel Hack Kids with Canva 🚀

Plataforma interactiva para el hackathon infantil **Pixel Hack Kids with Canva** en Medellín. Los equipos recorren las **5 islas del Design Thinking** para resolver 3 retos reales de ciudad usando Canva, código e inteligencia artificial.

## ✨ Funcionalidades principales

- **🏠 Inicio (`/`)**: Presentación del hackathon, personajes, camino del Design Thinking y agenda del día.
- **🏙️ Retos de ciudad (`/retos`)**: Los 3 retos de Medellín con sus videos explicativos y el video guía de **Isla 3 · Ideación**.
- **🎮 Equipos y 5 Islas (`/equipos`)**: Creación de equipos con avatar personalizado, enlace a carpeta de Drive, votación del reto en Isla 2, videos de apoyo y aprobación por tallerista.
- **🧰 Recursos (`/recursos`)**: Enlaces a Canva, lenguajes de programación y prompts de IA listos para copiar.
- **💛 Bienestar (`/bienestar`)**: Guía de convivencia, pausas activas y cuidado.
- **🛠️ Panel de Admin (`/admin`)**:
  - Control del **cronómetro de la hackathon** con inicio, reanudación, reinicio y **pausas con motivo** (*Se movieron de isla*, *Están comiendo*, *Descanso*, *Anuncio del tallerista* o motivo personalizado), visible en tiempo real en toda la app.
  - Revisión de trabajos (enlaces de Drive, progreso y evidencias) con **calificación por criterios** y **review escrita**.
  - Publicación y control del podio.
- **🏆 Podio de Ganadores (`/podio`)**: Presentación interactiva del Top 3 con confeti, efectos de sonido, puntajes, reviews del jurado y modo suspenso para revelar puesto por puesto.

## 🛠️ Desarrollo local

```bash
npm install --legacy-peer-deps
npm run dev
```

Abre `http://localhost:8080`.

## ☁️ Despliegue en Vercel

El proyecto incluye [`vercel.json`](./vercel.json) listo para importar el repositorio en Vercel (`VERCEL=1` activa automáticamente el preset de Nitro para Vercel).

Variables de entorno requeridas en Vercel (desde tu proyecto de Supabase):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_PROJECT_ID`
- `SUPABASE_SERVICE_ROLE_KEY`
