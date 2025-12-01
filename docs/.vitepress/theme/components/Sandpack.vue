<script setup lang="ts">
import { Sandpack } from '@codesandbox/sandpack-react'
import { h } from 'vue'

interface Props {
    template?: 'vanilla' | 'vanilla-ts' | 'react' | 'react-ts' | 'vue' | 'vue-ts' | 'angular' | 'svelte'
    files?: Record<string, string | { code: string; hidden?: boolean; active?: boolean; readOnly?: boolean }>
    theme?: 'light' | 'dark' | 'auto'
    options?: {
        showNavigator?: boolean
        showTabs?: boolean
        showLineNumbers?: boolean
        showInlineErrors?: boolean
        wrapContent?: boolean
        editorHeight?: number | string
        editorWidthPercentage?: number
        closableTabs?: boolean
        classes?: {
            'sp-wrapper'?: string
            'sp-layout'?: string
            'sp-stack'?: string
            'sp-code-editor'?: string
            'sp-preview'?: string
        }
    }
    customSetup?: {
        dependencies?: Record<string, string>
        devDependencies?: Record<string, string>
        entry?: string
    }
}

const props = withDefaults(defineProps<Props>(), {
    template: 'react-ts',
    theme: 'dark',
    options: () => ({
        showNavigator: false,
        showTabs: true,
        showLineNumbers: true,
        showInlineErrors: true,
        wrapContent: false,
        editorHeight: 400,
        editorWidthPercentage: 50,
        closableTabs: false,
    })
})

// Render Sandpack as React component using h()
const renderSandpack = () => {
    return h(Sandpack as any, {
        template: props.template,
        files: props.files,
        theme: props.theme,
        options: props.options,
        customSetup: props.customSetup,
    })
}
</script>

<template>
    <div class="sandpack-wrapper">
        <component :is="renderSandpack()" />
    </div>
</template>

<style scoped>
.sandpack-wrapper {
    margin: 1rem 0;
    border-radius: 8px;
    overflow: hidden;
}

.sandpack-wrapper :deep(.sp-wrapper) {
    border-radius: 8px;
}

.sandpack-wrapper :deep(.sp-layout) {
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
}

/* Dark theme adjustments */
.dark .sandpack-wrapper :deep(.sp-layout) {
    border-color: var(--vp-c-divider);
}
</style>
