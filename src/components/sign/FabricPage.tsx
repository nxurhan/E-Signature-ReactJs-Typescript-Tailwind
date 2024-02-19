import { fabric } from "fabric"
import { useRef, useState, useEffect } from "react"
import { useAtom } from "jotai"
import { signToPdfAtom, setOutputDocumentArr } from '@/store/index'

const FabricPage = ({isDeleteClick, page, bgImage, isEdit}:{isDeleteClick:boolean, page:number, bgImage: string | undefined, isEdit: boolean | undefined}) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
  const fabricRef = useRef<HTMLCanvasElement | null>(null)
  const [originalBgImage, setOriginalBgImage] = useState<string>("")
  const [signToPdf] = useAtom(signToPdfAtom)
  const [, displayOutputDocumentArr] = useAtom(setOutputDocumentArr)

  useEffect(() => {
    setCanvas(
      new fabric.Canvas(fabricRef.current, { containerClass: "myClass" })
    )
  }, [fabricRef])

  useEffect(() => {
    if(isEdit && bgImage && !originalBgImage) {
      setOriginalBgImage(bgImage)
    }
    if(originalBgImage) {
      fabric.Image.fromURL(originalBgImage, (img: fabric.Image) => {
        canvas?.setBackgroundImage(originalBgImage, () => canvas.renderAll())
        const width = img.width
        const height = img.height
        if(width && height) {
          canvas?.setDimensions({width, height})
        }
      })
    }
  }, [canvas, originalBgImage, bgImage])

  useEffect(() => {
    if(signToPdf?.page === page) {
      const { imageUrl } = signToPdf
      if(canvas) {
        fabric.Image.fromURL(imageUrl, (img) => {
          img.scaleToWidth(200)
          img.scaleToHeight(200)
          img.set({
            // left: canvasCenter.left,
            // top: canvasCenter.top,
            // selectable: true,
            // hasBorders: false,
            // originX: 'center',
            // originY: 'center'
            
          })
          img.on('mouseup', function() {
            handleUpdateDocumentArr()
          });
          canvas.add(img).renderAll()
        })
      }
    }
  }, [signToPdf])

  useEffect(() => {
    if(isDeleteClick) {
      handleDeleteSign()
    }
  }, [isDeleteClick])
  
  const handleDeleteSign = () => {
    const selectedObj = canvas?.getActiveObject()
    selectedObj && canvas?.remove(selectedObj)
  }
  
  const handleUpdateDocumentArr = () => {
    if(canvas) {
      const imageUrl = canvas.toDataURL({format: "jpg"})
      const outputObj = {
        page,
        isEdit: true,
        imageUrl 
      }
      displayOutputDocumentArr({document: outputObj})
    }
    
  }
  return (
    <canvas ref={fabricRef}></canvas>
  )
}

export default FabricPage