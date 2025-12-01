<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
    id: string
    label?: string
}

const props = defineProps<Props>()

const url = ref<string | null>(null)
const error = ref<string | null>(null)

onMounted(async () => {
    try {
        const response = await fetch('/playground-links.json')
        if (!response.ok) {
            throw new Error('Failed to load playground links')
        }
        const data = await response.json()
        url.value = data.sandboxes[props.id]
        if (!url.value) {
            error.value = `Playground "${props.id}" not found`
        }
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Unknown error'
    }
})
</script>

<template>
    <div class="playground-link">
        <a v-if="url" :href="url" target="_blank" rel="noopener noreferrer" class="playground-button">
            <span class="icon">🎮</span>
            <span class="text">{{ label || 'Open in CodeSandbox' }}</span>
            <span class="arrow">→</span>
        </a>
        <div v-else-if="error" class="playground-error">
            <span class="icon">⚠️</span>
            <span class="text">{{ error }}</span>
        </div>
        <div v-else class="playground-loading">
            <span class="icon">⏳</span>
            <span class="text">Loading playground...</span>
        </div>
    </div>
</template>

<style scoped>
.playground-link {
    margin: 1.5rem 0;
}

.playground-button {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
}

.playground-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
}

.playground-button .icon {
    font-size: 1.2em;
}

.playground-button .text {
    flex: 1;
}

.playground-button .arrow {
    font-size: 1.2em;
    transition: transform 0.3s ease;
}

.playground-button:hover .arrow {
    transform: translateX(4px);
}

.playground-error,
.playground-loading {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: #f5f5f5;
    border-radius: 8px;
    color: #666;
}

.playground-error {
    background: #fee;
    color: #c33;
}

.playground-error .icon {
    font-size: 1.2em;
}
</style>
