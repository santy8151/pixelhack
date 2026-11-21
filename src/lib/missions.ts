export type Stage = {
  key: string; title: string; world: string; emoji: string; tool: string; bg: string;
  desc: string; time: string; guide: string; steps: string[]; deliverable: string;
};

// The 5 islands of the event (from the master planning document).
export const STAGES: readonly Stage[] = [
  { key: "empatizar", title: "Empatizar", world: "Isla 1 · Empatía", emoji: "💛", tool: "📺 Videos + preguntas", bg: "bg-sun", time: "1:20 – 1:40 p. m.", guide: "Alison y Santiago",
    desc: "Conocemos los 3 retos de Medellín y a las personas que los viven.",
    steps: ["Vemos 3 videos cortos, uno por cada reto de ciudad.", "Hacemos todas las preguntas que queramos. ¡No hay preguntas tontas!"],
    deliverable: "Una foto del equipo con su pregunta o dato favorito" },
  { key: "definir", title: "Definir", world: "Isla 2 · Definición", emoji: "🎯", tool: "🗳️ Tablero de papel Kraft", bg: "bg-pink", time: "1:46 – 2:06 p. m.", guide: "Alison y Santiago",
    desc: "Votamos con caritas y elegimos el reto de nuestro equipo.",
    steps: ["Miramos el tablero con 3 columnas, una por reto.", "Cada uno pega su carita o estrellita en el reto que más le motiva.", "¡El reto con más votos es nuestra misión oficial! Lo firmamos."],
    deliverable: "Foto del tablero con los votos y la firma del equipo" },
  { key: "idear", title: "Idear", world: "Isla 3 · Ideación", emoji: "💡", tool: "🖍️ Brain-drawing + Árbol", bg: "bg-cyan", time: "2:42 – 3:02 p. m.", guide: "Sara Londoño",
    desc: "Lluvia de dibujos y Árbol de Soluciones.",
    steps: ["Lluvia de dibujos: sin palabras, cada uno dibuja ideas en rondas relámpago de 3 minutos.", "Pasamos los dibujos a Post-its y los colgamos en el Árbol de Soluciones: ramas 'Locas', 'Fáciles' y 'Súper Tecnológicas'."],
    deliverable: "Foto del Árbol de Soluciones con sus Post-its" },
  { key: "prototipar", title: "Prototipar", world: "Isla 4 · Prototipado", emoji: "🛠️", tool: "🎨 Canva + 🤖 IA", bg: "bg-sun", time: "3:08 – 3:28 p. m.", guide: "Caro Data y Erika",
    desc: "Pasamos el dibujo a lo digital con Canva e inteligencia artificial.",
    steps: ["Hacemos un boceto rápido en papel.", "Lo convertimos en diseño digital en Canva.", "Con ayuda de la IA creamos una maqueta o prototipo de nuestra idea."],
    deliverable: "Enlace o captura del prototipo en Canva" },
  { key: "evaluar", title: "Probar y Comunicar", world: "Isla 5 · Probar y Comunicar", emoji: "🎩", tool: "🎩 Sombreros de Inclusión + pitch", bg: "bg-pink", time: "3:34 – 3:54 p. m.", guide: "Reina Plata",
    desc: "Probamos que nuestra idea sirva para todos y la comunicamos: ¡exponemos nuestra idea!",
    steps: ["Nos ponemos los Sombreros de Inclusión y probamos la idea como si fuéramos personas con distintas necesidades.", "Mejoramos lo que haga falta.", "Exponemos nuestra idea en un pitch de 2 minutos donde todos hablan."],
    deliverable: "Video corto del ensayo del pitch" },
];
