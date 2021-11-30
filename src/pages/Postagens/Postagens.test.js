import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { act, screen, render, waitFor, fireEvent, within, cleanup } from "@testing-library/react";
import configureStore from "../../storage/configureStore";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Postagens from "./Postagens";
import "../../common/matchMedia";
import data from "../../common/mocks/postagens.json";

const { store, persistor } = configureStore();
const reactElem = (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Postagens />
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

describe("Postagens", () => {
  it("Deve listar Todas as postagens", async () => {
    await mock(data);
    await act(async () => render(reactElem));
    await screen.findAllByTestId("rowid");
    expect(screen.queryAllByTestId("rowid"));
    cleanup();
  });

  it("Deve deletar uma postagem", async () => {
    await mock(data);
    await act(async () => render(reactElem));
    await waitFor(() => fireEvent.click(screen.getAllByTestId("trash")[0]));
    await waitFor(() => fireEvent.click(screen.getByText(/OK/i)));
    await waitFor(() => screen.getByText(/postagem deletada!/i));
    cleanup();
  });

  it("Deve cadastrar uma postagem", async () => {
    await mock(data);
    await act(async () => render(reactElem));
    const button = screen.getByRole("button", { name: /adicionar/i });
    await waitFor(() => fireEvent.click(button));
    expect(screen.getByText(/adicionar nova postagem/i));
    const titulo = screen.getByRole("textbox", { name: /título/i });
    const descricao = screen.getByRole("textbox", { name: /descrição/i });
    await waitFor(() => fireEvent.change(titulo, { target: { value: "TESTE" } }));
    await waitFor(() => fireEvent.change(descricao, { target: { value: "TESTE" } }));
    await waitFor(() => fireEvent.click(screen.getByText(/salvar/i)));
    await waitFor(() => expect(screen.getByText(/postagem criada!/i)));
    cleanup();
  });

  it("Deve editar uma postagem", async () => {
    await mock(data);
    await act(async () => render(reactElem));
    await waitFor(() => fireEvent.click(screen.getAllByTestId("edit")[0]));
    const cell = screen.getByRole("cell", {
      name: /sunt aut facere repellat provident occaecati excepturi optio reprehenderit/i,
    });
    await waitFor(() => fireEvent.change(within(cell).getByRole("textbox"), { target: { value: "TESTE EDITAR" } }));
    await waitFor(() => fireEvent.click(screen.getByTestId("editsave")));
    await waitFor(() => expect(screen.getByText(/postagem atualizada!/i)));
    cleanup();
  });
});
