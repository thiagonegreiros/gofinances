import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Modal,
  Alert
} from "react-native";

import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { Button } from "../../components/Form/Button";
import { CategorySelectButton } from "../../components/Form/CategorySelectButton";
import { InputForm } from "../../components/Form/InputForm";
import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton";

import { CategorySelect } from "../CategorySelect";

import { 
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes
} from "./styles";

interface FormData {
  name: string;
  amount: number;
}



export function Register() {
  const [transactionType, setTransactionType] = useState("");
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });

  const navigation = useNavigation();

  const schema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
    amount: Yup.number()
      .typeError('Informe um valor numérico')
      .positive('O Valor não pode ser negativo')
      .required('Preço é obrigatório')
  })
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema)
  })

  function handleTransactionTypeSelect(type: 'positive' | 'negative') {
    setTransactionType(type);
  }

  function handleOpenSelectCategoryModal() { 
    setCategoryModalOpen(true);
  }
  
  function handleCloseSelectCategoryModal() { 
    setCategoryModalOpen(false);
  }

  async function handleRegister(form: FormData) {
    if (!transactionType)
      return Alert.alert('Seleção obrigatória', 'Selecione o tipo da transação')
    if (category.key === 'category')
      return Alert.alert('Seleção obrigatória', 'Selecione a categoria')

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date(),
    }

    try {
      const dataKey = '@gofinances:transactions'; 
      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];

      const dataFormatted = [
        ...currentData,
        newTransaction
      ];

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

      reset();
      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'Categoria'
      });

      navigation.navigate('Listagem');
    } catch (error) {
      console.log(error);
      Alert.alert("Não é possível salvar")
    }
  }

  // useEffect(() => {
  //   async function loadData() {
  //     const data = await AsyncStorage.getItem(dataKey);
      
  //     console.log(JSON.parse(data!));
  //   }
    
  //   loadData();
    
    //? Clean data Async Storage
  //   async function removeAll() {
  //     await AsyncStorage.removeItem('@gofinances:transactions');
  //   }

  //   removeAll();

  // }, [])

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss} 
      containerStyle={{ flex: 1 }}
      style={{ flex: 1}}
    >
    <Container>
      <Header>
        <Title>Cadastro</Title>
      </Header>

      <Form>
        <Fields>
          <InputForm
            control={control}
            name={'name'}
            placeholder={'Nome'}
            autoCapitalize={'sentences'}
            autoCorrect={false}
            error={errors.name && errors.name.message}
          />
          <InputForm
            control={control}
            name={'amount'}
            placeholder={'Preço'}
            keyboardType={'numeric'}
            error={errors.amount && errors.amount.message}
          />
            
          <TransactionsTypes>
            <TransactionTypeButton
              title={'Entrada'}
              type={'up'}
              onPress={() => handleTransactionTypeSelect('positive')}
              isActive={transactionType === 'positive'}
            />
            <TransactionTypeButton
              title={'Saída'}
              type={'down'}
              onPress={() => handleTransactionTypeSelect('negative')}
              isActive={transactionType === 'negative'}
            />
          </TransactionsTypes>

          <CategorySelectButton
            onPress={handleOpenSelectCategoryModal}
            title={category.name}
          />
        </Fields>

        <Button title={'Enviar'} onPress={handleSubmit(handleRegister)} />
      </Form>
        
      <Modal visible={categoryModalOpen}>
        <CategorySelect
          category={category}
          setCategory={setCategory}
          closeSelectCategory={handleCloseSelectCategoryModal}
        />
      </Modal>
    </Container>
  </TouchableWithoutFeedback>
  );
}