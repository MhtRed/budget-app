import React, { useContext } from "react";
import { v4 as uuidV4 } from "uuid";
import useLocalStorage from "../hooks/useLocalStorage";

const BudgetsContext = React.createContext();
export function useBudgets() {
  return useContext(BudgetsContext);
}

// budget:
// {
//   id:
//   name:
//   max:
// }
//expense
// {
//   id:
//   BudgetId:
//   amount:
//   description:
// }

export const UNCATEGORIZED_BUDGET_ID = "Uncategorized";

export const BudgetProvider = ({ children }) => {
  const [budgets, setBudgets] = useLocalStorage("Budgets", []);
  const [expenses, setExpenses] = useLocalStorage("Expenses", []);
  const getBudgetExpenses = (budgetId) => {
    return expenses.filter((expense) => expense.budgetId === budgetId);
  };
  const addBudget = ({ name, max }) => {
    setBudgets((prevBudgets) => {
      if (prevBudgets.find((budget) => budget.name === name)) {
        return prevBudgets;
      }
      return [...prevBudgets, { id: uuidV4(), name, max }];
    });
  };
  const addExpense = ({ budgetId, amount, description }) => {
    setExpenses((prevExpenses) => {
      return [...prevExpenses, { id: uuidV4(), budgetId, amount, description }];
    });
  };
  const deleteExpense = (id) => {
    setExpenses((prevExpenses) => {
      return prevExpenses.filter((expense) => expense.id !== id);
    });
  };
  const deleteBudget = (id) => {
    setExpenses((prevExpenses) => {
      return prevExpenses.map((expense) => {
        if (expense.budgetId !== id) return expense;
        return {...expense, budgetId: UNCATEGORIZED_BUDGET_ID}
      });
    });
    setBudgets((prevBudgets) => {
      return prevBudgets.filter((budget) => budget.id !== id);
    });
  };
  return (
    <BudgetsContext.Provider
      value={{
        budgets,
        expenses,
        getBudgetExpenses,
        addExpense,
        addBudget,
        deleteBudget,
        deleteExpense,
      }}
    >
      {children}
    </BudgetsContext.Provider>
  );
};
