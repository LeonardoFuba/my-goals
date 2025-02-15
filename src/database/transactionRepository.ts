import { useSQLiteContext } from 'expo-sqlite/next';

export type TransactionCreateDatabase = {
  amount: number;
  goalId: number;
}

export type TransactionResponseDatabase = {
  id: string;
  amount: number;
  goal_id: number;
  created_at: number;
}

export function useTransactionRepository() {
  const database = useSQLiteContext()

  function create(transaction: TransactionCreateDatabase) {
    try {
      const statement = database.prepareSync(
        "INSERT INTO transactions (amount, goal_id) VALUES ($amount, $goal_id);",
      )
  
      statement.executeSync({
        $amount: transaction.amount,
        $goal_id: transaction.goalId,
      })
    } catch (error) {
      throw error
    }
  }

  function findByGoal(goalId: number) {
    try {
      const statement = database.prepareSync(`
        SELECT *
        FROM transactions
        WHERE goal_id  =$goal_id;
      `)
  
      const result = statement.executeSync<TransactionResponseDatabase>({
        $goal_id: goalId,
      })

      return result.getAllSync()
    } catch (error) {
      throw error
    }
  }

  function findLatest(length = 10) {
    try {
      return database.getAllSync<TransactionResponseDatabase>(`
        SELECT *
        FROM transactions
        ORDER BY created_at DESC LIMIT ${length};
      `)
    } catch (error) {
      throw error
    }
  }

  return {
    create,
    findByGoal,
    findLatest,
  }
}