import { onMount, createSignal, createMemo } from 'solid-js';

    export interface DesignSystemProviderProps {
children?: Mitosis.Children;
brand?: string;
initialTheme?: 'light' | 'dark' | 'auto';
initialPalette?: string;
}

    import  DesignSystemContext from './DesignSystem.context';

    function DesignSystemProvider(props:DesignSystemProviderProps) {

const [brand, setBrand] = createSignal(props.brand)

const [theme, setTheme] = createSignal(props.initialTheme ?? 'light')

const [palette, setPalette] = createSignal(props.initialPalette)

function changeBrand(brand: string) {
setBrand(brand);
}

function toggleTheme() {
setTheme(theme() === 'light' ? 'dark' : 'light');
}

function changePalette(palette: string) {
setPalette(palette);
}

        onMount(() => { brand() && document.body.setAttribute('data-brand', brand());
theme() && document.body.setAttribute('data-theme', theme());
palette() && document.body.setAttribute('data-palette', palette()) })

        return (<>
            <DesignSystemContext.Provider  value={{
brand: brand(),
theme: theme(),
palette: palette(),
changeBrand: changeBrand,
toggleTheme: toggleTheme,
changePalette: changePalette
}} ><>{props.children}</></DesignSystemContext.Provider>

            </>)
    }

    export default DesignSystemProvider;
