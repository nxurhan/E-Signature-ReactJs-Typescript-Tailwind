import { atom } from "jotai"
import { PDFDocumentProxy } from 'pdfjs-dist';
// 分messageBox 和 dialog

// messageBox: 文字內容、樣式
interface MessageBox {
  isDisplay: boolean,
  isMask: boolean,
  dialogName: string,
  content: string,
  basicStyle?: string,
  logoStyle?: string
}
interface Dialog {
  isDisplay: boolean,
  dialogName: string,
  props?: {
    id?: number
  }
}
export interface Sign {
  id: number,
  title: string,
  image: string,
}

interface OutputDocument {
  page: number
  isEdit: boolean
  width: number
  height: number
  imageUrl: any
}
// const messageBox = 

// dialog: 燈箱名稱，props 

// Jotai implementation
export const messageBox = atom<MessageBox>({isDisplay: false, isMask: false, dialogName: '', content: ""})
export const dialogAtom = atom<Dialog>({isDisplay: false, dialogName: '', props: {}})
export const signListAtom = atom<Sign[]>([])
export const pdfAtom = atom<PDFDocumentProxy | null>(null)
export const stepAtom = atom<number>(1)
export const stepDirectionAtom = atom<{from: number | null, to: number | null}>({from: 1, to: null})
export const pdfCombinePageAtom = atom<number>(1)
export const signToPdfAtom = atom<{page: number, imageUrl: string} | null>(null)
export const outputDocumentArr = atom<(OutputDocument | null)[]>([])
export const outputInfoAtom = atom<{isSubmit: boolean, docName: string, extension: string}>({
  isSubmit: false,
  docName: "",
  extension: "pdf"
})


export const setCurrentStep = atom(
  () => "",
  (get, set, {step}) => {
    set(stepAtom, step)
  }
)

export const setStepDirection = atom(
  () => "",
  (get, set, {from, to}) => {
    set(stepDirectionAtom, {from, to})
  }
)

export const displayMessageBox = atom(
  () => "",
  (get, set, props: MessageBox) => {
    set(messageBox, props)
    setTimeout(() => {
      set(messageBox, {isDisplay: false, isMask: false, dialogName: '', content: ''})
    }, 3000)
  }
)
export const displayDialog = atom(
  () => "",
  (get, set, props: Dialog) => {
    set(dialogAtom, props)
  }
)

export const setSignList = atom(
  () => "",
  (get, set) => {
    let signList = localStorage.getItem('signList')
    if(signList !== null) {
      const currentList = JSON.parse(signList)
      set(signListAtom, currentList)
    }
  }
  
)

export const addSign = atom(
  () => "",
  (get, set, props: Sign) => {
    let signList = localStorage.getItem('signList')
    if(signList !== null) {
      const currentList = JSON.parse(signList)
      currentList.unshift(props)
      set(signListAtom, currentList)
      localStorage.setItem('signList', JSON.stringify(currentList))
    }else {
      localStorage.setItem('signList', JSON.stringify([props]))
      set(signListAtom, [props])
    }
  }
)

export const removeSign = atom(
  () => "",
  (get, set, {id}) => {
    const oldList = get(signListAtom)
    const newList = oldList.filter(i => i.id !== id)
    let signList = localStorage.getItem('signList')
    if(signList !== null) {
      localStorage.setItem('signList', JSON.stringify(newList))
      set(signListAtom, newList)
    }
  }
)

export const clearSignatureList = atom(
  () => "",
  (get, set) => {
    localStorage.setItem('signList', JSON.stringify([]))
    set(signListAtom, [])
  }
)

export const setPdf = atom(
  () => "",
  (get, set, {pdf}) => {
    set(pdfAtom, pdf)
  }
)

export const setPdfCombinePage = atom(
  () => "",
  (get, set, {page}) => {
    set(pdfCombinePageAtom, page)
  }
)

export const setSignToPdf = atom(
  () => "",
  (get, set, {page, imageUrl}) => {
    set(signToPdfAtom, {page, imageUrl})
    setTimeout(() => {
      set(signToPdfAtom, {page: 0, imageUrl: ""})
    }, 100)
  }
)

export const setOutputDocumentArr = atom(
  () => "",
  (get, set, {document}) => {
    // 檢查裡面有無那個page，沒有的話直接push，有的話替換掉imageUrl
    if(document === null) {
      set(outputDocumentArr, [])
      return
    }
    const {page, isEdit, imageUrl, width, height} = document
    const find = get(outputDocumentArr).find(i => i && i.page === page)
    let newDocuments
    
    if(find) {
      newDocuments = get(outputDocumentArr).map(i => {
        if(i && i.page === page) {
          i.imageUrl = imageUrl
          i.isEdit = isEdit
          if(width || height) {
            i.width = width
            i.height = height
          }
        }
        return i
      })
      set(outputDocumentArr, newDocuments)
    } else {  
      newDocuments = [...get(outputDocumentArr), document]
    }
    set(outputDocumentArr, newDocuments)
  }
)

export const setOutputInfo = atom(
  () => "",
  (get, set, props: {isSubmit?: boolean, docName?: string, extension?: string}) => {
    let currentInfo = get(outputInfoAtom)
    set(outputInfoAtom, {...currentInfo, ...props})
    if(props.isSubmit) {
      const timer = setTimeout(() => {
        currentInfo = get(outputInfoAtom)
        set(outputInfoAtom, {...currentInfo, isSubmit: false})
        clearTimeout(timer)
      }, 3000)
    }
  }
)