import { useEffect, useState, useCallback, useRef } from 'react'
import {Cell, Direction, Position} from './utils/types'

function App() {
  const boardSize = 12
  const [board, setBoard] = useState<Cell[][]>([])
  const [snake, setSnake] = useState<Position[]>([{ x: 5, y: 5 }])
  const [food, setFood] = useState<Position>({ x: 2, y: 2 })
  const [direction, setDirection] = useState<Direction>('RIGHT')
  const [isGameOver, setIsGameOver] = useState(false)
  const [score, setScore] = useState(0)
  
  const directionRef = useRef(direction)

  const generateFood = useCallback((): Position => {
    return {
      x: Math.floor(Math.random() * boardSize),
      y: Math.floor(Math.random() * boardSize)
    }
  }, [])

  const checkCollision = useCallback((position: Position): boolean => {
    if (
      position.x < 0 ||
      position.x >= boardSize ||
      position.y < 0 ||
      position.y >= boardSize
    ) {
      return true
    }

    return snake.some(
      (segment, index) => index !== 0 && segment.x === position.x && segment.y === position.y
    )
  }, [snake])

  useEffect(() => {
    const initialBoard = Array(boardSize)
      .fill(0)
      .map(() => Array(boardSize).fill(0))
    setBoard(initialBoard)
  }, [])

  useEffect(() => {
    directionRef.current = direction
  }, [direction])

  useEffect(() => {
    if (isGameOver) return

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake]
        const head = { ...newSnake[0] }

        switch (directionRef.current) {
          case 'UP':
            head.y -= 1
            break
          case 'DOWN':
            head.y += 1
            break
          case 'LEFT':
            head.x -= 1
            break
          case 'RIGHT':
            head.x += 1
            break
        }

        if (checkCollision(head)) {
          setIsGameOver(true)
          return prevSnake
        }

        newSnake.unshift(head)

        if (head.x === food.x && head.y === food.y) {
          setScore((prev) => prev + 1)
          setFood(generateFood())
        } else {
          newSnake.pop()
        }

        return newSnake
      })
    }

    const gameInterval = setInterval(moveSnake, 300)
    return () => clearInterval(gameInterval)
  }, [food, checkCollision, generateFood, isGameOver])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isGameOver) return

      const newDirection = (() => {
        switch (e.key) {
          case 'ArrowUp':
            return directionRef.current !== 'DOWN' ? 'UP' : directionRef.current
          case 'ArrowDown':
            return directionRef.current !== 'UP' ? 'DOWN' : directionRef.current
          case 'ArrowLeft':
            return directionRef.current !== 'RIGHT' ? 'LEFT' : directionRef.current
          case 'ArrowRight':
            return directionRef.current !== 'LEFT' ? 'RIGHT' : directionRef.current
          default:
            return directionRef.current
        }
      })()

      setDirection(newDirection)
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isGameOver])

  useEffect(() => {
    const newBoard = Array(boardSize)
      .fill(0)
      .map(() => Array(boardSize).fill(0))
    
    newBoard[food.y][food.x] = 2
    
    snake.forEach((segment) => {
      if (
        segment.y >= 0 &&
        segment.y < boardSize &&
        segment.x >= 0 &&
        segment.x < boardSize
      ) {
        newBoard[segment.y][segment.x] = 1
      }
    })

    setBoard(newBoard)
  }, [snake, food])

  const resetGame = () => {
    setSnake([{ x: 5, y: 5 }])
    setDirection('RIGHT')
    setFood(generateFood())
    setIsGameOver(false)
    setScore(0)
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4'>
      <div className='mb-4 text-2xl font-bold text-white'>Snake Game</div>
      
      <div className='mb-4 text-xl text-green-500'>Score: {score}</div>

      <div className='grid gap-1 bg-gray-800 p-2 rounded-lg shadow-xl'>
        {board.map((row, y) => (
          <div key={y} className='flex gap-1'>
            {row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className={`
                  w-6 h-6 rounded-sm transition-colors duration-200
                  ${cell === 0 && 'bg-gray-700'}
                  ${cell === 1 && 'bg-green-500'}
                  ${cell === 2 && 'bg-red-500 rounded-full'}
                `}
              />
            ))}
          </div>
        ))}
      </div>

      {isGameOver && (
        <div className='mt-4 flex flex-col items-center'>
          <div className='text-red-500 text-xl font-bold mb-2'>Game Over!</div>
          <button
            onClick={resetGame}
            className='bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors'
          >
            Play Again
          </button>
        </div>
      )}

      <div className='mt-4 text-gray-400 text-sm'>Use arrow keys to control the snake</div>
    </div>
  )
}

export default App
