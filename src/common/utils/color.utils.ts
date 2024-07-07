export const generateDistinctColors = (count: number) => {
  let colors = [];
  let lastHue = Math.random() * 360;
  for (let i = 0; i < count; i++) {
    lastHue = (lastHue + (360 / count) * (0.5 + Math.random() * 0.5)) % 360;
    const color = `hsl(${lastHue}, 70%, 60%)`;
    colors.push(color);
  }
  return colors;
};
