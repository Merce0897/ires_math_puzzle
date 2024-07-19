export const generateMath = () => {
    const number1 = Math.floor(Math.random() * 99) + 1;
    const number2 = Math.floor(Math.random() * 99) + 1;
    const operator = Math.random() < 0.5 ? '+' : '-';
    const result = operator === '+' ? number1 + number2 : number1 - number2;
    if (result < 0 || result > 100) return generateMath();
    return { number1, number2, operator, result };
}

export const checkExist = (maths, newMath) => {
    return maths.some(math => {
        return math.number1 === newMath.number1 && math.number2 === newMath.number2 && math.operator === newMath.operator;
    })
}