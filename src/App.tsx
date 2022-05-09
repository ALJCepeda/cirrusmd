import React, {ChangeEvent, useMemo, useState} from 'react';
import './App.css';
import SpeciesList from "./components/species-list";
import debounce from "lodash.debounce";

function App() {
  const [name, setName] = useState('');
  const debounceInput = useMemo(
    () => debounce(
      (e:ChangeEvent<HTMLInputElement>) => setName(e.target.value)
    , 500)
  ,[])

  return (
    <div className="App">
      <input className="border-2 my-2" type="text" onChange={debounceInput} placeholder="Input a pokemon"/>

      {name.length === 0 &&
        <div>Must input a pokemon to see pokemon</div>
      }

      {name.length > 0 &&
        <SpeciesList fuzzy={name}/>
      }
    </div>
  );
}

export default App;
