import {useEffect, useMemo, useState} from 'react';
import { useAsync } from 'react-async-hook';
import {apollo} from "../apollo";
import {gql, useQuery} from "@apollo/client";

interface PokemonSlice {
  num: string;
  species: string;
  sprite: string;
  backSprite: string;
  flavorTexts: { flavor:string }[];
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
    }
  }
`;

export default function SpeciesList({ fuzzy }: SpeciesListProps) {
  const { data, loading } = useQuery<{ getFuzzyPokemon: PokemonSlice[] }>(GET_FUZZY_POKEMON, {
    client: apollo,
    variables: {
      pokemon: fuzzy,
      offset: 0,
      take: 40
    }
  });

  return (
    <div className="SpeciesList flex flex-row flex-wrap gap-5">
      {loading && <div>Loading ... </div>}
      {data && data.getFuzzyPokemon.map((pokemon) =>
        <div className="card w-1/4 cursor-pointer flex flex-col" key={pokemon.species}>
          <div className="flex flex-row justify-center items-center grow">
            <img src={pokemon.sprite} />
          </div>

          <div>{pokemon.species}</div>

          {pokemon.flavorTexts.length > 0 &&
            <div>{pokemon.flavorTexts[0].flavor}</div>
          }
        </div>
      )}
    </div>
  )
}
