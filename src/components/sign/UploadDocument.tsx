import UploadArea from "@/components/sign/UploadArea"
import { useState } from "react"
const UploadDocument = () => {
  const [isClearUploadFile, setIsClearUploadFile] = useState(false)
  const [formError, setFormError] = useState({
    uploadArea: false
  })
  const [isButtonClick, setIsButtonClick] = useState({uploadArea: false})
  
  const handleUploadSign = () => {

  }
  return  (
    <section className="w-[80%] max-w-[546px] lg:w-[586px] lg:max-w-[1000px] mx-auto">
      <h4 className="text-[#4F4F4F]">Upload document to be signed<span className="ml-[4px] text-[#FF7070]">*</span></h4>
      <div className="mt-[20px]">
        <UploadArea uploadType="pdf" onUploadSign={handleUploadSign} isClearUploadFile={isClearUploadFile} formError={formError} isButtonClick={isButtonClick.uploadArea} />
        {/* <button onClick={handleUploadSaveSign} className={`flex-center w-[104px] h-[32px] mx-auto mt-[70px] text-[14px] text-[#fff] bg-[#595ED3] rounded-[5px] ${imgSrc && signName ? 'text-[#fff] bg-[#595ED3]' : 'text-[#E0E0E0] bg-[#BDBDBD]'}`}>建立簽名檔</button> */}
      </div>
    </section>
  )
  
}

export default UploadDocument