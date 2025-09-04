import { createContext } from 'react'

const ThemeContext = createContext({})
export default ThemeContext

export function ThemeContextProvider(props: { theme?: string } & PropsWithChildren): ReactNode {
    return <ThemeContext.Provider value={props.theme!}>{props.children}</ThemeContext.Provider>
}
