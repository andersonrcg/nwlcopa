import { useState } from "react";
import { Heading, VStack, useToast } from "native-base";

import { api } from "../service/api";

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { useNavigation } from "@react-navigation/native";

export function Find() {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');
  const [pools, setPools] = useState([]);

  const toast = useToast();
  const { navigate } = useNavigation();

  async function handleJoinPool() {
    try {
      setIsLoading(true);

      if (!code.trim()) {
        return toast.show({
          title: 'Informe o código.',
          placement: 'bottom',
          bgColor: 'red.500'
        })
      }

      await api.post('/pools/join', { code });

      toast.show({
        title: 'Você entrou no bolão com sucesso',
        placement: 'bottom',
        bgColor: 'green.500'
      })

      navigate('pools')
    } catch (error) {
      console.error(error)
      setIsLoading(false)

      toast.show({
        title: error.response?.data?.message ?? 'Não foi possível encontrar um Bolão.',
        placement: 'bottom',
        bgColor: 'red.500'
      })
    }
  }

  return (
    <VStack flex={1} bgColor='gray.900'>
      <Header title='Buscar por código' showBackButton />

      <VStack mt={8} mx={5} alignItems='center'>
        <Heading
          fontFamily='heading'
          color='white'
          fontSize='xl'
          mb={8}
          textAlign='center'>
          Encontre um bolão através de {'\n'}
          seu código único
        </Heading>

        <Input
          mb={2}
          placeholder="Qual o código do Bolão?"
          autoCapitalize="characters"
          onChangeText={setCode}
          value={code}
        />

        <Button title="BUSCAR BOLÃO" isLoading={isLoading} onPress={handleJoinPool} />
      </VStack>
    </VStack>
  );
}
