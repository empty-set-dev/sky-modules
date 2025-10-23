import PageContext from './Page.context';
export default function usePageContext(): Vike.PageContext {
  return useContext(PageContext) as Vike.PageContext;
}