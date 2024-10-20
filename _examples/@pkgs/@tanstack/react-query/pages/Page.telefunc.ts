import z from '@pkgs/zod'

const todos = [
    { name: 'Alice', description: 'Alice Todo' },
    { name: 'Bob', description: 'Bob Todo' },
]

export async function onGetTodos(): Promise<{ name: string; description: string }[]> {
    return todos
}

const createTodoSchema = z.object({
    name: z.string().min(2),
    description: z.string().min(2),
})
export async function onCreateTodo({
    name,
    description,
}: {
    name: string
    description: string
}): Promise<void> {
    createTodoSchema.parse({ name, description })
    todos.push({ name, description })
}
