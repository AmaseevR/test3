"use client"

import { useEffect } from "react"
import { useEditMode } from "@/hooks/useEditMode"
import ElementSelector from "./ElementSelector"
import type { ElementInfo } from "@/types/editor"
import HeroSection from "./demo/HeroSection"
import FeatureGrid from "./demo/FeatureGrid"
import Footer from "./demo/Footer"

export default function SandboxApp() {
  const { isEditMode, initializeEditMode } = useEditMode()

  useEffect(() => {
    initializeEditMode()
  }, [initializeEditMode])

  const handleElementSelected = (info: ElementInfo) => {
    window.parent.postMessage(
      {
        type: "ELEMENT_SELECTED",
        payload: info,
      },
      "*",
    )
  }

  return (
    <>
      <ElementSelector isEnabled={isEditMode} onElementSelected={handleElementSelected} />
      <div className="min-h-screen flex flex-col bg-gray-50">
        <HeroSection />
        <FeatureGrid />
        <Footer />
      </div>
    </>
  )
}
