import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { act, screen, render, waitFor, fireEvent, waitForElementToBeRemoved, cleanup } from "@testing-library/react";
import configureStore from "../../storage/configureStore";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Albuns from "./Albuns";
import "../../common/matchMedia";
import data from "../../common/mocks/albuns.json";

const { store, persistor } = configureStore();
const reactElem = (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Albuns />
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

describe("Álbuns", () => {
  it("Deve listar Todos os álbuns", async () => {
    await mock(data);
    await act(async () => render(reactElem));
    await screen.findAllByTestId("rowid");
    expect(screen.queryAllByTestId("rowid"));
    cleanup();
  });

  it("Deve deletar um álbum", async () => {
    await mock(data);
    await act(async () => render(reactElem));
    await waitFor(() => fireEvent.click(screen.getAllByTestId("trash")[0]));
    await waitFor(() => fireEvent.click(screen.getByText(/OK/i)));
    await waitFor(() => screen.getByText(/álbum deletado!/i));
    cleanup();
  });

  it("Deve cadastrar um álbum", async () => {
    await mock(data);
    await act(async () => render(reactElem));
    const button = screen.getByRole("button", { name: /adicionar/i });
    await waitFor(() => fireEvent.click(button));
    expect(screen.getByText(/adicionar novo álbum/i));
    const input = screen.getByRole("textbox", { name: /nome/i });
    await waitFor(() => fireEvent.change(input, { target: { value: "TESTE" } }));
    await waitFor(() => fireEvent.click(screen.getByText(/salvar/i)));
    await waitFor(() => expect(screen.getByText(/álbum criado!/i)));
    cleanup();
  });

  it("Deve editar um álbum", async () => {
    await mock(data);
    await act(async () => render(reactElem));
    await waitFor(() => fireEvent.click(screen.getAllByTestId("edit")[0]));
    const input = screen.getByRole("textbox");
    await waitFor(() => fireEvent.change(input, { target: { value: "TESTE EDITAR" } }));
    await waitFor(() => fireEvent.click(screen.getByTestId("editsave")));
    await waitFor(() => expect(screen.getByText(/álbum atualizado!/i)));
    cleanup();
  });
});
