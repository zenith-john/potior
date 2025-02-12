<script lang="ts">
function board_string_to_grid(board_string: string) {
  /* Convert a board string to a two-dimensional array
   */
  const rows = []
  let cur_row = []
  for (let i = 0; i < board_string.length; i++) {
    cur_row.push(board_string[i])
    if (i % 9 == 8) {
      rows.push(cur_row)
      cur_row = []
    }
  }
  return rows
}

function generate() {
  return '.................................................................................'
}

export default {
  data() {
    return {
      puzzle: Array.from({ length: 9 }, () => Array(9).fill({ value: 0, original: false })) as {
        value: number
        original: boolean
      }[][],
      activeRow: -1,
      activeCol: -1,
      seconds: 0,
      timer: 0,
    }
  },
  mounted() {
    this.generatePuzzle()
  },
  computed: {
    formattedTime() {
      const min = Math.floor(this.seconds / 60)
      const sec = this.seconds % 60
      let min_str, sec_str: string
      if (min < 10) {
        min_str = `0${min}`
      } else {
        min_str = `${min}`
      }

      if (sec < 10) {
        sec_str = `0${sec}`
      } else {
        sec_str = `${sec}`
      }

      return `${min_str}:${sec_str}`
    },
    possibleValues() {
      const possible = Array.from({ length: 9 }, () => Array(9).fill([]))
      for (let r = 0; r < 9; r += 1) {
        for (let c = 0; c < 9; c += 1) {
          if (this.puzzle[r][c].value === 0) {
            possible[r][c] = this.findPossible(r, c)
          }
        }
      }
      return possible
    },
  },
  methods: {
    generatePuzzle() {
      const boardString = generate()
      this.puzzle = board_string_to_grid(boardString).map((row) => {
        return row.map((cell) => {
          return {
            value: cell !== '.' ? parseInt(cell) : 0,
            original: cell !== '.',
          }
        })
      })

      this.seconds = 0
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.seconds += 1
      }, 1000)
    },
    setCellActive(row: number, col: number, original: boolean) {
      if (original) {
        return
      }

      if (this.activeRow === row && this.activeCol === col) {
        this.activeRow = -1
        this.activeCol = -1
        return
      }

      this.activeRow = row
      this.activeCol = col
    },
    setCellValue(value: number) {
      this.puzzle[this.activeRow][this.activeCol].value = value
      this.activeRow = -1
      this.activeCol = -1

      if (this.isGameComplete()) {
        const msg = ['Success!', '', `Time: ${this.formattedTime}`]

        alert(msg.join('\n'))
        this.generatePuzzle()
      }
    },
    isCellInvalid(row: number, col: number, value: number) {
      if (!value) {
        return true
      }

      for (let c = 0; c < 9; c += 1) {
        if (this.puzzle[row][c].value === value && c !== col) {
          return true
        }
      }

      for (let r = 0; r < 9; r += 1) {
        if (this.puzzle[r][col].value === value && r !== row) {
          return true
        }
      }

      const rowStart = Math.floor(row / 3) * 3
      const colStart = Math.floor(col / 3) * 3
      for (let r = rowStart; r < rowStart + 3; r += 1) {
        for (let c = colStart; c < colStart + 3; c += 1) {
          if (this.puzzle[r][c].value === value && !(r === row && c === col)) {
            return true
          }
        }
      }

      return false
    },
    isGameComplete() {
      for (let r = 0; r < 9; r += 1) {
        for (let c = 0; c < 9; c += 1) {
          if (this.isCellInvalid(r, c, this.puzzle[r][c].value)) {
            return false
          }
        }
      }

      return true
    },

    findPossible(row: number, col: number) {
      let ret = [1, 2, 3, 4, 5, 6, 7, 8, 9]
      for (let i = 0; i < 9; i += 1) {
        if (i != row) {
          ret = ret.filter((val) => val !== this.puzzle[i][col].value)
        }
        if (i != col) {
          ret = ret.filter((val) => val != this.puzzle[row][i].value)
        }
      }
      const rowStart = Math.floor(row / 3) * 3
      const colStart = Math.floor(col / 3) * 3
      for (let r = rowStart; r < rowStart + 3; r += 1) {
        for (let c = colStart; c < colStart + 3; c += 1) {
          if (!(r === row && c === col)) {
            ret = ret.filter((val) => val != this.puzzle[r][c].value)
          }
        }
      }
      return ret
    },
  },
}
</script>

<template>
  <div class="sudoku">
    <div class="row">
      <h2>Sudoku</h2>

      <strong>{{ formattedTime }}</strong>
    </div>

    <div class="grid">
      <div class="row" v-for="(row, rowIndex) in puzzle" :key="rowIndex">
        <div class="cell" :class="{
          'border-right': colIndex === 2 || colIndex === 5,
          'border-bottom': rowIndex === 2 || rowIndex === 5,
          active: activeRow === rowIndex && activeCol === colIndex,
          invalid: cell.value && isCellInvalid(rowIndex, colIndex, cell.value),
        }" v-for="(cell, colIndex) in row" :key="colIndex" @click="setCellActive(rowIndex, colIndex, cell.original)">
          <p v-if="cell.value != 0">
            {{ cell.value }}
          </p>
          <template v-else>
            <div class="srow" v-for="srow in [0, 1, 2]" :key="srow">
              <div class="scell" v-for="scol in [0, 1, 2]" :key="scol">
                <p v-if="srow * 3 + scol < possibleValues[rowIndex][colIndex].length">
                  {{ possibleValues[rowIndex][colIndex][srow * 3 + scol] }}
                </p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div class="row">
      <button type="button" class="btn" v-for="value in Array(10).keys()" :key="value"
        :disabled="activeRow === -1 || activeCol === -1" @click="setCellValue(value)">
        {{ value }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.sudoku {
  width: 100%;
  max-width: 640px;
  margin: 0.5rem auto;

  font-family: Arial, Helvetica, sans-serif;
}

.grid {
  width: calc(9 * 60px);
  margin: 0.5rem auto 1rem;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.srow {
  display: flex;
}

.scell {
  display: block;
  height: 20px;
  width: 20px;
  font-size: 12px;
  line-height: 20px;
}

.cell {
  display: block;
  width: 60px;
  height: 60px;
  box-sizing: border-box;
  border: 1px solid #bbb;

  font-size: 48px;
  line-height: 60px;
  text-align: center;

  cursor: default;
}

.cell.border-right {
  border-right-width: 3px;
}

.cell.border-bottom {
  border-bottom-width: 3px;
}

.cell.original {
  font-weight: bold;
}

.cell:not(.original) {
  cursor: pointer;
}

.cell.active {
  background-color: #00c !important;
  color: #fff;
}

.cell.invalid {
  background-color: #c00;
  color: #fff;
}

.btn {
  width: 48px;
  height: 38px;
  font-size: 24px;

  cursor: pointer;
}

.btn:disabled {
  cursor: not-allowed;
}
</style>
