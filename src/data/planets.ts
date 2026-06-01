export interface PlanetData {
    id: string;
    name: string;
    radius: number;
    semiMajorAxis: number;
    speed: number;
    texturePath: string;
    color: string;
    description: string;
    facts: string[];
    hasRings: boolean;
    parentId?: string;
    // We keep natural_sat for potential future moons, but Earth's moon is now independent
    natural_sat?: {
        id: string;
        name: string;
        radius: number;
        semiMajorAxis: number;
        speed: number;
        texturePath: string;
        description?: string;
        facts?: string[];
    }[];
}

export const PLANETS: PlanetData[] = [
    { id: 'sun', name: 'The Sun', radius: 3.5, semiMajorAxis: 0, speed: 0, texturePath: '/textures/sun.jpg', color: '#ffcc00', description: 'The star at the heart of our solar system.', facts: ['4.5 billion years old.', 'Core temp 15 million C.', 'Light takes 8m 20s to reach Earth.'], hasRings: false },
    { id: 'mercury', name: 'Mercury', radius: 0.4, semiMajorAxis: 6, speed: 0.04, texturePath: '/textures/mercury.jpg', color: '#8c8c8c', description: 'Closest to the Sun.', facts: ['88-day year.', 'Not the hottest planet.', 'Huge iron core.'], hasRings: false },
    { id: 'venus', name: 'Venus', radius: 0.9, semiMajorAxis: 9, speed: 0.015, texturePath: '/textures/venus.jpg', color: '#e3bb76', description: 'Thick, toxic atmosphere.', facts: ['Spins backwards.', 'Crushing pressure.', '475°C.'], hasRings: false },
    { id: 'earth', name: 'Earth', radius: 0.6, semiMajorAxis: 13, speed: 0.01, texturePath: '/textures/earth.jpg', color: '#2b82c9', description: 'Our home.', facts: ['71% water.', 'Protective atmosphere.', 'No god name.'], hasRings: false },
    { 
        id: 'moon', 
        name: 'The Moon', 
        radius: 0.25, 
        semiMajorAxis: 2.0, 
        speed: 0.05, 
        texturePath: '/textures/moon.jpg', 
        color: '#aaaaaa',
        description: 'Earth’s natural satellite.', 
        facts: ['Stabilizes Earth tilt.', 'Fifth largest moon.', 'No atmosphere.'], 
        hasRings: false,
        parentId: 'earth' // // added parentId to link moon to earth for potential future use
    },
    { id: 'mars', name: 'Mars', radius: 0.6, semiMajorAxis: 17, speed: 0.008, texturePath: '/textures/mars.jpg', color: '#c1440e', description: 'The Red Planet.', facts: ['Largest volcano.', 'No liquid water.', 'Rusty soil.'], hasRings: false },
    { id: 'jupiter', name: 'Jupiter', radius: 2.2, semiMajorAxis: 24, speed: 0.002, texturePath: '/textures/jupiter.jpg', color: '#b07f35', description: 'Gas giant.', facts: ['Great Red Spot.', 'Strong magnetic field.', 'Gravitational shield.'], hasRings: false },
    { id: 'saturn', name: 'Saturn', radius: 1.8, semiMajorAxis: 30, speed: 0.0009, texturePath: '/textures/saturn.jpg', color: '#e2bf7d', description: 'Ringed world.', facts: ['Billions of ice particles.', 'Low density.', 'Fast winds.'], hasRings: true },
    { id: 'uranus', name: 'Uranus', radius: 1.5, semiMajorAxis: 36, speed: 0.0004, texturePath: '/textures/uranus.jpg', color: '#d1e7e7', description: 'Icy giant.', facts: ['Rotates on side.', 'Methane atmosphere.', '27 moons.'], hasRings: true },
    { id: 'neptune', name: 'Neptune', radius: 1.4, semiMajorAxis: 42, speed: 0.0003, texturePath: '/textures/neptune.jpg', color: '#3e54e8', description: 'Distant blue world.', facts: ['Found by math.', 'Strongest winds.', '165-year orbit.'], hasRings: false }
];