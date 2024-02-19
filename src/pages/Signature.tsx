import { jsPDF } from "jspdf";
import DownloadResult from "@/components/sign/DownloadResult"
import ProgressBarIcon from "@/components/svg/ProgressBar"
import CreateSign from "@/components/sign/CreateSign"
import UploadDocument from "@/components/sign/UploadDocument"
import StartSign from "@/components/sign/StartSign"
import { useEffect, useRef } from "react"
import { useAtom } from "jotai"
import { ToastContainer, toast } from 'react-toastify';

import { 
  displayMessageBox, 
  signListAtom, 
  setSignList, 
  pdfAtom, 
  stepAtom, 
  setCurrentStep, 
  outputInfoAtom, 
  setOutputInfo, 
  outputDocumentArr,
  setStepDirection,
  setOutputDocumentArr,
  clearSignatureList
} from '@/store/index'
const Signature = () => {
  const [, displaySignatureList] = useAtom(clearSignatureList)
  const [signList] = useAtom(signListAtom)
  const [outputInfo] = useAtom(outputInfoAtom)
  const [, displaySignList] = useAtom(setSignList)
  const [, setMessageBox] = useAtom(displayMessageBox)
  const [currentStep] = useAtom(stepAtom)
  const [, displayStepDirection] = useAtom(setStepDirection)
  const [, displayStep] = useAtom(setCurrentStep)
  const [, displayOutputInfo] = useAtom(setOutputInfo)
  const [, displayOutputDocumentArr] = useAtom(setOutputDocumentArr)
  const [outputArr] = useAtom(outputDocumentArr)
  const [pdf] = useAtom(pdfAtom)
  const progressBarRef = useRef<any>(null)
  const alertMessage = {isDisplay: true, isMask: false, dialogName: 'alert', content: '', basicStyle: 'w-[300px] text-[#333333] bg-[#FF7070] shadow-[0_4px_12px_rgba(0,0,0,0.1)]', logoStyle: 'text-[#fff]'}


  const handleDownloadDocument = () => {
    displayOutputInfo({isSubmit: true})
    const {docName, extension} = outputInfo
    if(!docName || !extension) {
      setMessageBox({...alertMessage, content: 'Please fill in document name'})
      return
    }
  
    if(extension === "jpg") {
      for(let item of outputArr) {
        // const dataURL = canvas.toDataURL({ format: "png" });
        const link = document.createElement("a");
        link.download = `${docName}${item?.page}.jpg`;
        if(item) {
          link.href = item?.imageUrl;
        }
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        if(link.parentNode) {
          link.parentNode.removeChild(link);
        }
      }
    } else if(extension === "pdf") {
      // 設定第一張pdf尺寸
      if(outputArr[0]) {
        const firstPage = outputArr[0]
        const {width, height} = firstPage
        let pdf = new jsPDF('p', 'px', [width, height]);
        for(const [index, item] of outputArr.entries()) {
          if(item) {
            const {width , height} = item
            pdf.addImage(item?.imageUrl, "JPEG", 0, 0, width, height);
            if(item.page < outputArr.length) {
              // 設定第一張之外的pdf頁面尺寸
              pdf.addPage([width, height])
            }
          }
        }
        pdf.save(`${docName}.pdf`);
        
      }
    }

    // remove all signatures in list
    displaySignatureList()
    toast.success('Downloading document, signature list has been cleared and page will refresh in one minute');
    const timer = setTimeout(() => {
      window.location.reload();
      clearTimeout(timer)
    }, 1000 * 62)
  }

  useEffect(() => {
    displaySignList()
    if(progressBarRef) {
      const pathLength = progressBarRef.current.getTotalLength()
      progressBarRef.current.style.strokeDasharray = pathLength;
      progressBarRef.current.style.animation = `zeroToStep${currentStep} ${currentStep/2}s linear forwards`
    }
  },[])

  const stepList = [
    {
      id: 1,
      name: 'Create Signature',
      style: 'left-[-32px]'
    },
    {
      id: 2,
      name: 'Upload Document',
      style: 'left-[5px]'
    },
    {
      id: 3,
      name: 'Start Signing',
      style: 'right-[-55px]'
    },
    {
      id: 4,
      name: 'Download Signed Document',
      style: 'right-[-70px]'
    },
  ]

  const handleSwitchStep = (nextStep: number) => {
    if(currentStep === 1) {
      if(!signList.length) return setMessageBox({...alertMessage, content: 'Please create signature'})
    } else if(currentStep === 2 && !pdf && nextStep === 3) {
      setMessageBox({...alertMessage, content: 'Please upload document to be signed', basicStyle: 'w-[340px] text-[#333333] bg-[#FF7070] shadow-[0_4px_12px_rgba(0,0,0,0.1)]'})
      return
    } else if(currentStep === 3 && nextStep === 4) {
      let loginUser = localStorage.getItem("loginUser");
      let partya = localStorage.getItem("partya");
      let partyb = localStorage.getItem("partyb");

      if(loginUser && partya && partyb) {
        loginUser = JSON.parse(loginUser)
        partya = JSON.parse(partya)
        partyb = JSON.parse(partyb)
        // fetch('https://dummyjson.com/products/1')
        // .then(res => res.json())
        // .then(json => console.log(json))
      }
      
    } else if(currentStep === 4 && nextStep === 2) {
      console.log("now is step 4")
      displayOutputDocumentArr({document: null})
      displayOutputInfo({
        isSubmit: false,
        docName: "",
        extension: "pdf"
      })
      
    }
    window.scrollTo(0, 0)
    displayStep({step: nextStep})
    displayStepDirection({from: currentStep, to: nextStep})
    progressBarRef.current.style.animation = `step${currentStep}ToStep${nextStep} 1s linear forwards`
  }

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={1000 * 60}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <section className="w-full mx-auto overflow-x-hidden">
        <div className="w-[300px] xs:w-[400px] mmd:w-[620px] mx-auto">
          <div className={`
            relative flex justify-center mt-[50px] mx-auto w-[543px] animation 
            ${currentStep === 1 
              ? 'left-[40%] xs:left-[41%] mmd:left-[39%]' 
              : currentStep === 2 
              ? 'left-[-13%] xs:left-[2%] mmd:left-[13%]' 
              : currentStep === 3 
              ? 'left-[-66%] xs:left-[-38%] mmd:left-[-13%]'    
              : currentStep === 4
              ? 'left-[-120%] xs:left-[-77%] mmd:left-[-40%]'
              : ''
            }
            md:left-0
          `}>
            <div className="w-full mb-[68px]">
              {/* 背景 */}
              <div className="absolute text-[#F2F2F2] z-[5]">
                <ProgressBarIcon />
              </div>

              <div className="relative z-[10]">
                <svg width="543" height="63" viewBox="0 0 543 63" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path ref={progressBarRef} d="M539.817 58.801C523.388 49.5565 509.817 37.917 508.483 22.1103C507.15 6.3036 511.817 3.33386 514.245 3.33386C516.674 3.33386 521.483 7.74058 521.579 21.0086C521.674 34.2767 517.579 47.9279 490.341 55.1606C463.102 62.3934 395.96 58.8489 379.674 55.7833C360.722 52.1909 343.864 40.6472 344.626 20.6254C345.531 -2.12663 359.531 3.62126 359.436 20.6254C359.388 29.7741 356.007 40.9825 338.198 50.227C319.055 60.1421 271.341 59.6632 271.341 59.6632C271.341 59.6632 223.817 60.1421 204.722 50.227C186.96 40.9825 183.579 29.822 183.579 20.6254C183.483 3.62126 197.483 -2.12663 198.341 20.6254C199.102 40.6472 182.293 52.1909 163.436 55.7833C147.198 58.8489 80.293 62.3934 53.1501 55.1606C26.0073 47.9279 21.912 34.3246 22.0072 21.0086C22.1025 7.69268 26.8644 3.33386 29.293 3.33386C31.7215 3.33386 36.3882 6.3036 35.0549 22.1103C33.7215 37.917 20.2453 49.5565 3.81677 58.801" stroke="#787CDA" strokeWidth="6" strokeMiterlimit="10" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="flex justify-between">
                {
                  stepList.map((step, index) => (
                    <div key={index} className={`${step.style} relative flex flex-col items-center ${currentStep === step.id ? 'text-[#333333]' : currentStep > step.id ? 'text-[#787CDA]' : 'text-[#BDBDBD]'}`}>
                      <span className="text-[12px]">step{step.id}</span>
                      <h3 className="relative z-[3] text-center text-[16px] font-medium">{step.name}</h3>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
        <div className={currentStep === 1 ? '' : 'hiddenSection'}>
          <CreateSign />
        </div>
        <div className={currentStep === 2 ? '' : 'hiddenSection'}>
          <UploadDocument />
        </div>
        <div className={currentStep === 3 ? '' : 'hiddenSection'}>
          <StartSign />
        </div>
        <div className={currentStep === 4 ? '' : 'hiddenSection'}>
          <DownloadResult />
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center mt-[60px]">
          {
            currentStep !== 1 && <button className="flex-center w-[180px] h-[40px] text-[14px] text-[#4F4F4F] border border-[#e2E1FF] rounded-full" onClick={() => handleSwitchStep(currentStep - 1)}>Previous</button>
          }
          {
            currentStep === 1 && <button className={`flex-center w-[180px] h-[40px] ${currentStep === 1 && !signList.length ? 'text-[#fff] bg-[#BDBDBD] ' : 'text-[#595ED3] bg-[#E9E1FF]'} ${currentStep !== 1 ? 'ml-[20px]' : ''} text-[14px] rounded-full`} onClick={() => handleSwitchStep(currentStep + 1)}>Next</button>
          }
          {
            currentStep === 2
            ? <button className={`flex-center w-[180px] h-[40px] mt-[20px] sm:mt-0 sm:ml-[20px] text-[14px] rounded-full ${!pdf ? 'text-[#fff] bg-[#BDBDBD]' : 'text-[#595ED3] bg-[#E9E1FF]'}`} onClick={() => handleSwitchStep(3)}>Start signing</button>
            : currentStep === 3
            ? <button className="flex-center w-[180px] h-[40px] mt-[20px] sm:mt-0 sm:ml-[20px] text-[14px] text-[#595ED3] bg-[#E9E1FF] rounded-full" onClick={() => handleSwitchStep(currentStep + 1)}>Download document</button>
            : currentStep === 4
            ? <button onClick={handleDownloadDocument} className="flex-center w-[180px] h-[40px] mt-[20px] sm:mt-0 sm:ml-[20px] text-[14px] text-[#595ED3] bg-[#E9E1FF] rounded-full">Download<span className="ml-[6px]">{outputInfo.extension}</span></button>
            : null
          }
          {
            currentStep === 4 && <button onClick={() => handleSwitchStep(2)} className="flex-center w-[180px] h-[40px] mt-[20px] sm:mt-0 sm:ml-[20px] text-[14px] text-[#4F4F4F] border border-[#e2E1FF] rounded-full">Sign again</button>
          }
        </div>
      </section>
    </>
    
  )
}

export default Signature