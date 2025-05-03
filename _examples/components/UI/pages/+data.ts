import data from "sky/platform/web/helpers/data";
import { PageContext } from "vike/types";

export default data(async pageContext => {
    await pageContext.init({
        ns: [],
        theme: 'dark',
    })

    return {
        title: 'sky/components/UI',
        description: '',
    }
})
