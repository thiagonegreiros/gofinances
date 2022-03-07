import React, { useContext, useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from 'styled-components'

// * Imports SVG
import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';
import { useAuth } from "../../hooks/auth";

import { SignInSocialButton } from "../../components/SignInSocialButton";

import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper
} from "./styles";
import { ActivityIndicator, Alert } from "react-native";

export function SingIn() {
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle } = useAuth();

  const theme = useTheme();

  async function handleSignInWithGoogle() {
    try {
      setIsLoading(true);
      return await signInWithGoogle();
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possivel autenticar')
      setIsLoading(false);
    } 
    
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg
            width={RFValue(120)}
            height={RFValue(68)}
          />

          <Title>
            Controle suas {'\n'}
            finanças de forma {'\n'}
            muito simples
          </Title>
        </TitleWrapper>

        <SignInTitle>
          Faça seu login com {'\n'}
          uma das contas abaixo
        </SignInTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <SignInSocialButton
            title="Entrar com Google"
            svg={GoogleSvg}
            onPress={handleSignInWithGoogle}
          />
          {/* <SignInSocialButton
            title="Entrar com Apple"
            svg={AppleSvg}
          /> */}

          {isLoading &&
            <ActivityIndicator
              color={ theme.colors.shape }
              style={{ marginTop: 18 }}
            />
          }
        </FooterWrapper>
      </Footer>
    </Container>
  );
}