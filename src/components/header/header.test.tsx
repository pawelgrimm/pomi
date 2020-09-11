import React from "react";
import '@testing-library/jest-dom';
import { render} from '@testing-library/react';
import Header from "./header";

test("Has brand element", () => {
    const {getByText} = render(<Header />)
    expect(getByText("Pomi")).toBeTruthy();
});
