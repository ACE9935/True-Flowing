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
import { setQRCodeMetaLogo } from "../../qr-code-state/qr-code-state";
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
          <p
            className="text-lg text-center font-medium text-slate-600 relative"
          >
            {configurations.client.introductorytext}
          </p>
        </div>
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


