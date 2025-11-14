import type { ElementInfo } from "@/types/editor"

function getFiberFromElement(element: HTMLElement): any {
  const fiberKey = Object.keys(element).find((key) => key.startsWith("__react"))
  return fiberKey ? (element as any)[fiberKey] : null
}

function getComponentNameFromFiber(fiber: any): string {
  if (!fiber) return "Unknown"

  // Handle function components
  if (fiber.elementType) {
    if (typeof fiber.elementType === "function") {
      return fiber.elementType.name || "Anonymous"
    }
    if (typeof fiber.elementType === "string") {
      return fiber.elementType
    }
  }

  // Handle class components and HTML tags
  if (fiber.type) {
    if (typeof fiber.type === "function") {
      return fiber.type.name || "Anonymous"
    }
    if (typeof fiber.type === "string") {
      return fiber.type
    }
  }

  return "Unknown"
}

function getSourcePosition(fiber: any): { line: number; column: number } {
  if (!fiber) return { line: 0, column: 0 }

  if (fiber._debugSource) {
    return {
      line: fiber._debugSource.lineNumber || 0,
      column: fiber._debugSource.columnNumber || 0,
    }
  }

  const type = fiber.elementType || fiber.type
  if (type && type._debugSource) {
    return {
      line: type._debugSource.lineNumber || 0,
      column: type._debugSource.columnNumber || 0,
    }
  }

  if (fiber._owner) {
    const owner = fiber._owner
    if (owner._debugSource) {
      return {
        line: owner._debugSource.lineNumber || 0,
        column: owner._debugSource.columnNumber || 0,
      }
    }
  }

  return { line: 0, column: 0 }
}

function getParentChain(fiber: any): string[] {
  const chain: string[] = []
  let currentFiber = fiber

  while (currentFiber) {
    const componentName = getComponentNameFromFiber(currentFiber)

    if (
      componentName &&
      componentName !== "Unknown" &&
      !componentName.startsWith("Context") &&
      !componentName.startsWith("Provider") &&
      !componentName.startsWith("Consumer") &&
      !componentName.startsWith("Fragment") &&
      componentName !== "Suspense" &&
      componentName !== "Lazy"
    ) {
      chain.push(componentName)
    }

    currentFiber = currentFiber.return
  }

  return chain.reverse()
}

function getComputedStylesObject(element: HTMLElement): Record<string, string> {
  const computed = window.getComputedStyle(element)
  const styles: Record<string, string> = {}

  const properties = [
    "display",
    "position",
    "width",
    "height",
    "padding",
    "margin",
    "border",
    "backgroundColor",
    "color",
    "fontSize",
    "fontFamily",
    "fontWeight",
    "lineHeight",
    "textAlign",
    "flexDirection",
    "justifyContent",
    "alignItems",
    "gap",
    "zIndex",
    "opacity",
    "transform",
    "transition",
  ]

  properties.forEach((prop) => {
    styles[prop] = computed.getPropertyValue(prop)
  })

  return styles
}

export function getElementInfo(element: HTMLElement): ElementInfo {
  const fiber = getFiberFromElement(element)

  let componentFiber = fiber
  while (componentFiber && !componentFiber.elementType && !componentFiber.type) {
    componentFiber = componentFiber.return
  }

  const componentName = getComponentNameFromFiber(componentFiber)
  const position = getSourcePosition(componentFiber)
  const parentChain = getParentChain(componentFiber?.return || componentFiber)

  return {
    componentName,
    position,
    parentChain,
    computedStyles: getComputedStylesObject(element),
    tagName: element.tagName.toLowerCase(),
  }
}