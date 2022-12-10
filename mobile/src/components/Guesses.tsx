import { useEffect, useState } from "react";
import { useToast, FlatList } from "native-base";
import { api } from "../service/api";

import { Game, GameProps } from "../components/Game";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Loading } from "./Loading";
interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [firstTeamPoint, setFirstTeamPoint] = useState("");
  const [secondTeamPoint, setSecondTeamPoint] = useState("");
  const [games, setGames] = useState<GameProps[]>([]);

  const toast = useToast();

  async function fetchGames() {
    try {
      setIsLoading(true);

      const response = await api.get(`/pools/${poolId}/games`);
      setGames(response.data.games);
    } catch (error) {
      console.error(error.response?.data);
      toast.show({
        title: "Não foi possível carregar os detalhes do Bolão.",
        placement: "bottom",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuessConfirm(gameId: string) {
    try {
      if (!firstTeamPoint.trim() || !secondTeamPoint.trim()) {
        return toast.show({
          title: "Informe o placar do palpite.",
          placement: "bottom",
          bgColor: "red.500",
        });
      }

      setIsLoading(true);

      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoint),
        secondTeamPoints: Number(secondTeamPoint),
      });

      toast.show({
        title: "Palpite realizado com sucesso.",
        placement: "bottom",
        bgColor: "green.500",
      });

      setFirstTeamPoint("");
      setSecondTeamPoint("");
      fetchGames();
    } catch (error) {
      // console.error(error.response?.data);
      return toast.show({
        title: "Não foi possível enviar o palpite.",
        placement: "bottom",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGames();
  }, [poolId]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <FlatList
      data={games}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoint}
          setSecondTeamPoints={setSecondTeamPoint}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}
      _contentContainerStyle={{ pb: 10 }}
      ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
    />
  );
}
