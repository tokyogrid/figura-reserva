"use client"

import React from "react"

interface Props {
  name: string
}

const TestComponent = ({ name }: Props) => (
  <div>Hello {name}</div>
)

export default TestComponent