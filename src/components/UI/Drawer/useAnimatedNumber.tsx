import { useEffect, useState } from 'react';

export default function useAnimatedNumber(value: number, duration = 60){
    const [animatedValue, setAnimatedValue] = useState(value);

    useEffect(() => {
        const startValue = animatedValue;
        const startTime = performance.now();

        const updateValue = (currentTime: any) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const newValue = Math.round(startValue + (value - startValue) * progress);
            setAnimatedValue(newValue);

            if (progress < 1) {
                requestAnimationFrame(updateValue);
            }
        };

        requestAnimationFrame(updateValue);
    }, [value, duration, animatedValue]);

    return animatedValue;
};
