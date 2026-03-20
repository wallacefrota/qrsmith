/**
* Apply margin (quiet zone) around the matrix
*/
export function applyMargin(matrix: boolean[][], margin: number): boolean[][] {
  if (margin <= 0) return matrix.map((row) => [...row]);

  const originalRows = matrix.length;
  const originalCols = matrix[0]?.length ?? 0;
  const newRows = originalRows + margin * 2;
  const newCols = originalCols + margin * 2;

  const result: boolean[][] = [];

  for (let r = 0; r < newRows; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < newCols; c++) {
      const origR = r - margin;
      const origC = c - margin;

      if (origR >= 0 && origR < originalRows && origC >= 0 && origC < originalCols) {
        row.push(matrix[origR]![origC]!);
      } else {
        row.push(false);
      }
    }
    result.push(row);
  }

  return result;
}

/**
* Inverts all matrix modules (dark ↔ light)
*/
export function invertMatrix(matrix: boolean[][]): boolean[][] {
  return matrix.map((row) => row.map((cell) => !cell));
}

/**
* Rotates the matrix 90° clockwise
*/
export function rotateMatrix(matrix: boolean[][]): boolean[][] {
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  const result: boolean[][] = [];

  for (let c = 0; c < cols; c++) {
    const newRow: boolean[] = [];
    for (let r = rows - 1; r >= 0; r--) {
      newRow.push(matrix[r]![c]!);
    }
    result.push(newRow);
  }

  return result;
}

/**
* Scales the matrix by an integer factor (each module becomes NxN modules)
*/
export function scaleMatrix(matrix: boolean[][], factor: number): boolean[][] {
  if (factor <= 1) return matrix.map((row) => [...row]);

  const result: boolean[][] = [];

  for (const row of matrix) {
    const scaledRow: boolean[] = [];
    for (const cell of row) {
      for (let i = 0; i < factor; i++) {
        scaledRow.push(cell);
      }
    }
    for (let i = 0; i < factor; i++) {
      result.push([...scaledRow]);
    }
  }

  return result;
}

/**
* Returns the number of dark modules in the array
*/
export function countDarkModules(matrix: boolean[][]): number {
  let count = 0;
  for (const row of matrix) {
    for (const cell of row) {
      if (cell) count++;
    }
  }
  return count;
}

/**
* Checks if the cell at position (r, c) is dark
* Returns false if it is outside the bounds
*/
export function getCell(matrix: boolean[][], r: number, c: number): boolean {
  return matrix[r]?.[c] ?? false;
}