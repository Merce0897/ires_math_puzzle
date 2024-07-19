import { useEffect, useState } from "react";
import Game from "./components/Game";
import { checkExist, generateMath } from "./lib/generateMath";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  const [math, setMath] = useState([])
  const [newGame, setNewGame] = useState(0)

  useEffect(() => {
    createMath()
  }, [])

  const createMath = () => {
    let temp = []
    while (temp.length < 14) {
      const newMath = generateMath()
      if (!checkExist(math, newMath)) temp.push({ id: temp.length, ...newMath })
    }
    setMath(temp)
  }

  const handleNewGame = () => {
    setNewGame(newGame + 1)
    createMath()
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen w-screen bg-primary flex justify-center items-center">
        <div className="h-[80%] w-[80%] bg-white shadow-md rounded-lg p-6">

          <Game math={math} handleNewGame={handleNewGame} />
        </div>
      </div>
    </QueryClientProvider>

  );
}

export default App;