import { useFetch } from "../useFetch";
import { renderHook } from "@testing-library/react-hooks";

type Args = {};
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const renderCustomHook = (fn: (args: Args) => Promise<number>) =>
  renderHook((initialProps) => useFetch<Args, number>(initialProps), {
    initialProps: { args: {}, fn },
  });

describe("useFetch", () => {
  test("function is getting result", async () => {
    const fn = async function (args: Args) {
      return 1;
    };
    const { result, waitForNextUpdate } = renderCustomHook(fn);
    await waitForNextUpdate();
    expect(result.current.data).toBe(1);
  });
  test("function is loading", async () => {
    const fn = async function (args: Args) {
      await sleep(100);
      return 1;
    };
    const { result, waitForNextUpdate } = renderCustomHook(fn);
    expect(result.current.loading).toBe(true);
    await waitForNextUpdate();
    expect(result.current.loading).toBe(false);
  });
  test("function can get error message", async () => {
    const errorMessage = "some error message";
    const fn = async function (args: Args) {
      throw new Error(errorMessage);
    };
    const { result, waitForNextUpdate } = renderCustomHook(fn);
    await waitForNextUpdate();
    expect(result.current.error?.message).toBe(errorMessage);
  });
});
export {};
