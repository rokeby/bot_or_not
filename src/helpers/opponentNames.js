const opponents = [
    {name: 'Rando'},
    {name: 'Presidente'},
    {name: 'Bernie'},
    {name: 'Yango'},
];

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const opponent = opponents[getRandomInt(0,opponents.length-1)].name

