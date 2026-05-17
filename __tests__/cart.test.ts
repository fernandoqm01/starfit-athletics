import { expect, test, describe } from "vitest"

describe("Cart math", () => {
  test("subtotal calculation", () => {
    const items = [
      { price: 10000, quantity: 2 },
      { price: 5000, quantity: 1 },
    ]
    const subtotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    )
    expect(subtotal).toBe(25000)
  })

  test("free shipping over 50000", () => {
    const subtotal = 60000
    const shipping = subtotal > 50000 ? 0 : 5000
    expect(shipping).toBe(0)
  })

  test("shipping cost under 50000", () => {
    const subtotal = 30000
    const shipping = subtotal > 50000 ? 0 : 5000
    expect(shipping).toBe(5000)
  })
})
