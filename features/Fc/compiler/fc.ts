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

    const name = path.parentPath.node.id

    const variables = {}
    const methods = []
    const fields = {}
    const superClasses = []

    blockStatement.node.body.reduceRight((_, node) => {
        if (node.type === 'FunctionDeclaration') {
            methods.push(node)
        }

        if (node.type === 'VariableDeclaration') {
            node.declarations.forEach(declaration => {
                if (
                    declaration.init &&
                    (declaration.init.type === 'ArrowFunctionExpression' ||
                        declaration.init.type === 'FunctionExpression')
                ) {
                    methods.push(declaration)
                } else {
                    if (declaration.id.name) {
                        variables[declaration.id.name] = true
                    } else if (declaration.id.properties) {
                        declaration.id.properties.forEach(property => {
                            variables[property.key.name] = true
                        })
                    } else if (declaration.id.elements) {
                        declaration.id.elements.forEach(element => {
                            variables[element.name] = true
                        })
                    }
                }
            })
        }
    }, null)

    let supersIndex = 0

    blockStatement.traverse({
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
                            fields[path.node.name] = true
                        },
                    })
                )
                path.remove()
            } else if (path.node.callee.property.name === 'protected') {
                path.remove()
            } else if (path.node.callee.property.name === 'super') {
                const getName = node => {
                    return node.name ? node.name : node.property.name
                }

                if (path.node.arguments[0].type === 'NumericLiteral') {
                    return
                }

                if (superClasses.find(node => getName(node) === getName(path.node.arguments[0]))) {
                    path.remove()

                    if (path.parentPath.node.type === 'VariableDeclarator') {
                        path.parentPath.remove()
                    }

                    return
                }

                if (path.parentPath.node.type === 'VariableDeclarator') {
                    if (path.parentPath.node.type === 'ObjectPattern') {
                        path.parentPath.parentPath.replaceWith(path.node)
                    }
                }

                superClasses.push(path.node.arguments[0])

                if (!isPure) {
                    path.node.arguments.unshift(t.identifier('___link'))
                } else {
                    path.node.arguments.unshift(t.nullExpression())
                }

                path.node.arguments.unshift(t.thisExpression())
                path.node.arguments.unshift(t.numericLiteral(supersIndex))
                ++supersIndex
            }
        },
    })

    closure(blockStatement, true)
    function closure(path, first, scope = {}) {
        path.traverse({
            VariableDeclaration(path) {
                if (first) {
                    return
                }

                path.node.declarations.forEach(declaration => {
                    if (declaration.id.name) {
                        scope[declaration.id.name] = true
                    } else if (declaration.id.properties) {
                        declaration.id.properties.forEach(property => {
                            scope[property.key.name] = true
                        })
                    } else if (declaration.id.elements) {
                        declaration.id.elements.forEach(element => {
                            scope[element.name] = true
                        })
                    }
                })
            },
            BlockStatement(path_) {
                if (path_ === path) {
                    return
                }

                path_.skip()
                closure(path_, { ...scope })
            },
            MemberExpression(path) {
                if (path.node.object.type === 'MemberExpression') {
                    closure(path.get('object'), false)
                    path.skip()
                    return
                }

                path.skip()

                const { name } = path.node.object

                if (!name) {
                    return
                }

                if (scope[name] || (!variables[name] && !fields[name])) {
                    return
                }

                path.node.object = t.memberExpression(t.thisExpression(), t.identifier(name))
            },
            Identifier(path) {
                if (path.parentPath.node.type === 'ObjectProperty') {
                    return
                }

                const { name } = path.node

                if (!variables[name] && !fields[name]) {
                    return
                }

                if (
                    path.parentPath.node.type === 'FunctionDeclaration' ||
                    path.parentPath.node.type === 'VariableDeclarator'
                ) {
                    return
                }

                path.replaceWith(t.memberExpression(t.thisExpression(), t.identifier(name)))
                path.skip()
            },
        })
    }

    blockStatement.node.body.reduceRight((_, node, i) => {
        if (node.type === 'FunctionDeclaration') {
            blockStatement.node.body.splice(i, 1)
        }

        if (node.type === 'VariableDeclaration') {
            const assigments = []

            node.declarations.reduceRight((_, declaration, j) => {
                if (
                    declaration.init &&
                    (declaration.init.type === 'ArrowFunctionExpression' ||
                        declaration.init.type === 'FunctionExpression')
                ) {
                    blockStatement.node.body[i].declarations.splice(j, 1)
                    return
                }

                if (declaration.id.name) {
                    assigments.push([0, declaration.id.name, declaration.init])
                } else if (declaration.id.properties) {
                    assigments.push([1, declaration.id.properties, declaration.init])
                } else if (declaration.id.elements) {
                    assigments.push([2, declaration.id.elements, declaration.init])
                }

                blockStatement.node.body[i].declarations.splice(j, 1)
            }, null)

            const assigmentExpressions = []
            assigments.forEach(assigment => {
                if (assigment[0] === 0) {
                    assigmentExpressions.push(
                        t.assignmentExpression(
                            '=',
                            t.memberExpression(t.identifier('this'), t.identifier(assigment[1])),
                            assigment[2]
                        )
                    )
                } else if (assigment[0] === 1) {
                    assigment[1].forEach(a => {
                        assigmentExpressions.push(
                            t.assignmentExpression(
                                '=',
                                t.memberExpression(
                                    t.identifier('this'),
                                    t.identifier(a.value.name)
                                ),
                                t.memberExpression(assigment[2], t.identifier(a.key.name))
                            )
                        )
                    })
                } else if (assigment[0] === 2) {
                    assigmentExpressions.push(
                        t.assignmentExpression(
                            '=',
                            t.arrayPattern(
                                assigment[1].map(a => t.memberExpression(t.identifier('this'), a))
                            ),
                            assigment[2]
                        )
                    )
                }
            })

            blockStatement.node.body.splice(i + 1, 0, ...assigmentExpressions)

            if (blockStatement.node.body[i].declarations.length === 0) {
                blockStatement.node.body.splice(i, 1)
            }
        }
    }, null)

    const constructorCopy = t.cloneNode(path.node.arguments[0])

    if (!isPure) {
        constructorCopy.params.unshift(t.identifier('___link'))
    }

    if (!isPure) {
        path.node.arguments[0].params.unshift(t.identifier('___link'))
        if (superClasses.length === 0) {
            path.node.arguments[0].body.body.unshift(
                t.callExpression(t.identifier('super'), [t.identifier('___link')])
            )
        } else {
            path.node.arguments[0].body.body.unshift(t.callExpression(t.identifier('super'), []))
        }
    } else {
        if (superClasses.length === 0) {
            path.node.arguments[0].body.body.unshift(t.callExpression(t.identifier('super'), []))
        }
    }

    path.node.arguments[0] = t.classDeclaration(
        name,
        superClasses.length > 0
            ? t.callExpression(t.memberExpression(t.identifier('Fc'), t.identifier('super')), [
                  t.arrayExpression(superClasses),
              ])
            : isPure
            ? null
            : t.identifier('Entity'),
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
            t.classMethod(
                'method',
                t.identifier('___constructor'),
                constructorCopy.params,
                constructorCopy.body,
                false,
                true,
                false,
                path.node.arguments[0].async
            ),
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
