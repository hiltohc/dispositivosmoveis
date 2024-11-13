import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { db, auth } from './firebaseConnection'
import { doc, getDoc, onSnapshot, setDoc, collection, addDoc, getDocs, updateDoc } from 'firebase/firestore'
import { UsersList } from './users'

import { signOut } from 'firebase/auth'

export function FormUsers() {
  const [nome, setNome] = useState("")
  const [quantidade, setQuantidade] = useState("")
  const [descricao, setDescricao] = useState("")

  const [users, setUsers] = useState([]);

  const [showForm, setShowForm] = useState(true);
  const [isEditing, setIsEditing] = useState("");

  useEffect(() => {

    async function getDados(){

    const usersRef = collection(db, "users");
    onSnapshot(usersRef, (snapshot) => {
      let lista = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          nome: doc.data().nome,
          quantidade: doc.data().quantidade,
          descricao: doc.data().descricao
        })
      })

      setUsers(lista);

    })


    
    }


    getDados();

  }, [])


  async function handleRegister(){
    await addDoc(collection(db, "users"), {
      nome: nome,
      quantidade: quantidade,
      descricao: descricao,
    })
    .then(() => {
      console.log("CADASTRADO COM SUCESSO")
      setNome("")
      setQuantidade("")
      setDescricao("")
    })
    .catch((err) => {
      console.log(err)
    })

  }

  function handleToggle(){
    setShowForm(!showForm);
  }


  function editUser(data){
    setNome(data.nome)
    setQuantidade(data.quantidade)
    setDescricao(data.descricao)
    setIsEditing(data.id);
  }

  async function handleEditUser(){
    const docRef = doc(db, "users", isEditing)
    await updateDoc(docRef, {
      nome: nome,
      quantidade: quantidade,
      descricao: descricao,
    })

    setNome("")
    setDescricao("")
    setQuantidade("")
    setIsEditing("");

  }

  async function handleLogout(){
    await signOut(auth);
  } 

 return (
  <View style={styles.container}>
    { showForm && (
      <View>
        <Text style={styles.label}>Produto :</Text>
        <TextInput
          style={styles.input}
          placeholder="  Digite seu nome..."
          placeholderTextColor="#999999"
          value={nome}
          onChangeText={ (text) => setNome(text) } 
        />

        <Text style={styles.label}>Quantidade:</Text>
        <TextInput
          style={styles.input}
          placeholder=" Digite sua quantidade..."
          placeholderTextColor="#999999"
          value={quantidade}
          onChangeText={ (text) => setQuantidade(text) } 
        />

        <Text style={styles.label}>Descricao:</Text>
        <TextInput
          style={styles.input}
          placeholder=" Digite o sua descricao ..."
          placeholderTextColor="#999999"
          value={descricao}
          onChangeText={ (text) => setDescricao(text) } 
        />

        {isEditing !== "" ? (
          <TouchableOpacity style={styles.button} onPress={handleEditUser}>
            <Text style={styles.buttonText}>Editar produtos</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Adicionar</Text>
          </TouchableOpacity>
        )}
      </View>
    )}

    <TouchableOpacity onPress={handleToggle} style={{ marginTop: 8}}>
      <Text style={{ textAlign:"center", color: "#000" }}>
        {showForm ? "Esconder formulário" : "Mostrar formulário"}
      </Text>
    </TouchableOpacity>


    <Text style={{ marginTop: 14, marginLeft: 8, fontSize: 20, color: "#000"}}>
      Produtos:
    </Text>

    <FlatList
      style={styles.list}
      data={users}
      keyExtractor={ (item) => String(item.id) }
      renderItem={ ({ item }) => <UsersList data={item} handleEdit={ (item) => editUser(item) } /> }
    />

    <TouchableOpacity onPress={handleLogout} style={styles.buttonLogout}>
      <Text style={{ color: "#FFF" }}>Sair da conta</Text>
    </TouchableOpacity>

  </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    padding: 20,
    backgroundColor: 'linear-gradient(180deg, #A1C4FD 0%, #C2E9FB 100%)', // Fundo gradiente
    borderRadius: 10,
    marginBottom: 20, 
  },
  button:{
    backgroundColor: '#007BFF', // Cor de fundo do botão
    paddingVertical: 10,
    borderRadius: 20, // Define o quão arredondado o botão será
    alignItems: 'center',
  },
  buttonText:{
    padding: 8,
    color: "#FFF",
    textAlign: 'center'
    
  },
  label:{
    fontSize: 18, // Aumenta o tamanho da fonte
    fontWeight: 'bold', // Deixa o texto em negrito
    color: '#333', // Cor mais escura para um melhor contraste
    marginBottom: 8, // Adiciona um pequeno espaçamento abaixo da label
    letterSpacing: 0.5, // Espaçamento entre as letras
    textTransform: 'uppercase', // Deixa o texto em letras maiúsculas para destaque
  },
  input:{
    borderWidth: 1,
    borderRadius: 8,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  
  list:{
    marginTop: 8,
    marginLeft: 8,
    marginRight: 8,
    borderRadius: 20
  },
  buttonLogout:{
    backgroundColor: 'red',
    alignSelf: "flex-start",
    margin: 14,
    padding: 8,
    borderRadius: 14
  }
})
