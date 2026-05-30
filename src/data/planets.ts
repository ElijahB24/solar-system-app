export interface PlanetData {
    id: string;
    name: string;
    radius: number; //visual scale size
    semiMajorAxis: number; //distance from sun
    speed: number; //orbital speed coefficient, not actual speed
    texturePath: string; //matches /public/textures/
    color: string; //fallback color
    description: string;
    facts: string[]; //rendered in UI on click
    hasRings: boolean; //trigger for ring rendering
}

export const PLANETS: PlanetData[] = [
    { //mercury
        id: 'mercury',
        name: 'Mercury',
        radius: 0.4,
        semiMajorAxis: 6,
        speed: 0.04,
        texturePath: '/textures/mercury.jpg',
        color: '#8c8c8c',
        description: 'The smalled planet in out solar system and the closest to the Sun.',
        facts: [
            'A year on Mercury is equivalent to 88 days on Earth.',
            'Despite being closest to the Sun, it is not the hottest planet (Venus is).',
            'Mercury has a massive iron core that takes up to 42% of its volume'
        ],
        hasRings: false

    },
    { //venus
        id: 'venus',
        name: 'Venus',
        radius: 0.9,
        semiMajorAxis: 9,
        speed: 0.015,
        texturePath: '/textures/venus.jpg',
        color: '#e3bb76',
        description: 'Venus has a thick, toxic atmosphere filled with carbon dioxide.',
        facts: [
            'Venus spins backwards on its axis compared to most other planets.',
            'Its atmospheric pressure is 90 times greater than Earth\'s. Crushing anything that lands on the planet',
            'Surface temperatures reach a scorching 475°C (900°F).'
        ],
        hasRings: false

    },
    {//earth
        id: 'earth',
        name: 'Earth',
        radius: 0.6,
        semiMajorAxis: 13,
        speed: 0.01,
        texturePath: '/textures/earth.jpg',
        color: '#2b82c9',
        description: 'Our home planet is the only place we know of so far that’s inhabited by living things.',
        facts: [
            'Water covers about 71% of Earth\'s surface.',
            'Earth’s atmosphere protects us from incoming meteoroids, which safely burn up before hitting ground.',
            'It is the only planet in our solar system not named after a god or goddess.'
        ],
        hasRings: false

    },
    {//mars
        id: 'mars',
        name: 'Mars',
        radius: 0.6,
        semiMajorAxis: 17,
        speed: 0.008,
        texturePath: '/textures/mars.jpg',
        color: '#c1440e',
        description: 'Mars is a dusty, cold, desert world with a very thin atmosphere.',
        facts: [
            'Mars is home to Olympus Mons, the largest volcano in the solar system (3x taller than Mt. Everest).',
            'Liquid water cannot exist on Mars’ surface for long due to the low atmospheric pressure.',
            'Iron oxide (rust) in its soil gives Mars its signature red look.'
        ],
        hasRings: false

    },
    {//jupiter
        id: 'jupiter',
        name: 'Jupiter',
        radius: 2.2,
        semiMajorAxis: 24,
        speed: 0.002,
        texturePath: '/textures/jupiter.jpg',
        color: '#b07f35',
        description: 'Jupiter is more than twice as massive than the other planets of our solar system combined.',
        facts: [
            'Jupiter’s Great Red Spot is a massive storm wider than Earth that has raged for hundreds of years.',
            'It possesses a powerful magnetic field 14 times stronger than Earth’s.',
            'Jupiter functions as a gravitational shield, capturing or deflecting incoming comets.'
        ],
        hasRings: false
    },
    {//saturn
        id: 'saturn',
        name: 'Saturn',
        radius: 1.8,
        semiMajorAxis: 30,
        speed: 0.0009,
        texturePath: '/textures/saturn.jpg',
        color: '#e2bf7d',
        description: 'Adorned with a dazzling, complex system of icy rings, Saturn is a unique gas giant.',
        facts: [
            'Saturn’s rings are not solid structures; they are made of billions of individual particles of ice and rock.',
            'It is the least dense planet in the solar system—it could literally float in a giant bathtub.',
            'Winds in Saturn’s upper atmosphere can reach a staggering 1,800 kilometers per hour.'
        ],
        hasRings: true

    }
];