import TrashcanIcon from "@/components/svg/Trashcan"
import UploadIcon from "@/components/svg/Upload"
import ArrowIcon from "@/components/svg/Arrow"
import { useRef, useState, useEffect } from "react"
import { pdfjs } from "react-pdf"
import { useAtom } from "jotai"
import { 
  pdfAtom, 
  setPdf, 
  stepAtom, 
  displayMessageBox, 
  stepDirectionAtom,
  setOutputDocumentArr,
  setOutputInfo
} from '@/store/index'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
interface FormError {
  signName?: boolean;
  drawingBoard?: boolean;
  uploadArea?: boolean;
}
interface ObjOfSignatureImage {
  drawPath: ImageData[];
  recordIndex: number;
  uploadedSignatureUrl: string;
  uploadedSignatureName: string
  isClearUploadFile: boolean;
}
interface SignatureImage {
  [key: string]: ObjOfSignatureImage
}
interface Props {
  uploadType: string;
  onUploadSign: Function;
  isClearUploadFile: boolean; 
  formError: FormError;
  isButtonClick: boolean;
  signatureImageList?: SignatureImage;
  activateRole?: string; 
}

const UploadArea = ({ 
  uploadType, 
  onUploadSign, 
  isClearUploadFile, 
  formError, 
  isButtonClick, 
  signatureImageList,
  activateRole
}: Props) => {
  const pdfCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const fileDivRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const thumbnailRef = useRef<HTMLImageElement | null>(null)
  const [draggingFile, setDraggingFile] = useState<boolean>(false)
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
  const [uploadFileType, setUploadFileType] = useState<string>('')
  const [uploadFileName, setUploadFileName] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)

  const [pdfLoading, setPdfLoading] = useState<boolean>(false)
  const [pdf,] = useAtom(pdfAtom)
  const [, displayPdf] = useAtom(setPdf)
  const [step] = useAtom(stepAtom)
  const [, setMessageBox] = useAtom(displayMessageBox)
  const [stepDirection] = useAtom(stepDirectionAtom)
  const [, displayOutputDocumentArr] = useAtom(setOutputDocumentArr)
  const [, displayOutputInfo] = useAtom(setOutputInfo)
  useEffect(() => {
    const {from, to} = stepDirection
    if(from === 4 && to === 2) {
      handleClearUpdateFile()
    }
  }, [step])
  useEffect(() => {
    setPdfLoading(true)
    handleRenderPdfPage()
  }, [pdf, currentPage]);

  useEffect(() => {
    if(uploadFileType.includes('pdf') || pdfCanvasRef !== null) {
      const c = pdfCanvasRef.current
      setCanvas(c)
      if(c) setCtx(c.getContext("2d"))
    }
  }, [uploadFileType, pdfCanvasRef]);

  useEffect(() => {
    if(isClearUploadFile) {
      handleClearUpdateFile()
    }
  }, [isClearUploadFile])


  useEffect(() => {
    if(!(signatureImageList && activateRole && thumbnailRef.current)) return
    thumbnailRef.current.src = signatureImageList[activateRole].uploadedSignatureUrl
    setUploadFileName(signatureImageList[activateRole].uploadedSignatureName)
    const isUpload = signatureImageList[activateRole].uploadedSignatureUrl
    if(!isUpload) return setUploadFileType("")
    setUploadFileType("image")
  }, [activateRole])

  const handleClearUpdateFile = () => {
    setUploadFileType('')
    if(thumbnailRef.current) {
      thumbnailRef.current.src = ""
    }
    displayOutputDocumentArr({document: null})
    displayOutputInfo({
      isSubmit: false,
      docName: "",
      extension: "pdf"
    })
    displayPdf({pdf: null})
  }
  const onDragEnter = () => {
    if(fileDivRef !== null) {
      setDraggingFile(true)
      fileDivRef.current?.classList.add('dragover')
    }
  }
  const onDragOver = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
  }
  const onDragLeave = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    if(fileDivRef !== null) {
      setDraggingFile(false)
      fileDivRef.current?.classList.remove('dragover')
    }
  }
  const onDrop = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    const isFileLegal = handleIsFileLegal(e.dataTransfer.files[0])
    if(!isFileLegal) return
    if(fileInputRef.current !== null) {
      fileInputRef.current.files = e.dataTransfer.files
      setUploadFileType(e.dataTransfer.files[0].type)
      handleFileImage(e.dataTransfer.files[0], e.dataTransfer.files[0].name)
    }
    if(fileDivRef !== null) {
      setDraggingFile(false)
      fileDivRef.current?.classList.remove('dragover')
    }
  }
  const onFileDrop = (e: any) => {
    e.preventDefault()
    const newFile = e.target.files[0]
    const isFileLegal = handleIsFileLegal(newFile)
    if(!isFileLegal) return
    handleFileImage(newFile, newFile.name)
  }
  const handleIsFileLegal = (file: File) => {
    if(!file) return
    // 3M file size limitation
    const limitSize = 3 * 1024 * 1024
    const fileSize = file.size
    const alertMessageStyle = {isDisplay: true, isMask: false, dialogName: 'alert', content: '', basicStyle: 'w-[270px] text-[#333333] bg-[#FF7070] shadow-[0_4px_12px_rgba(0,0,0,0.1)]', logoStyle: 'text-[#fff]'}
    const allowExtension = step === 1 ? ["png", "jpg", "jpeg"] : ["pdf"]
    const extensionArr = file.name.split(".")
    const extension = extensionArr[extensionArr.length - 1]
    setDraggingFile(false)
    fileDivRef.current?.classList.remove('dragover')
    if(!allowExtension.includes(extension)) {
      setMessageBox({...alertMessageStyle, content: `Please upload ${allowExtension.join("、")} extension of file`})
      return false
    }
    if(fileSize > limitSize) {
      setMessageBox({...alertMessageStyle, content: `File size nothing bigger than 3M bytes`, basicStyle: 'w-[340px] text-[#333333] bg-[#FF7070] shadow-[0_4px_12px_rgba(0,0,0,0.1)]'})
      return false
    }
    return true
  }
  const handleRenderPdfPage = () => {
    if(pdf) {
      if(!currentPage) return
      pdf.getPage(currentPage).then(function (page) {
        const testScale = 1
        const testViewport = page.getViewport({ scale: testScale})
        const originalWidth = testViewport.width
        const containerWidth = 300
        const scale = containerWidth / originalWidth
        const viewport = page.getViewport({ scale: scale})
        // Prepare canvas using PDF dimensions
        if(canvas && ctx) {
          canvas.height = viewport.height
          canvas.width = viewport.width
          // Render PDF page into canvas context
          const renderContext = {
            canvasContext: ctx,
            viewport
          }
          const renderTask = page.render(renderContext)
          renderTask.promise.then(function () {
            setPdfLoading(false)
          })
        }
      })
    }
  }

  const handleFileImage = (file: any, fileName: string) => {
    const fileReader = new FileReader()
    file.type.includes("pdf") ? fileReader.readAsArrayBuffer(file) : fileReader.readAsDataURL(file)
    fileReader.onload = function () {
      if(this.result) {
        setUploadFileType(file.type)
        if(file.type.includes("pdf")) {
          setUploadFileName(fileName)
          const pdfData = new Uint8Array(this.result as ArrayBuffer)
          const loadingTask = pdfjs.getDocument(pdfData)
          loadingTask.promise.then(
            function (pdf: any) {
              displayPdf({pdf})
              setCurrentPage(1)
            },
            function (reason: any) {
              // PDF loading error
            }
          )
        }
        
        else if(file.type.includes("image") && thumbnailRef.current && activateRole && signatureImageList) {
          onUploadSign(this.result.toString(), fileName)
          const role = activateRole.toLowerCase().replace(/\s+/g, '')
          const {uploadedSignatureUrl, uploadedSignatureName} = signatureImageList[role]
          thumbnailRef.current.src = uploadedSignatureUrl
          setUploadFileName(uploadedSignatureName)          
        }
      }
    }
  }
  const handleSwitchPage = (direction: string) => {
    const totalPage = pdf?._pdfInfo.numPages
    if(direction === 'next' && currentPage < totalPage) {
      setCurrentPage((prevState) => prevState + 1)
    } else if(direction === 'last' && (currentPage > 1 && totalPage !== 1)){
      setCurrentPage((prevState) => prevState - 1)
    }
  }
  return (
    <>
      <div 
        ref={fileDivRef} 
        className={`flex flex-col justify-center items-center w-full h-[245px] border bg-[#FFFFFF80] rounded-[5px] ${formError.uploadArea && isButtonClick ? 'border-[#f00]' : 'border-[#fff]'}`}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="text-[#787CDA]">
          <UploadIcon />
        </div>
        <span className="mt-[12px] mb-[8px]">Drag and Drop</span>
        { !draggingFile && <span>or</span>}
        { !draggingFile && <button onClick={() => fileInputRef.current?.click()} className="h-[32px] mt-[8px] px-[20px] mb-[20px] text-[#595ED3] bg-[#E9E1FF] rounded-[5px]">Select file</button> }
        <div className="flex flex-col text-[12px] text-[#595ED3]">
          <span>File type {uploadType}</span>
          <span>File size ＜3MB</span>
        </div>
        {/* ".png, .jpg, application/pdf" */}
        <input ref={fileInputRef} type="file" accept={step === 1 ? ".png, .jpg, .jpeg" : "application/pdf"} className="absolute -z-[10]" onChange={onFileDrop} />
      </div>

      <h4 className="mt-[32px] mb-[20px] text-[#4F4F4F]">{uploadType === 'pdf' ? 'Preview document' : 'Preview ID'}</h4>
      <div className="flex-center">
        <div  className={`${uploadFileType.includes('pdf') ? '' : 'invisible absolute -z-[10] h-0 overflow-hidden'} text-center`}>
          <div className="flex flex-col">
            <div className="flex-center w-full h-full min-w-[300px] min-h-[300px]">
              <canvas className={!pdfLoading ? '' : 'invisible absolute -z-[10]'} ref={pdfCanvasRef} width="500" height="500"></canvas>
              {pdfLoading && <div className="w-full h-full">Loading...</div>}
            </div>
            <div className="flex-center mt-[14px]">
              {currentPage ? <button onClick={() => handleSwitchPage('last')} className={`${(currentPage > 1 && pdf?._pdfInfo.numPages !== 1) ? 'text-[#787CDA]' : 'text-[#BDBDBD]'}`}><ArrowIcon/></button> : ''}
              {currentPage ?<div className="h-[31px] mb-[10px] mx-[24px] leading-[38px] text-[14px] text-[#828282]">{currentPage} / {pdf && pdf._pdfInfo.numPages}</div> : ''}
              {currentPage ? <button onClick={() => handleSwitchPage('next')} className={`${currentPage < pdf?._pdfInfo.numPages ? 'text-[#787CDA]' : 'text-[#BDBDBD]'} rotate-180`}><ArrowIcon/></button> : ''}
            </div>
            <h5 className="mt-[14px] text-[12px] text-[#333333]">{uploadFileName}</h5>
          </div>
        </div>


        <div className={uploadFileType.includes('image') && signatureImageList && activateRole && signatureImageList[activateRole].uploadedSignatureUrl ? 'flex flex-col items-center w-[200px] sm:w-[350px] h-[120px] border' : 'w-0 h-0 invisible absolute -z-[10] overflow-hidden'}>
          <img ref={thumbnailRef} src="" className="object-contain w-full h-full" />
          <h5 className="mt-[14px] text-[12px] text-[#333333]">{uploadFileName}</h5>
        </div>
        
        <div className={`
            flex flex-col items-center text-[#595ED3] 
            ${!uploadFileType ? "" : "w-0 h-0 invisible"}`
          }>
          <TrashcanIcon />
          <span className="mt-[12px]">Please upload file</span>
        </div>
    
      </div>
    </>
  )
}

export default UploadArea