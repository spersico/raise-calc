export const round = (n, decimals = 4) => Number(`${Math.round(`${n}e${decimals}`)}e-${decimals}`);

export const calculateChangeRate = (current, previous) => {
    return ((current - previous) / previous) * 100;
};

export const calculateAverage = (arrayOfNumbers) => {
    const cleanArray = arrayOfNumbers.filter(Number.isFinite);
    return (
        cleanArray.reduce((acum, cur) => acum + cur, 0) / cleanArray.length || null
    );
};