import chispa from "@/assets/chispa.png";
import cubo from "@/assets/cubo.png";
import bolita from "@/assets/bolita.png";

export type Reto = {
  n: 1 | 2 | 3; video: string; emoji: string; title: string; short: string; desc: string; mission: string;
  img: string; bg: string; fact: { big: string; text: string };
};

// City challenges as written in the event's master document.
export const RETOS: Reto[] = [
  { n: 1, video: "/videos/reto1_guardianes_agua.mp4", emoji: "🌊", title: "Guardianes del Agua y las Quebradas", short: "Basuras e inundaciones", img: chispa, bg: "bg-cyan",
    desc: "Las quebradas de Medellín son como las venas por donde corre el agua. Hay MILES tapadas por basura y escombros, y cuando llueve fuerte el agua se desborda, ¡hasta en la estación Acevedo del Metro!",
    mission: "Inventar un juego o un superhéroe ecológico para cuidar las quebradas.",
    fact: { big: "Miles", text: "de quebradas de Medellín están taponadas por basura y escombros." } },
  { n: 2, video: "/videos/reto2_club_amistad.mp4", emoji: "🧩", title: "El Club de la Amistad y los Súper Espacios", short: "Salud mental y soledad", img: cubo, bg: "bg-pink",
    desc: "Muchísimos niños se sienten solitos o aburridos porque en sus barrios faltan lugares seguros para jugar, hacer deporte o mostrar su arte.",
    mission: "Inventar un club secreto o una app donde ningún niño se sienta solo y todos muestren sus talentos.",
    fact: { big: "Muchos", text: "niños y jóvenes se sienten solos y tienen pocas actividades culturales o deportivas cerca." } },
  { n: 3, video: "/videos/reto3_hogares_seguros.mp4", emoji: "🏡", title: "Constructores de Hogares Seguros", short: "Vivienda", img: bolita, bg: "bg-sun",
    desc: "En Medellín faltan 38.000 casas nuevas y más de 153.000 familias viven apretadas o en zonas de peligro.",
    mission: "Rediseñar una casa ecológica, modular y súper segura para estas familias.",
    fact: { big: "38.000", text: "casas nuevas faltan en Medellín, y 153.000 viviendas están en riesgo." } },
];

export const retoOf = (n: number) => RETOS.find((r) => r.n === n);

export const IDEACION_VIDEO = "/videos/isla3_ideacion.mp4";
