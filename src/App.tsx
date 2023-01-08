import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

type Result = {
  name: string;
  url: string;
};

type Pokemon = {
  id?: string;
  base_experience?: string;
  name?: string;
  sprites: {
    front_default?: string;
  }
};

function App() {
  const [list, setList] = useState<Pokemon[]>([])
  useEffect(() => {
    axios.get("https://pokeapi.co/api/v2/pokemon").then((response) => {
      let results: Array<Result> = response.data.results;
      let resultsSorted = results.sort((item1: Result, item2: Result) => item1.name.localeCompare(item2.name))
      const promisesResultArray = resultsSorted.map(result => axios.get(result.url))
      Promise.all(promisesResultArray).then((items) => {
        const promisesPokemons = items.map(item => item.data)
        Promise.all(promisesPokemons).then(pokemons => setList(pokemons))
      })
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h4>Pokemon API</h4>
        <h2>Lista</h2>
      </header>
      <main>
        {
          list.map((pokemon: Pokemon) => {
            return <PokemonItem key={pokemon.id} pokemon={pokemon} />
          })
        }
      </main>
    </div>
  );
}

interface IProps {
  pokemon: Pokemon
}

const PokemonItem = (props: IProps) => {
  let pokemon: Pokemon = props.pokemon;
  return (
    <>
      <div className="list">
        <img src={pokemon.sprites.front_default} alt="logo" />
        <p>{pokemon.name}</p>
        <p>{pokemon.base_experience}</p>
      </div>
      <hr />
    </>
  );
};

export default App;
