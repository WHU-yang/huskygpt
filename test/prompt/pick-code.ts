import { parse } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import generate from '@babel/generator';

/**
 * Pick function or class code from the given code
 */
export class CodePicker {
  // Store the remaining code after picking
  private remainingCode: string[] = [];
  // Store the end index of the remaining code
  private remainingEndIndex = 0;

  /**
   * Check if the node is a function or class
   */
  private isFunctionOrClass(nodePath: NodePath | null): boolean {
    if (!nodePath) return true;

    const isVariableDeclarationFunction =
      nodePath.isVariableDeclaration() &&
      nodePath.node.declarations.some(
        (d) =>
          d.init &&
          (d.init.type === 'FunctionExpression' ||
            d.init.type === 'ArrowFunctionExpression')
      );

    return (
      nodePath.isFunction() ||
      nodePath.isClass() ||
      isVariableDeclarationFunction
    );
  }

  /**
   * Pick function or class code from the given code
   */
  public pickFunctionOrClassCodeArray(code: string): string[] {
    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    });

    traverse(ast, {
      enter: (nodePath) => {
        // If current node already in the remaining code, skip it
        if (Number(nodePath.node.start) <= this.remainingEndIndex) return;

        if (this.isFunctionOrClass(nodePath)) {
          this.remainingCode.push(generate(nodePath.node).code);
          this.remainingEndIndex = Number(nodePath.node.end);
        }
      },
    });

    return this.remainingCode;
  }
}
