import React, { useState } from "react";
import {
  Keyboard,
  Modal,
  TouchableWithoutFeedback,
  Alert
} from "react-native";

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { Button } from "../../components/Form/Button";
import { CategorySelectButton } from "../../components/Form/CategorySelectButton";
import { Input } from "../../components/Form/Input";
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

// type FormData = {
//   name: string;
//   amount: number;
// }

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


  const schema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
    amount: Yup.number()
      .typeError('Informe um valor numérico')
      .positive('O Valor não pode ser negativo')
  })
  
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  function handleTransactionTypeSelect(type: 'up' | 'down') {
    setTransactionType(type);
  }

  function handleOpenSelectCategoryModal() { 
    setCategoryModalOpen(true);
  }
  
  function handleCloseSelectCategoryModal() { 
    setCategoryModalOpen(false);
  }

  function handleRegister(form: FormData) {
    if (!transactionType)
      return Alert.alert('Seleção obrigatória', 'Selecione o tipo da transação')
    if (category.key === 'category')
      return Alert.alert('Seleção obrigatória', 'Selecione a categoria')

    const data = {
      name: form.name,
      amount: form.amount,
      transactionType,
      category: category.key
    }
    console.log(data)
  }

  return (
   <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
              onPress={() => handleTransactionTypeSelect('up')}
              isActive={transactionType === 'up'}
            />
            <TransactionTypeButton
              title={'Saída'}
              type={'down'}
              onPress={() => handleTransactionTypeSelect('down')}
              isActive={transactionType === 'down'}
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