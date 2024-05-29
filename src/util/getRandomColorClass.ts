import { ColorClass } from '@src/constants/misc';

export const getRandomColorClass = () => {
  const colors = Object.values(ColorClass);
  const randomIndex = Math.floor(colors.length * Math.random());

  return colors[randomIndex];
};
