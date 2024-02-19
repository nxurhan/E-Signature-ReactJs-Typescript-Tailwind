import SignTrashcanIcon from "@/components/svg/SignTrashcan"
import PlusIcon from "@/components/svg/Plus"
import { useAtom } from "jotai"
import { stepAtom, Sign, signListAtom, displayDialog, pdfCombinePageAtom, setSignToPdf } from "@/store/index"

const MySign = ({type, onSelectSign}: {type?:string, onSelectSign?: Function}) => {
  const [signList,] = useAtom(signListAtom)
  const [, setDialog] = useAtom(displayDialog)
  const [, displaySignToPdf] = useAtom(setSignToPdf)
  const [step] = useAtom(stepAtom)
  const [pdfCombinePage] = useAtom(pdfCombinePageAtom)
  const handleOpenDialog = (id: number) => {
    setDialog({isDisplay: true, dialogName: 'removeSign', props: {id}})
  }

  const handleSelectSign = (e: any, imageUrl: string) => {
    if (onSelectSign && type === "allowSelect") {
      onSelectSign(imageUrl)
    }
  }

  const handleAddToPdf = (image: string) => {
    displaySignToPdf({page: pdfCombinePage, imageUrl: image})
  }
  return (
    <div className="flex flex-col flex-none w-full lg:w-[188px]">
      <h4 className="flex-none text-[#4F4F4F]">My signature & IDs</h4>
      <div className="flex-grow mt-[20px] lg:pt-[12px] pr-[4px] border border-[#FFFFFF] rounded-[5px]">
        <ul className="ctr-scrollbar overflow-x-auto lg:overflow-y-auto flex lg:flex-col items-center w-full max-h-[164px] lg:h-[500px] lg:max-h-full p-[12px] lg:p-0">
          {
            signList.length 
            ? signList.map((sign: Sign) => (
              <li onClick={(e) => handleSelectSign(e, sign.image)} key={sign.id} className="shrink-0 relative signCard w-[160px] p-[8px] bg-[#FFFFFF80] rounded-[5px]">
                <h5 className="mb-[8px] text-[14px]">{ sign.title }</h5>
                <div className="h-[70px]">
                  <img src={ sign.image } alt="" className="object-contain w-full h-full bg-[#fff]" />
                </div>
                {
                  step === 3 ? (
                    <button onClick={() => handleAddToPdf(sign.image)} className="animation opacity-0 absolute right-0 bottom-0 flex-center w-[32px] h-[32px] bg-[#787CDA] rounded-[5px]"><PlusIcon /></button>
                  ):(
                    <button onClick={() => handleOpenDialog(sign.id)} className="animation opacity-0 absolute right-0 bottom-0 flex-center w-[32px] h-[32px] bg-[#FF7070] rounded-[5px]"><SignTrashcanIcon /></button>
                  )
                }
              </li>
            ))
            : <div>No signature</div> 
          }
        </ul>
      </div>
    </div>
  )
}

export default MySign