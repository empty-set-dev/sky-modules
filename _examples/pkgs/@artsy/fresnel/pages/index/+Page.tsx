import React from 'react'

import MediaContextProvider, { Media } from '#/providers/MediaContextProvider'

export default function Homeage(): ReactNode {
    return (
        <MediaContextProvider>
            <Media at="xs">Mobile App</Media>
            <Media between={['sm', 'lg']}>Tablet App</Media>
            <Media greaterThanOrEqual="lg">Desktop App</Media>
        </MediaContextProvider>
    )
}
