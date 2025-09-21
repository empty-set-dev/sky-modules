// packages/core/src/dev-runtime/validator.ts
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import type { NodePath } from '@babel/traverse';

export interface ViolationInfo {
  id: string;
  file: string;
  line: number;
  component: string;
  prop: string;
  value: string;
  type: 'dynamic' | 'function' | 'spread' | 'conditional';
  suggestion: string;
}

// Трекер динамических стилей
export class DynamicStyleTracker {
  private violations = new Map<string, ViolationInfo[]>();
  private fileContents = new Map<string, string>();
  
  // Проверяем, является ли значение статическим
  isStaticValue(node: any): boolean {
    if (!node) return true;
    
    // Литералы статичны
    if (t.isLiteral(node)) return true;
    
    // Template literal без выражений статичен
    if (t.isTemplateLiteral(node) && node.expressions.length === 0) return true;
    
    // Объект статичен если все свойства статичны
    if (t.isObjectExpression(node)) {
      return node.properties.every((prop: any) => {
        if (t.isObjectProperty(prop)) {
          return this.isStaticValue(prop.value);
        }
        if (t.isSpreadElement(prop)) {
          return false; // spread всегда динамический
        }
        return true;
      });
    }
    
    // Массив статичен если все элементы статичны
    if (t.isArrayExpression(node)) {
      return node.elements.every((el: any) => 
        el && this.isStaticValue(el)
      );
    }
    
    // Идентификаторы (переменные) - динамические
    if (t.isIdentifier(node)) return false;
    
    // Условные выражения - динамические
    if (t.isConditionalExpression(node)) return false;
    
    // Member expressions (props.color) - динамические
    if (t.isMemberExpression(node)) return false;
    
    // Call expressions - динамические
    if (t.isCallExpression(node)) return false;
    
    return false;
  }
  
  // Получаем тип нарушения
  getViolationType(node: any): ViolationInfo['type'] {
    if (t.isCallExpression(node)) return 'function';
    if (t.isSpreadElement(node)) return 'spread';
    if (t.isConditionalExpression(node)) return 'conditional';
    return 'dynamic';
  }
  
  // Генерируем предложение по исправлению
  getSuggestion(propName: string, violationType: ViolationInfo['type']): string {
    switch (violationType) {
      case 'function':
        return `Move the function call outside the component or use a static value`;
      
      case 'spread':
        return `Define explicit props instead of using spread operator`;
      
      case 'conditional':
        return `Use variants pattern:\n` +
               `  const variants = cva({ variants: { state: { open: {...}, closed: {...} } } });\n` +
               `  <Box class={variants({ state: isOpen ? 'open' : 'closed' })} />`;
      
      case 'dynamic':
        if (['bg', 'color', 'backgroundColor'].includes(propName)) {
          return `Use CSS variables:\n` +
                 `  <Box style={{ '--bg-color': dynamicColor }} bg="var(--bg-color)" />`;
        }
        if (['w', 'h', 'width', 'height'].includes(propName)) {
          return `Use CSS variables:\n` +
                 `  <Box style={{ '--size': \`\${size}px\` }} w="var(--size)" />`;
        }
        return `Use predefined values or CSS variables for dynamic values`;
    }
  }
  
