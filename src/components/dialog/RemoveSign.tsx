import { useAtom } from "jotai"
import { dialogAtom ,displayDialog, removeSign } from '@/store/index'
const RemoveSignDialog = () => {
  const [dialog,] = useAtom(dialogAtom)
  const [, setDialog] = useAtom(displayDialog)
  const [, setRemoveSign] = useAtom(removeSign)
  const handleCloseDialog = () => {
    setDialog({isDisplay: false, dialogName: '', props: {}})
  }
  const handleRemoveSign = () => {
    if(dialog.props) {
      setRemoveSign({ id: dialog.props.id })
      handleCloseDialog()
    }
  }
  return (
    <section className="flex flex-col items-center max-w-[90%] sm:max-w-[300px] w-full h-[187px] py-[20px] text-[#000] bg-[#fff] rounded-tl-[30px] rounded-tr-[30px] rounded-bl-[30px]">
      <h4>Delete the signature ?</h4>
      <button onClick={handleRemoveSign} className="flex-center w-[180px] h-[40px] mt-[32px] mb-[12px] text-[14px] text-[#F2F2F2] bg-[#FF7070] rounded-full">Delete</button>
      <button onClick={handleCloseDialog} className="flex-center w-[180px] h-[40px] text-[14px] text-[#4F4F4F] bg-[#E5E6F2] rounded-full">Cancel</button>
    </section>
  )
}

export default RemoveSignDialog