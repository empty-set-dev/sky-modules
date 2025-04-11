import React from 'react'

import MediaContextProvider, { Media, mediaStyle } from '#/providers/MediaContextProvider'

export default function Homeage(): ReactNode {
    return (
        <MediaContextProvider disableDynamicMediaQueries i18nIsDynamicList>
            <style dangerouslySetInnerHTML={{ __html: mediaStyle }}></style>
            <Media at="xs">Mobile App</Media>
            <Media between={['sm', 'lg']}>Tablet App</Media>
            <Media greaterThanOrEqual="lg">Desktop App</Media>
        </MediaContextProvider>
    )
}
