import { useState } from 'react';
import './App.scss';

interface TCell{
  row: number
  column: number
}

function App() {

  const [grid, setGrid] = useState<any[]>([
    [1,2,0,1],
    [3,1,3,1],
    [2,2,2,0],
  ])
  
  const [isRevealed, setIsRevealed] = useState(new Array(grid.length).fill('').map(()=> new Array(grid[0].length).fill(false)))
  const [firstItem, setFirstItem] = useState<TCell>()
  const [isMatched, setIsMatched] = useState(new Array(grid.length).fill('').map(()=> new Array(grid[0].length).fill(false)))
  const [isWrong, setIsWrong] = useState(new Array(grid.length).fill('').map(()=> new Array(grid[0].length).fill(false)))

  const [winner, setWinner] = useState<boolean>(false)

  function handleSelectedCard(row: number, col: number){
    if( isRevealed[row][col] )
      return
      
    const clickedNumber = grid[row][col]
    const newIsRevealed = [...isRevealed]
    newIsRevealed[row][col] = true
    setIsRevealed(newIsRevealed)

    if(firstItem){
      const firstNumber = grid[firstItem.row][firstItem.column]
      if(firstNumber !== clickedNumber){
        const isWrongEdit = [...isWrong]
        isWrongEdit[firstItem.row][firstItem.column] = true
        isWrongEdit[row][col] = true
        setIsWrong(isWrongEdit)


        setTimeout( () => {
          newIsRevealed[firstItem.row][firstItem.column] = false
          newIsRevealed[row][col] = false
          setIsRevealed([...newIsRevealed])

          isWrongEdit[firstItem.row][firstItem.column] = false
          isWrongEdit[row][col] = false
          setIsWrong(isWrongEdit)
        }, 300 )
      }
      else{
        setIsMatched([...isRevealed])
          
        const youWin = isRevealed.flat().every((state:boolean) =>  state === true)
        if(youWin){
          setWinner(true)
        }
      }
      setFirstItem(undefined)
    }
    else{
      setFirstItem({
        row: row,
        column: col
      })
    }
  }

  function handlePlayAgain(){
    window.location.reload();
  }

  return (
    <div className="App">
      { winner && <div className="congrats">
          <h1>YOU WIN!</h1>
          <button type='button' onClick={ () => handlePlayAgain()}>Play again!</button>
      </div>
      }
      { !winner && <div className="congrats">
          <h1>Matching game</h1>
      </div>
      }
      { winner && <div className="fireworks">
          <div className="before"></div>
          <div className="after"></div>
      </div>
      }
      <div className="grid">
      { grid.map((row, rowindex) => <div className='grid__row' key={rowindex}>
        { row.map((number:number, numberIndex:number) => 
          <div 
          className={'grid__card '
           + ((isMatched!=undefined && isMatched[rowindex][numberIndex]===true) ? 'revealed' : '')
           + ((isWrong!=undefined && isWrong[rowindex][numberIndex]===true) ? ' wrong' : '')}
          key={numberIndex} 
          onClick={ () => handleSelectedCard(rowindex, numberIndex)}
          >
            { isRevealed[rowindex][numberIndex] ? number : ''}
          </div>
          )}
        </div> )}
      </div>
    </div>
  )
}

export default App
