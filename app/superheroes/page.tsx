"use client";

import axios from "axios";
import type { AxiosResponse, AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { NextPage } from "next";
import { useState, Fragment } from "react";

type Hero = {
  id: number;
  name: string;
  alterEgo: string;
};

type ServerError = {
  message: string;
};

const fetchHeroes = () => axios.get("http://localhost:4000/superheroes");

const Page: NextPage = () => {
  const [intervalTime, setIntervalTime] = useState<number | false>(3000);

  const { data, isLoading, isError, error, refetch, isSuccess } = useQuery<
    AxiosResponse<Hero[]>,
    AxiosError<ServerError>
  >({
    queryKey: ["superhero-get"],
    queryFn: fetchHeroes,
    refetchInterval: intervalTime,
  });

  if (isSuccess && data.data.length > 3 && intervalTime !== false) {
    setIntervalTime(false);
  }

  if (isLoading) return <h2>Loading...</h2>;
  if (isError) return <h2>{error.response?.data.message}</h2>;

  return (
    <main>
      <h1>Superheroes</h1>
      {data.data.map((hero) => {
        return <p key={hero.name}>{hero.name}</p>;
      })}
      <button
        className="rounded-md bg-black px-[2px] py-[1px] text-white transition-all hover:bg-opacity-80"
        type="button"
        onClick={() => {
          refetch();
        }}
      >
        Refetch
      </button>
    </main>
  );
};

export default Page;