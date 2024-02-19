import Pencil from "@/components/svg/Pencil"
import UploadIcon from "@/components/svg/Upload"
import LastIcon from "@/components/svg/Last"
import NextIcon from "@/components/svg/Next"
import UploadArea from "@/components/sign/UploadArea"
import MySign from "@/components/sign/MySign"
import ColorPickerIcon from "@/components/svg/ColorPicker"
import ActiveColorPickerIcon from "@/components/svg/ActiveColorPicker"
import RadioInput from "@/components/sign/RadioInput"
import { displayMessageBox, addSign, stepAtom } from '@/store/index'
import { useState, useRef, useEffect } from "react"
import { useAtom } from "jotai"
import getTouchPos from "@/utils/getTouchPos"
import getMousePos from "@/utils/getMousePos"

interface SignerInputs {
  [key: string]: {
    labelName: string;
    value: string;
    lengthLimit: number;
  };
}
export interface SignerDetails {
  partya: SignerInputs;
  partyb: SignerInputs;
}
interface ObjOfSignatureImage {
  drawPath: ImageData[];
  recordIndex: number;
  uploadedSignatureUrl: string;
  uploadedSignatureName: string
  isClearUploadFile: boolean;
}
export interface SignatureImage {
  [key: string]: ObjOfSignatureImage
}

interface FormError {
  partya: string[];
  partyb: string[];
  drawingBoard: boolean;
  uploadArea: boolean;
}

