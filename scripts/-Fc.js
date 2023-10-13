/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

module.exports = function Fc({ types }) {
    return {
        visitor: {
            CallExpression(path) {
                const isFc =
                    path.node.callee.name === 'Fc' ||
                    (path.node.callee.type === 'MemberExpression' &&
                        path.node.callee.object.name === 'Fc' &&
                        path.node.callee.property.name === 'pure')

                if (
                    isFc &&
                    path.node.arguments &&
                    path.node.arguments.length > 0 &&
                    (path.node.arguments[0].type === 'FunctionExpression' ||
                        path.node.arguments[0].type === 'ArrowFunctionExpression')
                ) {
                    handleFc(types, path)
                }
            },
        },
    }
}

function handleFc(t, path) {
    path.node.arguments[0].type = 'FunctionExpression'

    const blockStatement = path.node.arguments[0].body

    // forward new
    if (blockStatement.body.find(node => node.type === 'ReturnStatement')) {
        path.node.arguments[1] = t.identifier('true')
        return
    }

    // console.log(body)

    const properties = []
    const methods = []

    const publicProperties = []
    const publicMethods = []
    const protectedProperties = []
    const protectedMoethod = []

    function closure(block) {}

    blockStatement.body.reduceRight((_, node, i) => {
        if (node.type === 'FunctionDeclaration') {
            blockStatement.body.splice(i, 1)
            methods.push(node)
        }

        if (node.type === 'VariableDeclaration') {
            if (
                node.declarations[0] &&
                (node.declarations[0].init.type === 'ArrowFunctionExpression' ||
                    node.declarations[0].init.type === 'FunctionExpression')
            ) {
                blockStatement.body.splice(i, 1)
                methods.push(node)
            } else {
                blockStatement.body.splice(i, 1)
                properties.push(...node.declarations)
            }
        }
    }, null)

    console.log(properties)

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
                //path.node.callee.object.name = 'this'
            } else {
                path.node.callee.object.name = 'this'
            }
        },
    })

    path.get('arguments')[0]
        .get('body')
        .pushContainer('body', t.returnStatement(magic(t, publicProperties, publicMethods)))
}

function magic(t, properties, methods) {
    return t.arrayExpression([
        t.objectExpression([
            ...properties.map(property =>
                t.objectMethod(
                    'get',
                    t.identifier(property),
                    [],
                    t.blockStatement([t.returnStatement(t.identifier(property))])
                )
            ),
            ...properties.map(property =>
                t.objectMethod(
                    'set',
                    t.identifier(property),
                    [t.identifier(`_${property}`)],
                    t.blockStatement([
                        t.expressionStatement(
                            t.assignmentExpression(
                                '=',
                                t.identifier(property),
                                t.identifier(`_${property}`)
                            )
                        ),
                    ])
                )
            ),
        ]),
        t.objectExpression(
            methods.map(method => t.objectProperty(t.identifier(method), t.identifier(method)))
        ),
    ])
}
