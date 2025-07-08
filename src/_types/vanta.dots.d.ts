declare module 'vanta/src/vanta.dots' {
  const vantaEffect: (options: unknown) => {
    destroy: () => void;
    setOptions?: (options: unknown) => void;
  };
  export default vantaEffect;
}
