import { useAtom } from "jotai"
import { messageBox } from '@/store/index'
import AlertIcon from '@/components/svg/Alert'
const MessageBox = () => {
  const [message, _] = useAtom(messageBox)
  return (
    <section className={`flex items-center messageBox text-[#333333] translate-x-[-50%] translate-y-[100px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] ${message.basicStyle} ${message.isDisplay ? 'messageBox--open' : 'messageBox--close'}`}> 
      {
        message.dialogName === 'alert' && <div className={`mr-[12px] ${message.logoStyle}`}>
        <AlertIcon />
      </div>
      }
      <span>{message.content}</span>
    </section>
  )
}

export default MessageBox