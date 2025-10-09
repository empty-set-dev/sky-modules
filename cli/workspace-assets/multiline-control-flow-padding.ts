import type { Rule } from 'eslint'
import type { Node } from 'estree'

const rule: Rule.RuleModule = {
    meta: {
        type: 'layout',
        fixable: 'whitespace',
        docs: {
            description: 'Require blank lines around multiline control flow statements',
            category: 'Stylistic Issues',
            recommended: false,
        },
        messages: {
            expectedBefore: 'Expected blank line before multiline {{type}} statement',
            expectedAfter: 'Expected blank line after multiline {{type}} statement',
        },
        schema: [],
    },

    create(context) {
        const sourceCode = context.sourceCode ?? context.sourceCode

        function isMultiline(node: Node): boolean {
            // A statement is considered multiline if it spans more than 2 lines
            // This prevents single-line if statements from being flagged
            const lineSpan = node.loc!.end.line - node.loc!.start.line

            if (node.type === 'IfStatement') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const ifNode = node as any

                // Only consider it multiline if it has a block statement that spans multiple lines
                if (ifNode.consequent?.type === 'BlockStatement') {
                    return lineSpan >= 2
                }

                // For non-block statements, require at least 1 line difference
                return lineSpan > 0
            }

            // For other control flow statements, require at least 2 lines
            return lineSpan >= 2
        }

        function checkPaddingBefore(node: Node, type: string): void {
            if (!isMultiline(node)) return

            const tokenBefore = sourceCode.getTokenBefore(node, {
                includeComments: false,
            })

            if (!tokenBefore) return

            // Don't require padding if the previous token is an opening brace
            if (tokenBefore.type === 'Punctuator' && tokenBefore.value === '{') {
                return
            }

            // Don't require padding if this is an else if statement
            if (
                node.type === 'IfStatement' &&
                tokenBefore.type === 'Keyword' &&
                tokenBefore.value === 'else'
            ) {
                return
            }

            const linesBetween = node.loc!.start.line - tokenBefore.loc!.end.line

            if (linesBetween <= 1) {
                context.report({
                    node,
                    messageId: 'expectedBefore',
                    data: { type },
                    fix(fixer) {
                        const needsNewlines = 2 - linesBetween
                        return fixer.insertTextBefore(node, '\n'.repeat(needsNewlines))
                    },
                })
            }
        }

        function checkPaddingAfter(node: Node, type: string): void {
            if (!isMultiline(node)) return

            if (node.type === 'IfStatement') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const ifNode = node as any

                if (ifNode.alternate) {
                    return
                }
            }

            const tokenAfter = sourceCode.getTokenAfter(node, {
                includeComments: false,
            })

            if (!tokenAfter) return

            if (tokenAfter.type === 'Keyword' && tokenAfter.value === 'else') {
                return
            }

            // Check if this is the last statement in a block
            if (tokenAfter.type === 'Punctuator' && tokenAfter.value === '}') {
                return
            }

            const linesBetween = tokenAfter.loc!.start.line - node.loc!.end.line

            if (linesBetween <= 1) {
                context.report({
                    node,
                    messageId: 'expectedAfter',
                    data: { type },
                    fix(fixer) {
                        const needsNewlines = 2 - linesBetween
                        return fixer.insertTextAfter(node, '\n'.repeat(needsNewlines))
                    },
                })
            }
        }

        return {
            IfStatement(node): void {
                checkPaddingBefore(node, 'if')
                checkPaddingAfter(node, 'if')
            },

            ForStatement(node): void {
                checkPaddingBefore(node, 'for')
                checkPaddingAfter(node, 'for')
            },

            ForInStatement(node): void {
                checkPaddingBefore(node, 'for-in')
                checkPaddingAfter(node, 'for-in')
            },

            ForOfStatement(node): void {
                checkPaddingBefore(node, 'for-of')
                checkPaddingAfter(node, 'for-of')
            },

            WhileStatement(node): void {
                checkPaddingBefore(node, 'while')
                checkPaddingAfter(node, 'while')
            },

            DoWhileStatement(node): void {
                checkPaddingBefore(node, 'do-while')
                checkPaddingAfter(node, 'do-while')
            },

            SwitchStatement(node): void {
                checkPaddingBefore(node, 'switch')
                checkPaddingAfter(node, 'switch')
            },
        }
    },
}

export default {
    rules: {
        'multiline-control-flow-padding': rule,
    },
}
