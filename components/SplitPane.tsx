"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface SplitPaneProps {
  direction: "horizontal" | "vertical"
  initialSizes?: number[]
  minSizes?: number[]
  children: React.ReactNode[]
  className?: string
  sizes?: number[]
  onResizeEnd?: (newSizes: number[]) => void
}

export default function SplitPane({
  direction,
  initialSizes = [],
  minSizes = [],
  children,
  className = "",
  sizes: controlledSizes,
  onResizeEnd,
}: SplitPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [sizes, setSizes] = useState<number[]>(controlledSizes || [])
  const [dragging, setDragging] = useState<number | null>(null)
  const [startPos, setStartPos] = useState(0)
  const [startSizes, setStartSizes] = useState<number[]>([])

  useEffect(() => {
    if (controlledSizes) {
      setSizes(controlledSizes)
    }
  }, [controlledSizes])

  useEffect(() => {
    if (!controlledSizes && containerRef.current) {
      const containerSize =
        direction === "horizontal" ? containerRef.current.clientWidth : containerRef.current.clientHeight
      const childCount = children.length

      if (initialSizes.length === childCount) {
        setSizes(initialSizes)
      } else {
        const equalSize = 100 / childCount
        setSizes(Array(childCount).fill(equalSize))
      }
    }
  }, [children.length, direction, initialSizes, controlledSizes])

  const handleMouseDown = (index: number, e: React.MouseEvent) => {
    e.preventDefault()
    setDragging(index)
    setStartPos(direction === "horizontal" ? e.clientX : e.clientY)
    setStartSizes([...sizes])
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging === null || !containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const containerSize = direction === "horizontal" ? containerRect.width : containerRect.height
    const currentPos = direction === "horizontal" ? e.clientX : e.clientY

    const minSize1 = minSizes[dragging] || 0;
    const minSize2 = minSizes[dragging + 1] || 0;

    // Calculate the new size for the first pane based on mouse position
    let newS1Percentage = ((currentPos - containerRect.left) / containerSize) * 100;

    // Clamp newS1Percentage to respect minSizes of both panes
    newS1Percentage = Math.max(minSize1, newS1Percentage); // Ensure s1 is not smaller than its min
    newS1Percentage = Math.min(100 - minSize2, newS1Percentage); // Ensure s1 does not push s2 below its min

    const newS2Percentage = 100 - newS1Percentage;

    setSizes([newS1Percentage, newS2Percentage]);
    console.log(`Dragging: ${dragging}, S1: ${newS1Percentage.toFixed(2)}%, S2: ${newS2Percentage.toFixed(2)}%`);
  }

  const handleMouseUp = () => {
    if (dragging !== null) {
      setDragging(null)
      if (onResizeEnd) {
        // On mouse up, normalize to ensure 100% sum and send the final sizes
        const finalSum = sizes.reduce((acc, s) => acc + s, 0);
        const normalizedFinalSizes = finalSum !== 0 ? sizes.map(s => (s / finalSum) * 100) : sizes;
        onResizeEnd(normalizedFinalSizes);
      }
    }
  }

  useEffect(() => {
    if (dragging !== null) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [dragging, startPos, startSizes, sizes, onResizeEnd, minSizes])

  return (
    <div ref={containerRef} className={`flex ${direction === "horizontal" ? "flex-row" : "flex-col"} ${className}`}>
      {children.map((child, i) => (
        <div key={i} style={{ flexGrow: sizes[i] || 0, flexShrink: 1, flexBasis: 0 }} className="relative">
          {child}
          {i < children.length - 1 && (
            <div
              className={`absolute ${
                direction === "horizontal"
                  ? "right-0 top-0 w-1 h-full cursor-col-resize"
                  : "bottom-0 left-0 h-1 w-full cursor-row-resize"
              } bg-gray-700 hover:bg-blue-500 z-10`}
              onMouseDown={(e) => handleMouseDown(i, e)}
            />
          )}
        </div>
      ))}
    </div>
  )
}