const CreateSign = () => {
  const [formError, setFormError] = useState<FormError>({
    partya: [],
    partyb: [],
    drawingBoard: false,
    uploadArea: false
  })
  const [, setMessageBox] = useAtom(displayMessageBox)
  const [step] = useAtom(stepAtom)
  const [isCreateSign, setIsCreateSign] = useState<boolean>(true)
  const [drawingBoard, setDrawingBoard] = useState<{width: number, height: number}>({
    width: 0,
    height: 0
  })
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
  
  // const [imgSrc, setImgSrc] = useState<string>('')
  const [drawing, setDrawing] = useState<boolean>(false)
  const drawingBoardRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [signatureImage, setSignatureImage] = useState<SignatureImage>({
    partya: {
      drawPath:[],
      recordIndex: 0,
      uploadedSignatureUrl: "",
      uploadedSignatureName: "",
      isClearUploadFile: false
    },
    partyb: {
      drawPath:[],
      recordIndex: 0,
      uploadedSignatureUrl: "",
      uploadedSignatureName: "",
      isClearUploadFile: false
    }
  })

  const [isButtonClick, setIsButtonClick] = useState({
    drawingArea: false,
    uploadArea: false
  })
  const [colorPicker, setColorPicker] = useState({
    activeStyle: 'text-[#000]',
    activeColor: '#000',
    list : [
      {
        style: 'text-[#000]',
        color: '#000'
      },
      {
        style: 'text-[#0400C0]',
        color: '#0400C0'
      },
      {
        style: 'text-[#C00000]',
        color: '#C00000'
      },
    ]
  })
  
  const [currentSign, setCurrentSign] = useState({
    activateRole: "Party A",
    list: ["Party A", "Party B"]
  })
  
  const [signerDetails, setSignerDetails] = useState<SignerDetails>({
    partya: {
      name: {
        labelName: "Seller/Landlord's Name",
        value: "",
        lengthLimit: 20
      },
      contractType: {
        labelName: "Contract Type",
        value: "",
        lengthLimit: 20
      },
      propertyAddress: {
        labelName: "Property Address",
        value: "",
        lengthLimit: 0
      }
    },
    partyb: {
      name: {
        labelName: "Buyer/Tenant's Name",
        value: "",
        lengthLimit: 20
      },
      phone: {
        labelName: "Buyer/Tenant's Phone Number",
        value: "",
        lengthLimit: 0
      }
    }
  })
  const [, setAddSign] = useAtom(addSign)
  const tabStyle = "relative z-[5] flex items-center px-[20px] py-[8px] rounded-full cursor-pointer"
  
  const getRoleInput = () => {
    const role = currentSign.activateRole.toLowerCase().replace(/\s+/g, '')
    const roleInputs = signerDetails[role as keyof SignerDetails]
    return roleInputs
  }

  const getRoleRecord = () => {
    const role = currentSign.activateRole.toLowerCase().replace(/\s+/g, '')
    const roleRecord = signatureImage[role as keyof SignatureImage]
    return roleRecord
  }

  const updateSignatureImage = (updateData: ObjOfSignatureImage) => {
    const role = currentSign.activateRole.toLowerCase().replace(/\s+/g, '')
    setSignatureImage((prev) => ({...prev, [role]: updateData}))
  }

  useEffect(() => {
    if(drawingBoardRef.current !== null && canvasRef !== null) {
      setDrawingBoard({
        ...drawingBoard,
        width: drawingBoardRef.current?.offsetWidth,
        height: drawingBoardRef.current?.offsetHeight
      })
      const c = canvasRef.current
      setCanvas(c)
      if(c) setCtx(c.getContext("2d"))
    }
  }, [drawingBoardRef, canvasRef])

  useEffect(() => {
    if(ctx) {
      const newDraw = ctx?.getImageData(0, 0, drawingBoard?.width, drawingBoard?.height)
      // 把 draw path 
      for(let role in signatureImage) {
        const roleRecord = signatureImage[role as keyof SignatureImage]
        roleRecord.drawPath = [...roleRecord.drawPath, newDraw]
        setSignatureImage((prev) => ({...prev, roleRecord}))
      }
    }
  }, [ctx])

  useEffect(() => {
    // 每次上下一步重新把簽名放到 canvas 上, 確定目前的 role 再根據相對的 recordIndex 把 drawPath 放回 canvas
    const roleRecord = getRoleRecord()
    const currentDrawPath = roleRecord.drawPath
    const recordIndex = roleRecord.recordIndex
    ctx?.putImageData(currentDrawPath[recordIndex], 0, 0)
  }, [signatureImage.partya.recordIndex, signatureImage.partyb.recordIndex, currentSign.activateRole])

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    setDrawing(true)
    const touchPos = getTouchPos(canvas, e)
    ctx?.beginPath()
    ctx?.moveTo(touchPos.x, touchPos.y)
    e.preventDefault()
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if(!drawing) return
    const touchPos = getTouchPos(canvas, e)
    if(ctx !== null) {
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.strokeStyle = colorPicker.activeColor
      ctx.lineTo(touchPos.x, touchPos.y)
      ctx.stroke()
    }
  }

  const handleTouchEnd = () => {
    setDrawing(false)
  }
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true)
    const mousePos = getMousePos(canvas, e)
    if(ctx !== null) {
      ctx.beginPath()
      ctx.moveTo(mousePos.x, mousePos.y)
      e.preventDefault()
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if(!drawing) return
    const mousePos = getMousePos(canvas, e)
    if(ctx !== null) {
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.strokeStyle = colorPicker.activeColor
      ctx.lineTo(mousePos.x, mousePos.y)
      ctx.stroke()
    }
  }

  const handleMouseUp = () => {
    setDrawing(false)
    const width = drawingBoard?.width
    const newDraw = ctx?.getImageData(0, 0, width, drawingBoard?.height)
    // e.g. party a => partya
    const roleRecord = getRoleRecord()
    const currentDrawPath = roleRecord.drawPath
    let recordIndex = roleRecord.recordIndex
    if (!newDraw) return
    if(recordIndex === currentDrawPath.length - 1) {
      roleRecord.drawPath = [...roleRecord.drawPath, newDraw]
    } else {
      // 如果在index 1畫的化，會把recordDrawPath 2,3的資料清掉再填入新畫的進陣列，index再+1
      let newArr = currentDrawPath.filter((element, index) => index < recordIndex + 1)
      newArr.push(newDraw)
      roleRecord.drawPath = newArr
    }
    roleRecord.recordIndex += 1
    updateSignatureImage(roleRecord)
  }
  
  const handleClearBoard = () => {
    if(ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height)
    const roleRecord = getRoleRecord()
    roleRecord.drawPath = [roleRecord.drawPath[0]]
    roleRecord.recordIndex = 0
    updateSignatureImage(roleRecord)
    setFormError((prevState) => ({
      ...prevState, 
      drawingBoard: false
    }))
    
  }

  const handleClearUpload = () => {
    const roleRecord = getRoleRecord()
    roleRecord.uploadedSignatureUrl = ""
    roleRecord.uploadedSignatureName = ""
    roleRecord.isClearUploadFile = true
    updateSignatureImage(roleRecord)
    setFormError((prev) => ({
      ...prev, 
      uploadArea: false
    }))
  }

  const handleClearInput = () => {
    const roleInput = getRoleInput()
    for (let input in roleInput) {
      roleInput[input].value = ""
    }
    setSignerDetails((prev) => ({...prev, roleInput}))
  }

  const handleSaveSign = () => {
    const role = currentSign.activateRole.toLowerCase().replace(/\s+/g, '')
    const roleInput = getRoleInput()
    const roleRecord = getRoleRecord()
    const roleInputError: string[] = []
    const { name } = roleInput
    // get rols's inputs
    for (let input in getRoleInput()) {
      if (!roleInput[input].value) roleInputError.push(input)
    }
    setFormError((prevState) => ({
      ...prevState, 
      [role]: roleInputError,
      drawingBoard: !(roleRecord.recordIndex)
    }))
    setIsButtonClick((prevState) => ({...prevState, drawingArea: true}))
    const timer = setTimeout(() => {
      setIsButtonClick((prevState) => ({...prevState, drawingArea: false}))
      setFormError((prev) => ({
        ...prev, 
        [role]: []
      }))
      clearTimeout(timer)
    }, 3000)

    // // make sure customer's details filled
    if(!isAvailableCreateSign()) {
      setMessageBox({isDisplay: true, isMask: false, dialogName: 'alert', content: 'Please fill in the required fields！', basicStyle: 'w-[300px] text-[#333333] bg-[#FF7070] shadow-[0_4px_12px_rgba(0,0,0,0.1)]', logoStyle: 'text-[#fff]'})
    } else {
      const imageURL = canvas?.toDataURL()
      if(imageURL) {
        const newSignElement = {id: Date.now(), title: name.value, image: imageURL}
        handleStorePartyInfo(role)
        setAddSign(newSignElement)
        // handleClearBoard()
        // handleClearInput()
        setMessageBox({isDisplay: true, isMask: false, dialogName: 'success', content: 'Successfully created！', basicStyle: 'w-[200px] bg-[#E3FEC7] shadow-[0_4px_12px_rgba(0,0,0,0.1)]'})
      }
    }
  }

  const handleStorePartyInfo = (role: string) => {
    let loginUser = localStorage.getItem("loginUser");
    const { name, contractType, propertyAddress, phone } = getRoleInput()
    if(!loginUser) {
      setMessageBox({isDisplay: true, isMask: false, dialogName: 'alert', content: 'Please Login to start signing！', basicStyle: 'w-[300px] text-[#333333] bg-[#FF7070] shadow-[0_4px_12px_rgba(0,0,0,0.1)]', logoStyle: 'text-[#fff]'})
      return
    }
    loginUser = JSON.parse(loginUser)
    localStorage.setItem(role, 
      role === "partya" ?
      JSON.stringify({
        sellerName: name.value,
        contractType: contractType.value,
        propertyAddress: propertyAddress.value
      }) : JSON.stringify({
        buyerName: name.value,
        buyerNumber: phone.value
      })
    );
  }

  const isAvailableCreateSign = () => {
    const roleRecord = getRoleRecord()
    const roleInput = getRoleInput()
    const isDraw = roleRecord.drawPath
    const isUploadSignature = roleRecord.uploadedSignatureUrl
    const roleInputError: string[] = []
    for (let input in roleInput) {
      if (!getRoleInput()[input].value) roleInputError.push(input)
    }
    return !roleInputError.length && ((isCreateSign && isDraw.length > 1) || (!isCreateSign && isUploadSignature))
  }

  const handleUploadSign = (img: string, fileName: string) => {
  // 針對某個 role 處理
    const roleRecord = getRoleRecord()
    roleRecord.isClearUploadFile = false
    roleRecord.uploadedSignatureUrl = img
    roleRecord.uploadedSignatureName = fileName
    updateSignatureImage(roleRecord)
  }

  const handleUploadSaveSign = () => {
    // if(!isAvailableCreateSign()) return
    const role = currentSign.activateRole.toLowerCase().replace(/\s+/g, '')
    const roleInput = getRoleInput()
    const roleRecord = getRoleRecord()
    const roleInputError: string[] = []
    const { name } = roleInput
    // get rols's inputs
    for (let input in getRoleInput()) {
      if (!roleInput[input].value) roleInputError.push(input)
    }
    setFormError((prevState) => ({
      ...prevState, 
      [role]: roleInputError,
      uploadArea: !(roleRecord.uploadedSignatureUrl)
    }))
    setIsButtonClick((prevState) => ({...prevState, uploadArea: true}))
    const timer = setTimeout(() => {
      setIsButtonClick((prevState) => ({
        ...prevState,
        uploadArea: false,
      }))
      setFormError((prev) => ({
        ...prev, 
        [role]: []
      }))
      clearTimeout(timer)
    }, 3000)
    if(!isAvailableCreateSign()) {
      setMessageBox({isDisplay: true, isMask: false, dialogName: 'alert', content: 'Please fill in the required fields！', basicStyle: 'w-[300px] text-[#333333] bg-[#FF7070] shadow-[0_4px_12px_rgba(0,0,0,0.1)]', logoStyle: 'text-[#fff]'})
    } else {
      const newSignElement = {id: Date.now(), title: name.value, image: roleRecord.uploadedSignatureUrl}
      setAddSign(newSignElement)
      // handleClearUpload()
      // handleClearInput()
      setMessageBox({isDisplay: true, isMask: false, dialogName: 'success', content: 'Successfully created！', basicStyle: 'w-[200px] bg-[#E3FEC7] shadow-[0_4px_12px_rgba(0,0,0,0.1)]'})
    }
  }

  const handleGoLastStep = () => {
    const roleRecord = getRoleRecord()
    if(roleRecord.recordIndex === 0) return
    roleRecord.recordIndex -= 1
    setSignatureImage((prev) => ({...prev, roleRecord}))
  }
  const handleGoNextStep = () => {
    const roleRecord = getRoleRecord()
    if(roleRecord.drawPath.length > 1 && roleRecord.recordIndex < roleRecord.drawPath.length - 1) {
      roleRecord.recordIndex += 1
      setSignatureImage((prev) => ({...prev, roleRecord}))
    }
  }
  

  const handleSwitchSigner = (name: string) => {
    setCurrentSign((prev) => ({...prev, activateRole: name}))
    // 每當改變signer 重新把該角色canvas 記錄放回去

  }
  
  
  return (
    <section className="max-w-[546px] lg:w-[820px] lg:max-w-[1000px] mx-auto">
      <ul className={`relative flex w-max mx-auto bg-[#FFFFFF80] rounded-full px-[10px] py-[8.5px]`}>
        <li 
          className={
            `${tabStyle} animation ${isCreateSign ? 'text-[#fff]' : 'text-[#828282]'}`
          } 
          onClick={() => setIsCreateSign(true)}
        >
          <div><Pencil /></div>
          <span className="ml-[8px]">Draw Signature</span>
        </li>
        <li 
          className={
            `${tabStyle} animation ${!isCreateSign ? 'text-[#fff]' : 'text-[#828282]'}`
          } 
          onClick={() => setIsCreateSign(false)}
        >
          <div><UploadIcon /></div>
          <span className="ml-[8px]">Upload ID</span>
        </li>
        <div className={`animation absolute ${isCreateSign ? 'left-[10px] z-[2] w-[175px]' : 'left-[188px] z-[2] w-[135px]'} top-[8.5px] h-[40px] bg-[#595ED3] rounded-full`}></div>
      </ul>

      <div className="flex flex-col lg:flex-row lg:justify-center mx-auto mt-[40px] w-[80%] mmd:w-full lg:max-w-[1000px]">
        <MySign />
        <div className="flex-grow mt-[40px] lg:mt-0 lg:ml-[40px]">

          <div className="radio-container flex mt-[20px]">
            {
              currentSign.list.map(i => <RadioInput key={i} clickHandler={handleSwitchSigner} activateItem={currentSign.activateRole} name={i} />)
            }
          </div>

          <div className={`${currentSign.activateRole === "Party A" ? '' : 'hidden'}`}>
            {
              Object.keys(signerDetails.partya).map((i: string, idx) => (
                <div key={idx+i} className="mt-[20px]">
                  <h4 className="text-[#4F4F4F]">{ signerDetails.partya[i].labelName }<span className="ml-[4px] text-[#FF7070]">*</span></h4>
                  <div className="relative max-w-[360px] h-[40px] mt-[20px]">
                    <input 
                      type="text" 
                      value={signerDetails.partya[i].value}
                      onChange={(e) => {
                        const newSignerDetails = { ...signerDetails };
                        newSignerDetails.partya[i].value = e.target.value;
                        setSignerDetails(newSignerDetails);
                      }}
                      className={`
                      signInput w-full h-full pr-[70px] rounded-[5px]
                      ${formError.partya.includes(i) ? "border border-[#f00]" : ""}
                      `
                      } placeholder={`Enter ${signerDetails.partya[i].labelName.toLowerCase()}...`} name="firstName" maxLength={signerDetails.partya[i].lengthLimit ? signerDetails.partya[i].lengthLimit : 200} />
                    {
                      Boolean(signerDetails.partya[i].lengthLimit) && (
                        <span className="absolute right-0 top-0 bottom-0 my-auto pr-[10px] text-[#BDBDBD] leading-[40px]">{signerDetails.partya[i].value.length}／{signerDetails.partya[i].lengthLimit}</span>
                      )
                    }
                  </div>
                </div>
              ))
            }
          </div>

          <div className={`${currentSign.activateRole === "Party B" ? '' : 'hidden'}`}>
            {
              Object.keys(signerDetails.partyb).map((i: string, idx) => (
                <div key={idx+i} className="mt-[20px]">
                  <h4 className="text-[#4F4F4F]">{ signerDetails.partyb[i].labelName }<span className="ml-[4px] text-[#FF7070]">*</span></h4>
                  <div className="relative max-w-[360px] h-[40px] mt-[20px]">
                    <input 
                      type="text" 
                      value={signerDetails.partyb[i].value}
                      onChange={(e) => {
                        const newSignerDetails = { ...signerDetails };
                        newSignerDetails.partyb[i].value = e.target.value;
                        setSignerDetails(newSignerDetails);
                      }}
                      className={`
                      signInput w-full h-full pr-[70px] rounded-[5px] 
                      ${formError.partyb.includes(i)
                        ? 'border border-[#f00]' 
                        : ''
                      }`}
                      placeholder={`Enter ${signerDetails.partyb[i].labelName.toLowerCase()}...`} name="firstName" maxLength={signerDetails.partyb[i].lengthLimit ? signerDetails.partyb[i].lengthLimit : 200} />
                      {
                        Boolean(signerDetails.partyb[i].lengthLimit) && (
                          <span className="absolute right-0 top-0 bottom-0 my-auto pr-[10px] text-[#BDBDBD] leading-[40px]">{signerDetails.partyb[i].value.length}／{signerDetails.partyb[i].lengthLimit}</span>
                        )
                      }
                  </div>
                </div>
              ))
            }
          </div>
          
          <div>
            <h4 className="mt-[32px] mb-[20px] text-[#4F4F4F]">{isCreateSign ? "Draw Signature Here" : "Upload ID"}<span className="ml-[4px] text-[#FF7070]">*</span></h4>

            <div className={isCreateSign ? '' : 'invisible absolute -z-[10]'}>
              <div 
                ref={drawingBoardRef} 
                className={`
                  relative w-full h-[340px] bg-[#fff] rounded-[5px] overflow-hidden 
                  ${formError.drawingBoard && isButtonClick.drawingArea ? 'border border-[#f00]' : ''}`
                }>
                <canvas
                className="bg-[#fff]"
                ref={canvasRef}
                width={drawingBoard.width}
                height={drawingBoard.height}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                >
                </canvas>
                {
                  !drawing && <div className="flex absolute top-[14px] right-[14px]">
                  <button onClick={handleGoLastStep} className={`flex-center w-[32px] h-[32px] rounded-[5px] ${getRoleRecord().recordIndex === 0 ? 'text-[#BDBDBD] bg-[#F2F2F2]' : 'text-[#787CDA] bg-[#E9E1FF]'}`}><LastIcon /></button>
                  <button onClick={handleGoNextStep} className={`flex-center w-[32px] h-[32px] ml-[12px] rounded-[5px] ${!(getRoleRecord().drawPath.length > 1 && getRoleRecord().recordIndex < getRoleRecord().drawPath.length - 1) ? 'text-[#BDBDBD] bg-[#F2F2F2]' : 'text-[#787CDA] bg-[#E9E1FF]'}`}><NextIcon /></button>
                  <button className={`flex-center w-[60px] h-[32px] ml-[12px] text-[14px] text-[#595ED3] bg-[#E9E1FF] rounded-[5px]`} onClick={() => handleClearBoard()}>Clear</button>
                </div>
                }
                {
                  <div className="flex absolute left-[20px] top-[14px]">
                    {colorPicker.list.map((picker,idx) => (
                    <div key={idx} className="colorPicker flex-center relative w-[36px] h-[32px] cursor-pointer" onClick={() => setColorPicker({...colorPicker, activeStyle: picker.style, activeColor: picker.color})}>
                        {picker.style === colorPicker.activeStyle && <div className="absolute"><ActiveColorPickerIcon /></div>}
                        <div className={`relative z-[10] ${picker.style}`}><ColorPickerIcon /></div>
                      </div>
                    ))}
                  </div>
                }
              </div>
              <button className={`flex-center h-[32px] mx-auto px-[10px] mt-[20px] text-[14px] rounded-[5px] 
                ${
                  isAvailableCreateSign()
                  ? 'text-[#fff] bg-[#595ED3]' 
                  : 'text-[#E0E0E0] bg-[#BDBDBD]'
                  
                }`
                } 
                onClick={handleSaveSign}
                >Create signature
              </button>
                
                
            </div>
          
            <div className={isCreateSign ? 'hidden' : ''}>
              <UploadArea uploadType={step === 1 ? "png／jpg／jpeg" : "pdf"} activateRole={currentSign.activateRole.toLowerCase().replace(/\s+/g, '')} signatureImageList={signatureImage} onUploadSign={handleUploadSign} isClearUploadFile={getRoleRecord().isClearUploadFile} formError={formError} isButtonClick={isButtonClick.uploadArea} />
              <button onClick={handleUploadSaveSign} className={`flex-center h-[32px] mx-auto px-[10px] mt-[70px] text-[14px] rounded-[5px] ${
                isAvailableCreateSign()
                ? 'text-[#fff] bg-[#595ED3]' : 'text-[#E0E0E0] bg-[#BDBDBD]'}`}>Upload ID</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CreateSign