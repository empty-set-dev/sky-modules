import Boo from './Boo'
Styles(Boo, {
    slots: {
        root: 'text-red-500',
        some: 'text-red-500',
        some2: 'text-red-500',
    },
    variants: {
        One: {
            true: {
                root: 'bg-green-700',
                some: 'bg-yellow-600',
                some2: 'bg-yellow-600',
            },
        },
        Two: {
            A: {
                root: 'text-blue-700',
            },
            B: {
                root: 'text-green-800',
                some: 'bg-yellow-600',
            },
        },
    },
    defaultVariants: {
        Two: 'A',
    },
})
