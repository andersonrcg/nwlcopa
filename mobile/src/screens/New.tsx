import { useState } from "react";
import { Heading, Text, VStack, useToast } from "native-base";
import { api } from '../service/api'

import Logo from "../assets/logo.svg";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";

export function New() {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const positionToast = 'bottom'

  const toast = useToast();

  async function handlePoolCreate() {
    if (!title || title.trim().length < 3) {
      return toast.show({
        title: 'Informe um nome para o seu bolão (Min. 3 Chr.).',
        placement: positionToast,
        bgColor: 'red.500'
      })
    }

    try {
      setIsLoading(true);

      await api.post('/pools', { title })

      toast.show({
        title: 'Bolão criado com sucesso!',
        placement: positionToast,
        bgColor: 'green.500'
      })
      
    } catch (error) {
      toast.show({
        title: 'Não foi possível criar o bolão',
        placement: positionToast,
        bgColor: 'red.500'
      })
    } finally {
      setTitle('')
      setIsLoading(false);
    }

  }

  return (
    <VStack flex={1} bgColor='gray.900'>
      <Header title="Criar novo bolão" showBackButton />

      <VStack mt={8} mx={5} alignItems="center">
        <Logo width={212} height={40} />

        <Heading fontFamily="heading" color="white" fontSize="xl" my={8} textAlign="center">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </Heading>

        <Input
          mb={2}
          placeholder="Dê um nome para o Bolão"
          onChangeText={setTitle}
          value={title}
          
        />

        <Button title="CRIAR MEU BOLÃO" onPress={handlePoolCreate} isLoading={isLoading} />

        <Text color="gray.300" fontSize="sm" textAlign="center" px={10} mt={4}>
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas
        </Text>
      </VStack>
    </VStack>
  );
}