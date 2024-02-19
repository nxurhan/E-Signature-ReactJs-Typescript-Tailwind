import { useRef, useState, useEffect } from "react"
import { useAtom } from "jotai"
import { pdfAtom, outputDocumentArr, stepAtom, setOutputDocumentArr } from '@/store/index'

const CanvasPreview = ({page, currentPage}:{page:number, currentPage:number}) => {
  const [pdf] = useAtom(pdfAtom)
  const [step] = useAtom(stepAtom)
  const [outputArr] = useAtom(outputDocumentArr)
  const [, displayOutputDocumentArr] = useAtom(setOutputDocumentArr)
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
  useEffect(() => {
    if(previewCanvasRef !== null) {
      const c = previewCanvasRef.current
      setCanvas(c)
      if(c) setCtx(c.getContext("2d"))
    }
  }, [previewCanvasRef])
  useEffect(() => {
    if(step === 3 && outputArr.length !== pdf?._pdfInfo.numPages) {
      if(page === currentPage) handleRenderPdfPage()
    }
  }, [currentPage, step])

  const handleRenderPdfPage = () => {
    if(pdf) {
      const realPage = page
      if(!realPage) return
      pdf.getPage(realPage).then(function (page) {
        const scale = 1
        const viewport = page.getViewport({ scale })
        if(canvas && ctx) {
          canvas.height = viewport.height
          canvas.width = viewport.width
          const renderContext = {
            canvasContext: ctx,
            viewport
          }
          page.render(renderContext).promise.then(function() {
            const bg = canvas.toDataURL("image/png")
            if(outputArr.length !== pdf?._pdfInfo.numPages) {
              const outputObj = {
                page: realPage,
                isEdit: false,
                width: viewport.width,
                height: viewport.height,
                imageUrl: bg
              }
              displayOutputDocumentArr({document: outputObj})
            }
          })
        }
      })
    }
  }

  return <canvas ref={previewCanvasRef}></canvas>
}

export default CanvasPreview