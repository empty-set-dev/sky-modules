export interface DesignSystemContextType {
  brand?: string;
  mode?: 'light' | 'dark';
  palette?: string;
  changeBrand: (design: string) => void;
  toggleTheme: () => void;
  changePalette: (schema: string) => void;
}