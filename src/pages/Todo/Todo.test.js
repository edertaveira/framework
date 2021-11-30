import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { act, screen, render, waitFor, fireEvent, within, cleanup } from "@testing-library/react";
import configureStore from "../../storage/configureStore";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Todo from "./Todo";
import "../../common/matchMedia";
import data from "../../common/mocks/postagens.json";

const { store, persistor } = configureStore();
const reactElem = (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Todo />
    </PersistGate>
  </Provider>
);

const mock = (data) => {
  return (global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      json: () => data,
    })
  ));
};

describe("Todo", () => {
  it("Deve listar Todas as tarefas", async () => {
    await mock(data);
    await act(async () => render(reactElem));
    await screen.findAllByTestId("rowid");
    expect(screen.queryAllByTestId("rowid"));
    cleanup();
  });

  it("Deve deletar uma tarefa", async () => {
    await mock(data);
    await act(async () => render(reactElem));
    await waitFor(() => fireEvent.click(screen.getAllByTestId("trash")[0]));
    await waitFor(() => fireEvent.click(screen.getByText(/OK/i)));
    await waitFor(() => screen.getByText(/tarefa deletada!/i));
    cleanup();
  });

  it("Deve cadastrar uma tarefa", async () => {
    await mock(data);
    await act(async () => render(reactElem));
    const button = screen.getByRole("button", { name: /adicionar/i });
    await waitFor(() => fireEvent.click(button));
    expect(screen.getByText(/adicionar nova tarefa/i));
    const titulo = screen.getByRole("textbox", { name: /título/i });
    await waitFor(() => fireEvent.change(titulo, { target: { value: "TESTE" } }));
    await waitFor(() => fireEvent.click(screen.getByText(/salvar/i)));
    await waitFor(() => expect(screen.getByText(/nova tarefa criada!/i)));
    cleanup();
  });

  it("Deve editar uma tarefa", async () => {
    await mock(data);
    await act(async () => render(reactElem));
    await waitFor(() => fireEvent.click(screen.getAllByTestId("edit")[0]));
    await waitFor(() => fireEvent.click(screen.getByRole("switch")));
    await waitFor(() => fireEvent.click(screen.getByTestId("editsave")));
    await waitFor(() => expect(screen.getByText(/tarefa atualizada!/i)));
    cleanup();
  });
});
