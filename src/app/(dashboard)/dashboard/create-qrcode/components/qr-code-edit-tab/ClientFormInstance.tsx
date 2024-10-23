"use client"
import ClientInput from "@/app/(client-pages)/client/[...provider]/components/ClientInput";
import PhoneInput from "@/app/(client-pages)/client/[...provider]/components/PhoneInput";
import { Cancel, CancelOutlined, Check, Close, Edit } from "@mui/icons-material";
import ImageUpload from "./ImageUpload";
import { useState, useRef, FormEvent } from "react";
import { configurations } from "@/app-configurations";
import styled from '@emotion/styled';
import { css } from "@emotion/react";
import resolveConfig from "tailwindcss/resolveConfig";
import Config from "../../../../../../../tailwind.config";
import { useAppDispatch, useAppSelector } from "../../qr-code-state/hooks";
import { setQRCodeMetaIntroductoryText, setQRCodeMetaLogo } from "../../qr-code-state/qr-code-state";
import { TransitionalComponent } from "./QrcodeEditor";
import { useUser } from "@/context/authContext";

const tailwindConfig = resolveConfig(Config);
const colors = tailwindConfig.theme?.colors as unknown as { [key: string]: string };
const primaryBlue = colors["primary-black"];

export const StyledEditableText = styled.p<{ contentEditable: boolean }>`
  ${(props) =>
    props.contentEditable &&
    css`
      border-radius: 8px !important;
      outline: 1px solid lightgray;
      padding: 0.4rem;
      :hover {
        outline-width: 2px;
      }
      :focus {
        outline: 2px solid ${primaryBlue || "black"};
      }
    `}
`;

function ClientFormInstance({ handlerForward, handlerPrevious, editorMode }: TransitionalComponent) {
  const [logoUrl, setLogoUrl] = useState(configurations.userImg);
  const dispatch = useAppDispatch();
  const qrCodeState = useAppSelector(state => state.qrCode);
  const {user}=useUser()
  const [introductoryText, setIntroductoryText] = useState(configurations.client.introductorytext);
  const [editIntroductoryText, setEditIntroductoryText] = useState(false);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  const saveCaretPosition = (element: HTMLElement | null) => {
    if (!element) return 0;
    let caretOffset = 0;
    const doc = element.ownerDocument;
    const win = doc?.defaultView || window;
    const sel = win.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
    }
    return caretOffset;
  };

  const restoreCaretPosition = (element: HTMLElement | null, offset: number) => {
    if (!element) return;
    const charIndex = offset;
    const nodeStack: Node[] = [element];
    let foundStart = false;
    let stop = false;
    let range = document.createRange();
    range.setStart(element, 0);
    range.collapse(true);
    let node: Node | undefined;
    let charCount = 0;

    while (!stop && (node = nodeStack.pop())) {
      if (node.nodeType === 3) {
        const nextCharCount = charCount + (node.textContent?.length || 0);
        if (!foundStart && charIndex >= charCount && charIndex <= nextCharCount) {
          range.setStart(node, charIndex - charCount);
          range.setEnd(node, charIndex - charCount);
          foundStart = true;
          stop = true;
        }
        charCount = nextCharCount;
      } else {
        let i = node.childNodes.length;
        while (i--) {
          nodeStack.push(node.childNodes[i]);
        }
      }
    }

    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const handleContentChange = (e: FormEvent<HTMLParagraphElement>) => {
    const caretOffset = saveCaretPosition(paragraphRef.current);
    dispatch(setQRCodeMetaIntroductoryText(e.currentTarget.innerText));
    setTimeout(() => restoreCaretPosition(paragraphRef.current, caretOffset), 0);
  };

  return (
    <div className="p-9 rounded-lg w-full max-w-[30rem] flex flex-col items-center gap-4 border-2">
      <div className="flex flex-col gap-4">
        <div className="relative self-center">
          <img src={
            typeof qrCodeState.meta.logoImg == "string" ?
              qrCodeState.meta.logoImg
              : qrCodeState.meta.logoImg ? URL.createObjectURL(qrCodeState.meta.logoImg) : user?.photoUrl
          } className="w-auto h-[6rem]" />

          <div className="absolute right-0 bottom-0">
            <ImageUpload setUrl={setLogoUrl} setImage={(img: File) => dispatch(setQRCodeMetaLogo(img))} url={logoUrl} />
          </div>
        </div>
        <div className="relative w-full">
          <StyledEditableText
            suppressContentEditableWarning={true}
            onInput={handleContentChange}
            ref={paragraphRef}
            className="text-lg text-center font-medium text-slate-600 relative"
            autoFocus={editIntroductoryText}
            contentEditable={editIntroductoryText}
          >
            {qrCodeState.meta.introductoryText}
          </StyledEditableText>
          {!editIntroductoryText && (
            <button
              onClick={() => setEditIntroductoryText(true)}
              className="rounded-full hover:bg-primary-color text-primary-color hover:text-white transition-all bg-slate-200 w-[2.6rem] aspect-square cursor-pointer absolute bottom-0 right-0"
            >
              <Edit />
            </button>
          )}
        </div>
        {editIntroductoryText && (
          <div className="flex gap-2 m-1">
            <button
              className="rounded-full hover:bg-green-500 hover:text-white transition-all p-1 h-fit"
              onClick={() => {
                if (qrCodeState.meta.introductoryText != "") setEditIntroductoryText(false);
              }}
            >
              <Check />
            </button>
            <button
              className="rounded-full hover:bg-red-500 hover:text-white transition-all p-1 h-fit"
              onClick={() => {
                setEditIntroductoryText(false);
                dispatch(setQRCodeMetaIntroductoryText(configurations.client.introductorytext));
              }}
            >
              <Close />
            </button>
          </div>
        )}
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4 w-[90%]">
        <ClientInput label="Your name" />
        <ClientInput label="Your email" />
        <PhoneInput value="" onChange={() => 0} label="Phone number" />
        <div className="flex gap-2 self-center">
          {handlerPrevious && <button onClick={handlerPrevious} className="outline-primary-color p-3 font-bold rounded-full text-primary-color self-center px-6 flex gap-2 outline">
            Previous
          </button>}
          <button onClick={handlerForward} className="bg-primary-color p-3 font-bold rounded-full text-white self-center px-6 flex gap-2">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}

export default ClientFormInstance;


