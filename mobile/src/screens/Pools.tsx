import { useCallback, useState } from "react";
import { VStack, Icon, FlatList } from "native-base";
import { Octicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { api } from "../service/api";

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { PoolCard, PoolCardPros } from "../components/PoolCard";
import { EmptyPoolList } from "../components/EmptyPoolList";

export function Pools() {
  const [isLoading, setIsLoading] = useState(true);
  const [pools, setPools] = useState<PoolCardPros[]>([]);

  const { navigate } = useNavigation();

  async function fetchPools() {
    try {
      setIsLoading(true);
      const response = await api.get("/pools");
      setPools(response.data.pools);
    } catch (error) {
      console.error(error.response.data);
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(useCallback(() => {
    fetchPools();
  }, []));

  return (
    <VStack flex={1} bgColor='gray.900'>
      <Header title='Meus Bolões' />
      <VStack
        mt={6}
        mx={5}
        borderBottomWidth={1}
        borderBottomColor='gray.600'
        pb={4}
        mb={4}>
        <Button
          title='BUSCAR BOLÃO POR CÓDIGO'
          leftIcon={
            <Icon as={Octicons} name='search' color='black' size='md' />
          }
          onPress={() => navigate("find")}
        />
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={pools}
          keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PoolCard
                data={item}
                onPress={() => navigate('details', {
                  id: item.id
                })}
              />
            )}
          px={5}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ paddingBottom: 30 }}
          ListEmptyComponent={() => <EmptyPoolList />}
        />
      )}
    </VStack>
  );
}
