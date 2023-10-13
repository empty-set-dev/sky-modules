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

    const variables = []
    const methods = []

    const fields = []
    const properties = []

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
                        variables.push(declaration.id.name)
                    } else {
                        declaration.id.properties.forEach(property => {
                            variables.push(property.key.name)
                        })
                    }
                }
            })
        }
    }, null)

    path.traverse({
        CallExpression(path) {
            if (path.node.callee.type !== 'MemberExpression') {
                return
            }

            if (path.node.callee.object.name !== 'Fc') {
                return
            }

            if (path.node.callee.property.name === 'public') {
                path.get('arguments').forEach(arg =>
                    arg.traverse({
                        Identifier(path) {
                            if (!methods.find(method => path.node.name === method.id.name)) {
                                properties.push(path.node.name)
                            }

                            fields.push(path.node.name)
                        },
                    })
                )
                path.remove()
            } else if (path.node.callee.property.name === 'protected') {
                path.get('arguments').forEach(arg =>
                    arg.traverse({
                        Identifier(path) {
                            if (!methods.includes(path.node.name)) {
                                properties.push(path.node.name)
                            }

                            fields.push(path.node.name)
                        },
                    })
                )
                path.remove()
            } else if (path.node.callee.property.name === 'private') {
                path.get('arguments').forEach(arg =>
                    arg.traverse({
                        Identifier(path) {
                            if (!methods.includes(path.node.name)) {
                                properties.push(path.node.name)
                            }

                            fields.push(path.node.name)
                        },
                    })
                )
                path.remove()
            } else if (path.node.callee.property.name === 'extends') {
                superClass = path.node.arguments[0]
            }
        },
    })

    blockStatement.node.body.reduceRight((_, node, i) => {
        if (node.type === 'FunctionDeclaration') {
            closure(blockStatement.get('body')[i].get('body'))
            blockStatement.node.body.splice(i, 1)
        }

        if (node.type === 'VariableDeclaration') {
            const assigments = []

            node.declarations.forEach((declaration, j) => {
                if (!fields.includes(declaration.id.name)) {
                    return
                }

                if (
                    declaration.init.type === 'ArrowFunctionExpression' ||
                    declaration.init.type === 'FunctionExpression'
                ) {
                    closure(
                        blockStatement.get('body')[i].get('declarations')[j].get('init').get('body')
                    )
                } else {
                    if (declaration.id.name) {
                        assigments.push([declaration.id.name, declaration.init])
                    } else if (declaration.id.properties) {
                        assigments.push(declaration.id.properties)
                    } else if (declaration.id.elements) {
                        assigments.push(declaration.id.elements)
                    }
                }

                blockStatement.node.body[i].declarations.splice(j, 1)
            })

            blockStatement.node.body.splice(
                i + 1,
                0,
                ...assigments.map(assigment => {
                    if (typeof assigment[0] === 'string') {
                        return t.assignmentExpression(
                            '=',
                            t.memberExpression(t.identifier('this'), t.identifier(assigment[0])),
                            assigment[1]
                        )
                    }
                    if (Array.isArray(assigment[0])) {
                        return t.assignmentExpression(
                            '=',
                            t.arrayExpression(
                                assigment[0].map(a =>
                                    t.memberExpression(t.identifier('this'), t.identifier(a))
                                )
                            ),
                            assigment[1]
                        )
                    }
                    if (typeof assigment[0] === 'object') {
                        return t.assigmentExpression(
                            '=',
                            t.objectExpression(
                                assigment[0].map(a =>
                                    t.memberExpression(t.identifier('this'), t.identifier(a))
                                )
                            ),
                            assigment[1]
                        )
                    }
                })
            )

            if (blockStatement.node.body[i].declarations.length === 0) {
                blockStatement.node.body.splice(i, 1)
            }
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

                if (!properties.includes(name)) {
                    return
                }

                path.node = t.memberExpression(t.thisExpression(), t.identifier(name))
            },
            Identifier(path) {
                if (path.parentPath.node.type === 'MemberExpression') {
                    return
                }

                const { name } = path.node

                if (variables[name]) {
                    return
                }

                if (!fields.includes(name)) {
                    return
                }

                path.replaceWith(t.memberExpression(t.thisExpression(), t.identifier(name)))
                path.skip()
            },
        })
    }

    let superClass = null

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
                return t.classProperty(t.identifier(property), null, null, null, false, false)
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
