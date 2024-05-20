// LIBS
import Bottom from "@gorhom/bottom-sheet"
import dayjs from "dayjs"
import { router } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { Alert, Keyboard, View } from "react-native"

// COMPONENTS
import { BottomSheet } from "@/components/BottomSheet"
import { Button } from "@/components/Button"
import { Goals, GoalsProps } from "@/components/Goals"
import { Header } from "@/components/Header"
import { Input } from "@/components/Input"
import { Transactions, TransactionsProps } from "@/components/Transactions"

// DATABASE
import { useGoalRepository } from "@/database/goalRepository"
import { useTransactionRepository } from "@/database/transactionRepository"


// UTILS

export default function Home() {
  //HOOKS
  const useGoals = useGoalRepository()
  const useTransactions = useTransactionRepository()

  // LISTS
  const [transactions, setTransactions] = useState<TransactionsProps>([])
  const [goals, setGoals] = useState<GoalsProps>([])

  // FORM
  const [name, setName] = useState("")
  const [total, setTotal] = useState("")

  // BOTTOM SHEET
  const bottomSheetRef = useRef<Bottom>(null)
  const handleBottomSheetOpen = () => bottomSheetRef.current?.expand()
  const handleBottomSheetClose = () => bottomSheetRef.current?.snapToIndex(0)

  function handleDetails(id: string) {
    router.navigate("/details/" + id)
  }

  async function handleCreate() {
    try {
      const totalAsNumber = Number(total.toString().replace(",", "."))

      if (isNaN(totalAsNumber)) {
        return Alert.alert("Erro", "Valor inválido.")
      }

      useGoals.create({ name, total: totalAsNumber })

      Keyboard.dismiss()
      handleBottomSheetClose()
      Alert.alert("Sucesso", "Meta cadastrada!")

      setName("")
      setTotal("")
      fetchGoals()
    } catch (error) {
      Alert.alert("Erro", "Não foi possível cadastrar.")
      console.log(error)
    }
  }

  async function fetchGoals() {
    try {
      const response = useGoals.findMany()
      setGoals(response)
    } catch (error) {
      Alert.alert("Erro", "Não foi possível listar os objetivos.")
      console.log(error)
    }
  }

  async function fetchTransactions() {
    try {
      const response = useTransactions.findLatest()

      setTransactions(
        response.map((item) => ({
          ...item,
          date: dayjs(item.created_at).format("DD/MM/YYYY [às] HH:mm"),
        }))
      )
    } catch (error) {
      Alert.alert("Erro", "Não foi possível listar as transações.")
      console.log(error)
    }
  }

  useEffect(() => {
    fetchGoals()
    fetchTransactions()
  }, [])

  return (
    <View className="flex-1 p-8">
      <Header
        title="Suas metas"
        subtitle="Poupe hoje para colher os frutos amanhã."
      />

      <Goals
        goals={goals}
        onAdd={handleBottomSheetOpen}
        onPress={handleDetails}
      />

      <Transactions transactions={transactions} />

      <BottomSheet
        ref={bottomSheetRef}
        title="Nova meta"
        snapPoints={[0.01, 284]}
        onClose={handleBottomSheetClose}
      >
        <Input placeholder="Nome da meta" onChangeText={setName} value={name} />

        <Input
          placeholder="Valor"
          keyboardType="numeric"
          onChangeText={setTotal}
          value={total}
        />

        <Button title="Criar" onPress={handleCreate} />
      </BottomSheet>
    </View>
  )
}
