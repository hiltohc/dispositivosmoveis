import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { FormUsers } from './src/FormUsers';
import { auth } from './src/firebaseConnection';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser({
          email: user.email,
          uid: user.uid
        });

        setLoading(false);
        return;
      }

      setAuthUser(null);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  async function handleCreateUser() {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      console.log(user);
      handleLogout();

      // Mostrar alerta de sucesso
      Alert.alert('Sucesso', 'Conta criada com sucesso !!');

      // Enviar notificação
      PushNotification.localNotification({
        title: "Conta Criada",
        message: "Conta criada com sucesso !!",
      });

    } catch (error) {
      console.log(error);
    }
  }

  function handleLogin() {
    signInWithEmailAndPassword(auth, email, password)
      .then((user) => {
        console.log(user);

        setAuthUser({
          email: user.user.email,
          uid: user.user.uid
        });
      })
      .catch(err => {
        if (err.code === "auth/missing-password") {
          Alert.alert('sem sucesso', 'campo senha não pode ficar em branco !!');

          // Enviar notificação
          PushNotification.localNotification({
            title: "senha ",
            message: " campo senha não pode ficar em branco !!",
          });
          console.log("A senha é obrigatória");
          return;
        }
        if (err.code === "auth/invalid-credential") {
          Alert.alert('sem sucesso', 'usuario invado !!');

          // Enviar notificação
          PushNotification.localNotification({
            title: "invalido",
            message: " campo senha não pode ficar em branco !!",
          });
          console.log("invalido");
          console.log("  ");
          return;
        }

        console.log(err.code);
      });
  }

  async function handleLogout() {
    await signOut(auth);

    setAuthUser(null);
  }

  if (authUser) {
    return (
      <View style={styles.container}>
        <FormUsers />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading && <Text style={{ fontSize: 20, marginLeft: 8, color: "#000", marginBottom: 8 }}>Carregando informações...</Text>}

      <Text style={{ marginLeft: 8, fontSize: 18, color: "#000" }}>Email:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu email..."
        value={email}
        onChangeText={(text) => setEmail(text)}
      />

      <Text style={{ marginLeft: 8, fontSize: 18, color: "#000" }}>Senha:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha..."
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
      />

      <TouchableOpacity style={[styles.button, { marginBottom: 8 }]} onPress={handleLogin}>
        <Text style={styles.buttonText}>Fazer login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { marginBottom: 8 }]} onPress={handleCreateUser}>
        <Text style={styles.buttonText}>Criar uma conta</Text>
      </TouchableOpacity>

      {authUser && (
        <TouchableOpacity style={[styles.button, { backgroundColor: "red" }]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Sair da conta</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'center',
    marginBottom: 40,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444',
    borderRadius: 10,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#555',
    color: '#fff',
  },
  button: {
    backgroundColor: '#00bcd4',
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});
