import React, {ChangeEvent, useMemo, useState} from 'react';
import './App.css';
import SpeciesList from "./components/species-list";
import debounce from "lodash.debounce";

function App() {
  const [name, setName] = useState('');
  const changeHandler = (e:ChangeEvent<HTMLInputElement>) => {
    console.log('hello?', e.target.value)
    console.log(e);
    setName(e.target.value)
  };

  const debounceInput = useMemo(
    () => debounce(changeHandler, 500)
  ,[])

  return (
    <div className="App">
      <input className="border-2 my-2" type="text" onChange={debounceInput} placeholder="Input a pokemon"/>

      {name.length === 0 &&
        <div>Must enter name to see pokemon</div>
      }

      {name.length > 0 &&
        <SpeciesList fuzzy={name}/>
      }
    </div>
  );
}

export default App;
