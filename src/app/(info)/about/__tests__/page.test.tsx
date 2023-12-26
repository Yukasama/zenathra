import { render, screen } from "@testing-library/react";
import Page from "../page";

describe("Page", () => {
  it("renders without crashing", async () => {
    render(<Page />);

    const header = screen.getByText("About Zenathra");

    expect(header).toBeInTheDocument();
  });
});
