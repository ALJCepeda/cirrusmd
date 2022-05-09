import {useCallback, useState} from 'react';
import {apollo} from "../apollo";
import {gql, useQuery} from "@apollo/client";
import {useCallbackRef} from "use-callback-ref";

interface PokemonSlice {
  num: string;
  species: string;
  sprite: string;
  backSprite: string;
  flavorTexts: { flavor:string }[];
  bulbapediaPage: string;
}

interface SpeciesListProps {
  fuzzy: string;
}

const GET_FUZZY_POKEMON = gql`
  query($offset: Int $take: Int $pokemon: String!) {
    getFuzzyPokemon(offset: $offset take: $take pokemon: $pokemon) {
      num
      species
      sprite
      backSprite
      flavorTexts { flavor }
      bulbapediaPage
    }
  }
`;

export default function SpeciesList({ fuzzy }: SpeciesListProps) {
  const [page, setPage] = useState(0);
  const [pokemons, setPokemon] = useState<PokemonSlice[]>([])
  const take = 20;
  const offset = page * take;

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  }, []);

  const loader = useCallbackRef(null, (ref) => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0
    };

    if (loader.current) {
      const observer = new IntersectionObserver(handleObserver, option);
      observer.observe(loader.current);
    }
  });

  const { data, loading } = useQuery<{ getFuzzyPokemon: PokemonSlice[] }>(GET_FUZZY_POKEMON, {
    client: apollo,
    variables: {
      pokemon: fuzzy,
      offset, take
    }
  });

  /**
   * TODO: Need better way to prevent re-rendering
   */
  if(data && data.getFuzzyPokemon[data.getFuzzyPokemon.length - 1] !== pokemons[pokemons.length - 1]) {
    setPokemon((prev:any[]) => ([...prev, ...data.getFuzzyPokemon]))
  }

  return (
    <div className="SpeciesList">
      {pokemons &&
        <div className="flex flex-row flex-wrap gap-5 justify-around">
          {pokemons.map((pokemon, index) =>
            <div className="card w-full md:w-1/4 flex flex-row" key={pokemon.species + '-' + index} >
              <div className="bg-white w-full h-full flex flex-col items-center px-2 pb-2 pt-1" style={{"margin": "-1px"}}>
                <div className="flex flex-row justify-center items-center grow">
                  <img src={pokemon.sprite} />
                </div>

                <div className="text-xl font-bold">{pokemon.species}</div>

                {pokemon.flavorTexts.length > 0 &&
                <div className="mt-3">{pokemon.flavorTexts[0].flavor}</div>
                }

                {pokemon.bulbapediaPage &&
                <a className="bg-black text-white w-1/2 m-auto rounded-3xl py-2 font-bold mt-3" href={pokemon.bulbapediaPage} target="_blank">Bulpadia</a>
                }
              </div>

              <div className="bg-black w-4">

              </div>
            </div>
          )}
        </div>
      }

      {loading && <div>Loading ... </div>}

      {data &&
        <div ref={loader}>I'm right here</div>
      }
    </div>
  )
}
