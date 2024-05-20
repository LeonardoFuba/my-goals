import dayjs from "dayjs"

const transactions = [
  {
    id: "1",
    created_at: dayjs(new Date()).format("DD/MM/YYYY [às] HH:mm"),
    amount: 100,
  },
  {
    id: "2",
    created_at: dayjs(new Date()).format("DD/MM/YYYY [às] HH:mm"),
    amount: -90,
  },
]

const goal = {
  id: "1",
  name: "Computador",
  current: 2500,
  total: 3000,
  percentage: (2500 / 3000) * 100,
  transactions,
}

const goal2 = {
  id: "2",
  name: "Monitor Wide",
  current: 700,
  total: 1200,
  percentage: (700 / 1200) * 100,
  transactions,
}

export const mocks = {
  goal,
  goals: [goal, goal2],
  transactions,
}
