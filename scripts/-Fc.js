/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

module.exports = function Fc({ types }) {
    return {
        visitor: {
            CallExpression(path) {
                const isPure =
                    path.node.callee.type === 'MemberExpression' &&
                    path.node.callee.object.name === 'Fc' &&
                    path.node.callee.property.name === 'pure'

                const isFc = path.node.callee.name === 'Fc' || isPure

                if (
                    isFc &&
                    path.node.arguments &&
                    path.node.arguments.length > 0 &&
                    (path.node.arguments[0].type === 'FunctionExpression' ||
                        path.node.arguments[0].type === 'ArrowFunctionExpression')
                ) {
                    handleFc(types, path, isPure)
                }
            },
        },
    }
}

function handleFc(t, path, isPure) {
    path.node.arguments[0].type = 'FunctionExpression'

    const blockStatement = path.get('arguments')[0].get('body')

    // forward new
    if (blockStatement.node.body.find(node => node.type === 'ReturnStatement')) {
        path.node.arguments[1] = t.identifier('true')
        return
    }

    const properties = []
    const methods = []

    const publicProperties = []
    const publicMethods = []
    const protectedProperties = []
    const protectedMoethod = []

    blockStatement.node.body.reduceRight((_, node) => {
        if (node.type === 'FunctionDeclaration') {
            methods.push(node)
        }

        if (node.type === 'VariableDeclaration') {
            node.declarations.forEach(declaration => {
                if (
                    declaration.init.type === 'ArrowFunctionExpression' ||
                    declaration.init.type === 'FunctionExpression'
                ) {
                    methods.push(declaration)
                } else {
                    if (declaration.id.name) {
                        properties.push(declaration)
                    }
                }
            })
        }
    }, null)

    blockStatement.node.body.reduceRight((_, node, i) => {
        if (node.type === 'FunctionDeclaration') {
            closure(blockStatement.get('body')[i].get('body'))
            blockStatement.node.body.splice(i, 1)
        }

        if (node.type === 'VariableDeclaration') {
            node.declarations.forEach((declaration, j) => {
                if (
                    declaration.init.type === 'ArrowFunctionExpression' ||
                    declaration.init.type === 'FunctionExpression'
                ) {
                    closure(
                        blockStatement.get('body')[i].get('declarations')[j].get('init').get('body')
                    )
                    blockStatement.node.body.splice(i, 1)
                } else {
                    blockStatement.node.body.splice(i, 1)
                }
            })
        }
    }, null)

    closure(blockStatement)

    function closure(path, variables = {}) {
        path.traverse({
            VariableDeclaration(path) {
                path.node.declarations
                    .map(declaration => declaration.id.name)
                    .forEach(identifier => {
                        variables[identifier] = true
                    })
            },
            BlockStatement(path) {
                path.skip()
                closure(path, { ...variables })
            },
        })

        path.traverse({
            AssignmentExpression(path) {
                if (path.node.left.type !== 'Identifier') {
                    return
                }

                const { name } = path.node.left

                if (variables[name]) {
                    return
                }

                if (
                    !properties.find(property => property.id.name === name) &&
                    !methods.find(method => method.id.name === name)
                ) {
                    return
                }

                path.node = t.memberExpression(t.thisExpression(), t.identifier(name))
            },
            Identifier(path) {
                const { name } = path.node

                if (variables[name]) {
                    return
                }

                if (
                    !properties.find(property => property.id.name === name) &&
                    !methods.find(method => method.id.name === name)
                ) {
                    return
                }

                path.replaceWith(t.memberExpression(t.thisExpression(), t.identifier(name)))
                path.skip()
            },
        })
    }

    let superClass = null

    path.traverse({
        CallExpression(path) {
            if (path.node.callee.type !== 'MemberExpression') {
                return
            }

            if (path.node.callee.object.name !== 'Fc') {
                return
            }

            if (path.node.callee.property.name === 'public') {
                path.node.arguments.forEach(arg => {
                    if (arg.type === 'Identifier') {
                        publicMethods.push(arg.name)
                    } else if (arg.type === 'ObjectExpression') {
                        arg.properties.forEach(property => publicProperties.push(property.key.name))
                    }
                })
            } else if (path.node.callee.property.name === 'protected') {
                path.node.arguments.forEach(arg => {
                    if (arg.type === 'Identifier') {
                        protectedMoethod.push(arg.name)
                    } else if (arg.type === 'ObjectExpression') {
                        arg.properties.forEach(property =>
                            protectedProperties.push(property.key.name)
                        )
                    }
                })
            } else if (path.node.callee.property.name === 'extends') {
                superClass = path.node.arguments[0]
            }
        },
    })

    if (!isPure) {
        path.node.arguments[0].params.unshift(t.identifier('link'))
        path.node.arguments[0].body.body.unshift(
            t.callExpression(t.identifier('super'), [t.identifier('link')])
        )
    }

    path.node.arguments[0] = t.classDeclaration(
        path.parentPath.node.id,
        superClass ? superClass : isPure ? null : t.identifier('Entity'),
        t.classBody([
            t.classMethod(
                'constructor',
                t.identifier('constructor'),
                path.node.arguments[0].params,
                path.node.arguments[0].body,
                false,
                false,
                false,
                false
            ),
            ...properties.map(property => {
                return t.classProperty(
                    t.identifier(property.id.name),
                    property.init,
                    null,
                    null,
                    false,
                    false
                )
            }),
            ...methods.map(method => {
                return t.classMethod(
                    'method',
                    t.identifier(method.id.name),
                    method.init ? method.init.params : method.params,
                    method.init ? method.init.body : method.body,
                    false,
                    false,
                    false,
                    method.init ? method.init.async : method.async
                )
            }),
        ])
    )
}
