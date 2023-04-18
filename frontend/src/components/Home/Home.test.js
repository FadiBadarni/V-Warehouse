import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { I18nextProvider } from "react-i18next";
import { i18n } from "i18next";

import Home from "./Home";

describe("Home component", () => {
  test("renders Home component", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <Home />
      </I18nextProvider>
    );
    const titleElement = screen.getByText(/home.title/i);
    expect(titleElement).toBeInTheDocument();
  });

  test("renders equipment catalog section", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <Home />
      </I18nextProvider>
    );
    const equipmentCatalogTitle = screen.getByText(/home.equipmentCatalog/i);
    expect(equipmentCatalogTitle).toBeInTheDocument();
  });

  test("renders help and support section", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <Home />
      </I18nextProvider>
    );
    const helpSupportTitle = screen.getByText(/home.helpSupport/i);
    expect(helpSupportTitle).toBeInTheDocument();
  });
});
