import MySign from "@/components/sign/MySign"
import { useState, useEffect } from "react"
import CanvasPreview from "@/components/sign/CanvasPreview"
import ArrowIcon from "@/components/svg/Arrow"
import FabricPage from "@/components/sign/FabricPage"
import { useAtom } from "jotai"
import { 
  pdfAtom, 
  outputDocumentArr, 
  stepAtom, 
  setPdfCombinePage, 
  signToPdfAtom, 
  setOutputDocumentArr,
  setOutputInfo
} from '@/store/index'

const StartSign = () => {
  const [pdf] = useAtom(pdfAtom)
  const [outputArr] = useAtom(outputDocumentArr)
  const [step] = useAtom(stepAtom)
  const [signToPdf] = useAtom(signToPdfAtom)
  const [, displayPdfCombinePage] = useAtom(setPdfCombinePage)
  const [, displayOutputDocumentArr] = useAtom(setOutputDocumentArr)
  const [, displayOutputInfo] = useAtom(setOutputInfo)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [isDeleteClick, setIsDeleteClick] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setCurrentPage(1)
    if(outputArr.length) {
      displayOutputDocumentArr({document: null})
      displayOutputInfo({
        isSubmit: false,
        docName: "",
        extension: "pdf"
      })
    }
    
  },[pdf])
  useEffect(() => {
    if(step === 3) {
      let timer: any = null
      if(outputArr.length < pdf?._pdfInfo.numPages) {
        timer = setTimeout(() => {
          setIsLoading(true)
          setCurrentPage(prev => prev+1)
        },500)
        return () => clearTimeout(timer);
      } else {
        setIsLoading(false)
        clearTimeout(timer);
      }
    }
  }, [step, currentPage])
  useEffect(() => {
    if(!isLoading && step === 3) {
      setCurrentPage(1)
      displayPdfCombinePage({page: 1})
    }
  }, [isLoading])
  
  useEffect(() => {
    const isEdit = outputArr.find(i => i?.page === signToPdf?.page)?.isEdit
    if(signToPdf !== null && signToPdf.page !== 0 && !isEdit) {
      const bgImage = outputArr.find(i => i?.page === signToPdf.page)?.imageUrl
      const outputObj = {
        page: signToPdf.page,
        isEdit: true,
        imageUrl: bgImage
      }
      displayOutputDocumentArr({document: outputObj})
    }
  }, [signToPdf])

  const handleSwitchPage = (direction: string) => {
    if(isLoading) return
    const totalPage = pdf?._pdfInfo.numPages
    if(direction === 'next' && currentPage < totalPage) {
      setCurrentPage((prevState) => prevState + 1)
      displayPdfCombinePage({page: currentPage + 1})
    } else if(direction === 'last' && (currentPage > 1 && totalPage !== 1)){
      setCurrentPage((prevState) => prevState - 1)
      displayPdfCombinePage({page: currentPage - 1})
    }
  }

  const handleDeleteSign = (canvas: any) => {
    setIsDeleteClick(true)
    const timer = setTimeout(() => {
      setIsDeleteClick(false)
      clearTimeout(timer)
    },2000)
  }
  return (
    <section className="flex flex-col lg:flex-row lg:justify-center mx-auto mt-[40px] w-[80%] max-w-[586px] lg:max-w-[1000px]">
      <MySign type="allowSelect" />
      <div className="flex-grow mt-[40px] lg:mt-0 lg:ml-[40px]">
        <h4 className="text-[#4F4F4F]">Sign document</h4>
        <span className="text-[#828282]">Drag the signature from the left to the signing document and adjust the position and size.</span>
        <div className="flex flex-col w-full h-[780px] pt-[16px] px-[42px] pb-[22px] mt-[20px] bg-white rounded-[5px]">
          <div className="flex-none flex justify-end h-[32px] mb-[12px]">
            <button onClick={handleDeleteSign} className={`flex-center w-[60px] h-[32px] ml-[12px] text-[14px] text-[#595ED3] bg-[#E9E1FF] rounded-[5px]`}>Clear</button>
          </div>
          <div className={`relative flex-grow w-full h-full border border-[#E0E0E0] ${isLoading ? 'overflow-hidden' : 'max-w-[670px]  overflow-auto'}`}>
            {Array.from(Array(pdf?._pdfInfo.numPages).keys()).map((i, key) => (
              <div key={key} className={outputArr.find(v => v?.page === key+1)?.isEdit === false && currentPage === key+1 && !isLoading ? '' : isLoading && (key + 1) ? 'flex-center' : 'hiddenSection'}>
                <CanvasPreview page={key+1} currentPage={currentPage} />
              </div>
            ))}
            
            
            {Array.from(Array(pdf?._pdfInfo.numPages).keys()).map((i, key) => (
              <div key={key} className={outputArr.find(v => v?.page === i+1)?.isEdit === true && currentPage === i+1 ? '' : 'hiddenSection'}>
                <FabricPage 
                  isDeleteClick={isDeleteClick} 
                  page={i+1} 
                  bgImage={outputArr.find(v => v?.page === i+1 && v.isEdit)?.imageUrl} 
                  isEdit={outputArr.find(v => v?.page === i+1)?.isEdit}
                />
              </div>
            ))}
            <div className={`absolute left-0 top-0 w-full h-full ${isLoading ? 'bg-[#fff] loadingAnimation z-[30]' : '-z-[20]'}`}></div>
          </div>
          <div className="flex-none flex justify-center mt-[18px]">
            {currentPage ? <button onClick={() => handleSwitchPage('last')} className={`${(currentPage > 1 && pdf?._pdfInfo.numPages !== 1) && !isLoading ? 'text-[#787CDA]' : 'text-[#BDBDBD]'}`}><ArrowIcon/></button> : ''}
            {currentPage ?<div className="h-[31px] mb-[10px] mx-[24px] leading-[38px] text-[14px] text-[#828282]">
              {!isLoading ? `${currentPage} / ${pdf?._pdfInfo.numPages}` : 'loading...'}
            </div> : ''}
            {currentPage ? <button onClick={() => handleSwitchPage('next')} className={`${currentPage < pdf?._pdfInfo.numPages && !isLoading ? 'text-[#787CDA]' : 'text-[#BDBDBD]'} rotate-180`}><ArrowIcon/></button> : ''}
          </div>
          
        </div>
      </div>
    </section>
  )
}

export default StartSign