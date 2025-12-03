import globalify from '@sky-modules/core/globalify'

import * as imports from '../HexagonGridEditor'

declare global {
    const HexagonGridEditor: typeof imports.HexagonGridEditor
    type HexagonGridEditor = imports.HexagonGridEditor
    type HexagonGridEditorParameters = imports.HexagonGridEditorParameters
}

globalify({ ...imports })