  // Анализируем файл
  analyzeFile(filePath: string, content: string): ViolationInfo[] {
    const violations: ViolationInfo[] = [];
    
    try {
      const ast = parse(content, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx'],
        sourceFilename: filePath
      });
      
      traverse(ast, {
        JSXOpeningElement: (path: NodePath<t.JSXOpeningElement>) => {
          const node = path.node;
          const name = node.name;
          
          // Проверяем Box компоненты и его производные
          const boxComponents = ['Box', 'Flex', 'Grid', 'Stack', 'HStack', 'VStack', 'Container', 'Center'];
          
          if (t.isJSXIdentifier(name) && boxComponents.includes(name.name)) {
            const componentName = name.name;
            
            node.attributes?.forEach(attr => {
              if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)) {
                const propName = attr.name.name;
                const value = attr.value;
                
                // Пропускаем не-стилевые пропсы
                const nonStyleProps = ['as', 'asChild', 'class', 'className', 'style', 'id', 'key', 'ref'];
                if (nonStyleProps.includes(propName) || propName.endsWith('$')) {
                  return;
                }
                
                // Проверяем динамические значения
                if (value && t.isJSXExpressionContainer(value)) {
                  const expr = value.expression;
                  
                  if (!t.isJSXEmptyExpression(expr) && !this.isStaticValue(expr)) {
                    const line = node.loc?.start.line || 0;
                    const violationType = this.getViolationType(expr);
                    
                    // Получаем текст выражения
                    let valueText = 'dynamic expression';
                    if (content && node.loc) {
                      const start = value.loc?.start.index || 0;
                      const end = value.loc?.end.index || 0;
                      valueText = content.substring(start, end);
                    }
                    
                    violations.push({
                      id: `${filePath}-${line}-${propName}`,
                      file: filePath,
                      line,
                      component: componentName,
                      prop: propName,
                      value: valueText,
                      type: violationType,
                      suggestion: this.getSuggestion(propName, violationType)
                    });
                  }
                }
              }
              
              // Проверяем spread пропсы
              if (t.isJSXSpreadAttribute(attr)) {
                const line = node.loc?.start.line || 0;
                violations.push({
                  id: `${filePath}-${line}-spread`,
                  file: filePath,
                  line,
                  component: componentName,
                  prop: '...spread',
                  value: '{...props}',
                  type: 'spread',
                  suggestion: 'Avoid spreading props on Box components. Define explicit props instead.'
                });
              }
            });
          }
        },
        
        // Проверяем css() вызовы
        CallExpression: (path: NodePath<t.CallExpression>) => {
          const node = path.node;
          
          if (t.isIdentifier(node.callee) && node.callee.name === 'css') {
            const arg = node.arguments[0];
            
            if (arg && !this.isStaticValue(arg)) {
              const line = node.loc?.start.line || 0;
              const violationType = this.getViolationType(arg);
              
              violations.push({
                id: `${filePath}-${line}-css`,
                file: filePath,
                line,
                component: 'css()',
                prop: 'styles',
                value: 'dynamic styles object',
                type: violationType,
                suggestion: 'css() function requires static styles for Panda CSS'
              });
            }
          }
        }
      });
    } catch (error) {
      console.error(`Failed to parse ${filePath}:`, error);
    }
    
    if (violations.length > 0) {
      this.violations.set(filePath, violations);
    }
    
    return violations;
  }
  
  // Проверяем все файлы
  async analyzeProject(files: string[]): Promise<Map<string, ViolationInfo[]>> {
    const fs = await import('fs/promises');
    
    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        this.analyzeFile(file, content);
      } catch (error) {
        console.error(`Failed to read ${file}:`, error);
      }
    }
    
    return this.violations;
  }
  
  // Выводим отчёт
  report(format: 'console' | 'json' | 'html' = 'console') {
    const violations = Array.from(this.violations.values()).flat();
    
    if (violations.length === 0) {
      console.log('✅ No dynamic style violations found');
      return;
    }
    
    switch (format) {
      case 'console':
        console.warn('\n⚠️  Panda CSS Compatibility Report\n');
        console.warn(`Found ${violations.length} violations in ${this.violations.size} files:\n`);
        
        this.violations.forEach((fileViolations, file) => {
          console.warn(`\n📁 ${file}:`);
          fileViolations.forEach(v => {
            console.warn(`   Line ${v.line}: [${v.component}] ${v.prop} = ${v.value}`);
            console.warn(`   Type: ${v.type}`);
            console.warn(`   Fix: ${v.suggestion}\n`);
          });
        });
        break;
      
      case 'json':
        console.log(JSON.stringify({
          total: violations.length,
          files: this.violations.size,
          violations: violations
        }, null, 2));
        break;
      
      case 'html':
        const html = this.generateHTMLReport(violations);
        console.log(html);
        break;
    }
  }
  
  // Генерируем HTML отчёт
  private generateHTMLReport(violations: ViolationInfo[]): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <title>Panda CSS Compatibility Report</title>
  <style>
    body { font-family: system-ui; padding: 20px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 { color: #333; }
    .summary { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .violation { background: white; padding: 15px; margin-bottom: 10px; border-left: 4px solid #ff9800; border-radius: 4px; }
    .violation-header { font-weight: bold; margin-bottom: 10px; }
    .code { background: #f5f5f5; padding: 10px; border-radius: 4px; font-family: monospace; margin: 10px 0; }
    .suggestion { color: #4caf50; margin-top: 10px; }
    .type { display: inline-block; padding: 2px 8px; border-radius: 3px; font-size: 12px; }
    .type-dynamic { background: #fff3cd; color: #856404; }
    .type-function { background: #f8d7da; color: #721c24; }
    .type-spread { background: #d1ecf1; color: #0c5460; }
    .type-conditional { background: #d4edda; color: #155724; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🐼 Panda CSS Compatibility Report</h1>
    <div class="summary">
      <h2>Summary</h2>
      <p>Total violations: ${violations.length}</p>
      <p>Files affected: ${new Set(violations.map(v => v.file)).size}</p>
    </div>
    ${violations.map(v => `
      <div class="violation">
        <div class="violation-header">
          ${v.file}:${v.line} - ${v.component}
          <span class="type type-${v.type}">${v.type}</span>
        </div>
        <div class="code">${v.prop} = ${v.value}</div>
        <div class="suggestion">💡 ${v.suggestion.replace(/\n/g, '<br>')}</div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;
  }
}

// Export singleton instance
export const styleTracker = new DynamicStyleTracker();