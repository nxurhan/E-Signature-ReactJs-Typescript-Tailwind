import MessageBox from "@/components/dialog/Messagebox"
import RemoveSignDialog from "@/components/dialog/RemoveSign"
import { useAtom } from "jotai"
import { dialogAtom, displayDialog } from '@/store/index'
const Dialog = () => {
  const [dialog,] = useAtom(dialogAtom)
  const [, setDialog] = useAtom(displayDialog)
  const handleCloseDialog = (e:React.SyntheticEvent) => {
    if(e.target === e.currentTarget) {
      setDialog({isDisplay: false, dialogName: '', props: {}})
    }
  }

  return (
    <section>
      {
        dialog.isDisplay && <div onClick={handleCloseDialog} className="flex-center fixed top-0 left-0 right-0 w-full min-h-screen bg-[#000] bg-opacity-50 z-[90]">
          {dialog.dialogName === 'removeSign' && <RemoveSignDialog />}
        </div>
      }
      <MessageBox />
    </section>
  )
}

export default Dialog