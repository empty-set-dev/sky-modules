import CanvasContext from './Canvas.context';
export default function useCanvasContext(): HTMLCanvasElement {
  return useContext(CanvasContext) as HTMLCanvasElement;
}